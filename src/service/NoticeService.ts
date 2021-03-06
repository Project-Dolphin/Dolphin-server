import got from 'got';
import cheerio from 'cheerio';

export interface Notice {
  title: string;
  date: string;
  link: string;
}

export class NoticeService {
  private readonly url = 'http://www.kmou.ac.kr/kmou/main.do';
  private readonly kmouUrl = 'https://www.kmou.ac.kr';

  public async getAcademicNotice(): Promise<Notice[]> {
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
   
    return notices;
  } catch(error) {
    throw new Error("학사정보를 불러오는데 실패하였습니다.");
  }
  }
}

export const noticeService = new NoticeService();
