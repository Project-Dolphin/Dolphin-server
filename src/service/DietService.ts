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
    const results: SocietyResultType[] = [
      {
        type: 0,
        value: '',
      },
      {
        type: 1,
        value: '',
      },
      {
        type: 2,
        value: '',
      },
      {
        type: 3,
        value: '',
      },
      {
        type: 4,
        value: '',
      },
      {
        type: 5,
        value: '',
      },
      {
        type: 6,
        value: '',
      },
      {
        type: 7,
        value: '',
      },
      {
        type: 8,
        value: '',
      },
    ];
    const result = await got.get(this.societyUrl);
    const rawBody = cheerio.load(result.body);
    rawBody('.detail_tb').each((index, element) => {
      rawBody(element)
        .find('tbody')
        .each((ii, e) => {
          rawBody(e)
            .find('tr > td')
            .each((i, el) => {
              switch (index) {
                case 0:
                  results[i] = {
                    type: i,
                    value: this.replaceSpecialCharacters(rawBody(el).html()?.toString() || ''),
                  };
                  break;
                case 1:
                  results[i + 2] = {
                    type: i + 2,
                    value: this.replaceSpecialCharacters(rawBody(el).html()?.toString() || ''),
                  };
                  break;
                case 2:
                  results[i + 7] = {
                    type: i + 7,
                    value: this.replaceSpecialCharacters(rawBody(el).html()?.toString() || ''),
                  };
                  break;
                default:
                  break;
              }
            });
        });
    });

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
        .replace(/-/g, '')
        .trim()
      : '';
  }
  private splitItems = (contents: string) => contents.split('\n').filter(item => item);

  public async getSocietyDiet(): Promise<SocietyDietResult> {
    const result = await got.get(this.societyUrl);

    const rawBody = cheerio.load(result.body);
    const societyDiet: SocietyDietResult = {
      student: [],
      snack: [],
      staff: [],
    };

    rawBody('.detail_tb').each((index, element) => {
      rawBody(element)
        .find('thead')
        .each((ii, e) => {
          rawBody(e)
            .find('tr > th')
            .each((i, el) => {
              switch (index) {
                case 0:
                  societyDiet.student.push({
                    type: rawBody(el).html()?.toString() || '',
                    menus: [],
                  });
                  break;
                case 1:
                  societyDiet.snack.push({
                    type: rawBody(el).html()?.toString() || '',
                    menus: [],
                  });
                  break;
                case 2:
                  societyDiet.staff.push({
                    type: rawBody(el).html()?.toString() || '',
                    menus: [],
                  });
                  break;
                default:
                  break;
              }
            });
        });
      rawBody(element)
        .find('tbody')
        .each((ii, e) => {
          rawBody(e)
            .find('tr > td')
            .each((i, el) => {
              switch (index) {
                case 0:
                  if (societyDiet.student?.length > i) {
                    societyDiet.student[i].menus = this.splitItems(this.replaceSpecialCharacters(
                      rawBody(el).html()?.toString() || '',
                    ))
                  }
                  break;
                case 1:
                  if (societyDiet.snack?.length > i) {
                    societyDiet.snack[i].menus = this.splitItems(this.replaceSpecialCharacters(
                      rawBody(el).html()?.toString() || '',
                    ))
                  }
                  break;
                case 2:
                  if (societyDiet.staff?.length > i) {
                    societyDiet.staff[i].menus = this.splitItems(this.replaceSpecialCharacters(
                      rawBody(el).html()?.toString() || '',
                    ))
                  }
                  break;
                default:
                  break;
              }
            });
        });
    });

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
  /**
   * 더이상 사용하지 않음
   */
  public async getNavalDayDiet() {
    // const navelUrl = 'http://badaro.kmou.ac.kr/food/3179';
    // const result = await got.get(navelUrl);
    // const rawBody = cheerio.load(result.body);
    // const tableSelector = 'div > section > section > div > div > div > div > div > table > tbody > tr';


    // rawBody(tableSelector).map((index, element) => {
    //   console.log('elemnt: ', rawBody(element).html());
    // });
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

    return resultUrl;
  }
}

export const dietService = new DietService();
