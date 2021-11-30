import cheerio from 'cheerio';
import DayJS from 'dayjs';
import got from 'got';

const enum DietType {
  English = 0, // 양식코너
  Event = 1, // 천원의 아침
  Ramen = 2, // 라면코너
  SnackBar = 3, // 분식코너
  Bowl = 4, // 덮밥
  StaffNoraml = 5, // 교직원 중식
  StaffPremium = 6, // 교직원 일품식
}

const removeSpecialCharacters = (content: string | null): string => {
  if (!content) {
    return '';
  }

  return content
    .replace(/<br>/g, '\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .trim();
};

export interface SocietyResultType {
  type: DietType;
  value: string;
}

export interface NavalResultType {
  lunch: string[];
  dinner: string[];
}

export interface DormResultType {
  morning: string[];
  lunch: string[];
  dinner: string[];
}

export interface SocietyDietType {
  index: number;
  type: string;
  data: string[];
}

export interface SocietyDiet {
  type: string;
  menus: string[];
}

export interface SocietyDietResult {
  student: SocietyDiet[],
  snack: SocietyDiet[],
  staff: SocietyDiet[],
}

// 어울림관: https://www.kmou.ac.kr/coop/dv/dietView/selectDietDateView.do
// 해사대: http://badaro.kmou.ac.kr/food
export class DietService {
  private readonly societyUrl = 'https://www.kmou.ac.kr/coop/dv/dietView/selectDietDateView.do';
  private readonly navalBaseUrl = 'http://badaro.kmou.ac.kr';

  async getSocietyDietAsync(): Promise<SocietyResultType[] | string> {
    const results: SocietyResultType[] = [];
    const result = await got.get(this.societyUrl);
    const rawBody = cheerio.load(result.body);
    rawBody('body > div > div > div > div > section > div > div > div > form > div > table > tbody > tr > td').each(
      (index, element) => {
        results.push({
          type: index,
          value: removeSpecialCharacters(rawBody(element).html()),
        });
      },
    );

    if (results.length === 3 && results[0].value.includes('년')) {
      return 'DietService.getSocietyDietAsync: There are no any diet';
    }

    return results;
  }

  private getConvertedtMenus(html: string): string[] {
    return html.split('<br>').filter(menu => menu !== '').map(menu => menu.replace(/\t|\n/g, ''));
  }

  private getDietsByIndex(index: number, dietTypes: SocietyDietType[]) {
    return dietTypes.filter((diet) => diet.index === index).map(diet => {
      return {
        type: diet.type,
        menus: diet.data,
      };
    });
  }

  public async getSocietyDiet(): Promise<SocietyDietResult> {
    const result = await got.get(this.societyUrl);
    const rawBody = cheerio.load(result.body);
    const dietTypes: SocietyDietType[] = [];
    const societyDiet: SocietyDietResult = {
      student: [],
      snack: [],
      staff: [],
    }
    if (rawBody('.detail_tb').length === 3) {
      rawBody('.detail_tb').each((tableIndex, element) =>{
        rawBody(element).find('thead > tr > th').each((index, element) => {
          console.log(rawBody(element).html());
          dietTypes.push( {
            index: tableIndex,
            type:rawBody(element).html()?.toString() || '',
            data: []
          });
        });
        
      });
      
      rawBody('.detail_tb').find('tbody > tr > td').each((index, element) => {
        console.log(rawBody(element).html());
        if (rawBody(element).html()) {
          const html = rawBody(element).html() || '';
          dietTypes[index].data = this.getConvertedtMenus(html.toString());
        }
      })

      societyDiet.student = this.getDietsByIndex(0, dietTypes);
      societyDiet.snack = this.getDietsByIndex(1, dietTypes);
      societyDiet.staff = this.getDietsByIndex(2, dietTypes);
    
    }
    console.log(societyDiet);
    return societyDiet;
  }
  async getDormDiet(): Promise<DormResultType> {
    const url = 'https://www.kmou.ac.kr/dorm/main.do';
    const result = await got.get(url);
    const rawBody = cheerio.load(result.body);
    const diets: string[][] = [];
    rawBody('.widget64_meal_menu_st_box > table > tbody > tr > td').each((index, element) => {
      const tdHtml = rawBody(element).html()
      const diet = tdHtml?.split('<br>').filter(menu => menu !== '').map(menu => menu.replace(/\t|\n/g, ''));
      if (diet) {
        diets.push(diet);
      }
    });
   
    return {
      morning: diets.length > 0 ? diets[0] : [],
      lunch: diets.length > 1 ? diets[1] : [],
      dinner: diets.length > 2 ? diets[2] : [],
    };
  }

  async getNavalDietAsync(): Promise<NavalResultType | string> {
    const results: string[] = [];
    let foundToday = false;
    const fisrtItemUrl = await this.getFirstItemPathFromNaval();
    const result = await got.get(fisrtItemUrl);
    const rawBody = cheerio.load(result.body);
    const todayMMddFormat = DayJS().format('MM/DD').replace('0', '').replace('/0', '/');
    console.log('today: ', todayMMddFormat);
    rawBody('div > section > section > div > div > div > div > div > table > tbody > tr > td').each(
      (index, element) => {
        if (foundToday && rawBody(element).html()?.startsWith('<strong>')) {
          return false;
        }
        if (foundToday) {
          results.push(rawBody(element).text());
        }
        if (rawBody(element).html()?.includes(todayMMddFormat)) {
          foundToday = true;
        }

        return true;
      },
    );

    console.log('results: ', results);
    if (!foundToday) {
      return 'DietService.getNavalDietAsync: There are no any diet';
    }
    
    return {
      lunch: results.filter((_, index) => index % 2 === 0),
      dinner: results.filter((_, index) => index % 2 !== 0),
    };
  }
  public async getNavalDayDiet() {
    const navelUrl = 'http://badaro.kmou.ac.kr/food/3179';
    const result = await got.get(navelUrl);
    const rawBody = cheerio.load(result.body);
    const tableSelector = 'div > section > section > div > div > div > div > div > table > tbody > tr';
    console.log(rawBody);

    rawBody(tableSelector).map((index, element) => {
      console.log("elemnt: ",  rawBody(element).html());
      
    })
  }

  private async getFirstItemPathFromNaval(): Promise<string> {
    let resultUrl = '';
    const result = await got.get(`${this.navalBaseUrl}/food`);
    const rawBody = cheerio.load(result.body);
    rawBody('div > section > section > div > div > div > table > tbody > tr > td > a').each((index, element) => {
      if (index === 0) {
        resultUrl = `${this.navalBaseUrl}${rawBody(element).attr('href')}`;
        return false;
      }

      return true;
    });
    console.log("resultUrl: ", resultUrl);
    return resultUrl;
  }
}
