import got from 'got';
import { parse } from 'node-html-parser';

interface Notice {
  title: string;
  date: string;
  link?: string;
}

export class NoticeService {
  //private readonly url = 'http://www.kmou.ac.kr/kmou/main.do';
  private readonly kmouUrl = 'https://www.kmou.ac.kr';

  public async getMainNotice(): Promise<Notice[]> {

    const infuncUrl = 'https://www.kmou.ac.kr/kmou/main.do'

    const notices: Notice[] = [];

    const rawText = await got.get(infuncUrl);
    const root = parse(rawText.body);

    //#container > div.main_content > div.M_con2 > div.notice > div.notibox.on > div.list_box > ul

    const container = root?.querySelector("#container");
    const mainContent = container?.querySelector(".main_content")
    const con2 = mainContent?.querySelector(".M_con2")
    const notice = con2?.querySelector(".notice")
    const notibox = notice?.querySelector(".notibox");

    const list = notibox?.querySelector(".list_box")
    const ul = list?.querySelector("ul")

    /*const noticeHtmls = root.querySelector(".notice");
    console.log('noticeHtmls : ', noticeHtmls);
    const notiBox0 = noticeHtmls?.querySelector(":notibox .list_box")
    console.log('notiBox0 : ', notiBox0)
    const list = notiBox0?.querySelector('.list_box');*/
    console.log('ul : ', ul);
    if (ul != null) {
      const contents = ul.querySelectorAll('li');

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

    console.log('notices : ', notices)

    return notices;
  }
}
