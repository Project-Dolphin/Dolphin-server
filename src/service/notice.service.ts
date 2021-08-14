import cheerio from 'cheerio';
import got from 'got';

export class NoticeService {
  private readonly mainUrl = 'https://www.kmou.ac.kr/kmou/main.do';

  async getMainNoticesAsync() {
    const result = await got.get(this.mainUrl);
    const rawBody = cheerio.load(result.body);
    rawBody('body > div > div > div > div > div > div > div > div > ul').each((index, element) => {
      console.log(rawBody(element).html());
    });
  }
}
