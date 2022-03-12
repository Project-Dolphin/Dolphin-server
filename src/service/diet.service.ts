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
  student: SocietyDiet[];
  snack: SocietyDiet[];
  staff: SocietyDiet[];
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
          type: index + 2,
          value: this.replaceSpecialCharacters(rawBody(element).html()?.toString() || ''),
        });
      },
    );
    // 에러 수정
    results[0].type = 0;
    results.splice(1, 0, { type: 1, value: '' });
    results.splice(2, 0, { type: 2, value: '' });

    if (results.length === 3 && results[0].value.includes('년')) {
      return 'DietService.getSocietyDietAsync: There are no any diet';
    }

    return results;
  }

  private replaceSpecialCharacters(content: string | null): string {
    return content
      ? content
          .replace(/<br>/g, '\n')
          .replace(/&nbsp;/g, ' ')
          .replace(/&amp;/g, '&')
          .trim()
      : '';
  }

  private isDateString(menu: string): boolean {
    const dateRegEx = /^(19|20)\d{2}년 (0[1-9]|1[012])월 (0[1-9]|[12][0-9]|3[0-1])일$/g;
    if (menu.match(dateRegEx)) {
      return true;
    } else {
      return false;
    }
  }

  private getConvertedMenus(html: string): string[] {
    return html
      .split('<br>')
      .filter((menu) => menu !== '')
      .map((menu) => this.replaceSpecialCharacters(menu.replace(/\t|\n/g, '')))
      .filter((menu) => !this.isDateString(menu));
  }

  private getDietsByIndex(index: number, dietTypes: SocietyDietType[]) {
    return dietTypes
      .filter((diet) => diet.index === index)
      .map((diet) => {
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
    const menus: string[][] = [];
    const societyDiet: SocietyDietResult = {
      student: [],
      snack: [],
      staff: [],
    };

    if (rawBody('.detail_tb').length === 3) {
      rawBody('.detail_tb').each((tableIndex, element) => {
        rawBody(element)
          .find('thead > tr > th')
          .each((index, element) => {
            dietTypes.push({
              index: tableIndex,
              type: rawBody(element).html()?.toString() || '',
              data: [],
            });
          });
      });

      rawBody('.detail_tb')
        .find('tbody > tr > td')
        .each((index, element) => {
          if (rawBody(element).html()) {
            const html = rawBody(element).html() || '';
            menus.push(this.getConvertedMenus(html.toString()));
          }
        });

      /**
       * 중식이 없을 경우 빈 배열을 넣어준다.
       */
      if (dietTypes.length !== menus.length) {
        menus.unshift([]);
      }

      menus.forEach((menu, index) => {
        dietTypes[index].data = menu;
      });

      societyDiet.student = this.getDietsByIndex(0, dietTypes);
      societyDiet.snack = this.getDietsByIndex(1, dietTypes);
      societyDiet.staff = this.getDietsByIndex(2, dietTypes);
    }
    return societyDiet;
  }
  async getDormDiet(): Promise<DormResultType> {
    const url = 'https://www.kmou.ac.kr/dorm/main.do';
    const result = await got.get(url);
    const rawBody = cheerio.load(result.body);
    const dormDiet: DormResultType = { morning: [], lunch: [], dinner: [] };
    const dietType: Array<'morning' | 'lunch' | 'dinner' | 'none'> = ['none', 'none', 'none'];

    rawBody('.widget64_meal_menu_st_box > table > thead > tr > th').each((index, element) => {
      const thHtml = this.replaceSpecialCharacters(rawBody(element).html());
      switch (thHtml) {
        case '조식':
          dietType[index] = 'morning';
          break;
        case '중식':
          dietType[index] = 'lunch';
          break;
        case '석식':
          dietType[index] = 'dinner';
          break;
        default:
          break;
      }
    });

    rawBody('.widget64_meal_menu_st_box > table > tbody > tr > td').each((index, element) => {
      const tdHtml = this.replaceSpecialCharacters(rawBody(element).html());
      const diet = tdHtml?.split('\n').filter((menu) => menu !== '');
      if (diet && index < dietType.length) {
        if (dietType[index] !== 'none') {
          dormDiet[dietType[index]] = diet;
        }
      }
    });

    return dormDiet;
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
      console.log('elemnt: ', rawBody(element).html());
    });
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
    console.log('resultUrl: ', resultUrl);
    return resultUrl;
  }
}
