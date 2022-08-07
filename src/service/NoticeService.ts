import got from 'got';
import cheerio from 'cheerio';
import { cacheClient } from './cachingService';

export interface Notice {
  title: string;
  date: string;
  link: string;
}

export class NoticeService {
  private readonly baseKey = 'notice';
  private readonly url = 'http://www.kmou.ac.kr/kmou/main.do';
  private readonly kmouUrl = 'https://www.kmou.ac.kr';

  public async getAcademicNotice(): Promise<Notice[]> {
    const cachedAcademicNotices = cacheClient.getCache<Notice[]>(this.baseKey + '/academic');
    if (cachedAcademicNotices) {
      console.log('get cache! : ', cachedAcademicNotices);
      return cachedAcademicNotices;
    }

    try {
      const notices: Notice[] = [];
      const rawText = await got.get(this.url);
      const rawBody = cheerio.load(rawText.body);
      const parsedList = rawBody('.list_box > ul').eq(1);
      parsedList.children('li').each((index, element) => {
        const content = rawBody(element);
        notices.push({
          title: content.children('a').text().trim(),
          link: this.kmouUrl.concat(content.children('a').attr('href') || ''),
          date: content.children('span').text().replace(/\./g, '-'),
        });
      });

      cacheClient.setCache(this.baseKey + '/academic', notices, 10 * 60); // 10분 캐싱

      return notices;
    } catch (error) {
      throw new Error("학사정보를 불러오는데 실패하였습니다.");
    }
  }
}

export const noticeService = new NoticeService();
