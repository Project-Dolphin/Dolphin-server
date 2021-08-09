import got from 'got';
import { parse } from 'node-html-parser';

interface Notice {
  title: string;
  date: string;
  link?: string;
}

export class NoticeService {
  private readonly url = 'https://www.kmou.ac.kr/kmou/main.do#notice';
  private readonly kmouUrl = 'https://www.kmou.ac.kr';

  public async getMainNotice(): Promise<Notice[]> {

    const notices: Notice[] = [];

    const rawText = await got.get(this.url);
    const root = parse(rawText.body);

    const noticeHtmls = root.querySelectorAll(".notibox");
    console.log('noticeHtmls[0] : ', noticeHtmls[0]);
    const list = noticeHtmls[0].querySelector('.list_box');
    console.log('list : ', list)
    if (list != null) {
      const contents = list.querySelectorAll('li');

      contents.forEach((content) => {
        const titleData = content.querySelector('a');
        const dateData = content.querySelector('span');

        notices.push({
          title: titleData.rawText.trim(),
          date: dateData.rawText.replace(/\./g, '-'),
          link: this.kmouUrl.concat(titleData.attributes.href),
        });
      });

    }

    console.log(notices);

    return notices;
  }
}
