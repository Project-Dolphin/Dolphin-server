import got from 'got';
import { parse } from 'node-html-parser';

interface Notice {
  title: string;
  date: string;
  link?: string;
}

export class NoticeService {
  private readonly url = 'https://www.kmou.ac.kr/kmou/main.do';
  private readonly kmouUrl = 'https://www.kmou.ac.kr';

  public async getMainNotice(): Promise<Notice[]> {

    const notices: Notice[] = [];

    const rawText = await got.get(this.url);
    const root = parse(rawText.body);

    const wrap = root.querySelector("#wrap");
    const box = wrap.querySelector("box_mot_1");
    const container = box?.querySelector("#container");
    const mainContent = container?.querySelector("main_content")
    const con2 = mainContent?.querySelector("M_con2")
    const notice = con2?.querySelector("notice")
    const notibox = notice?.querySelector("notibox");



    //#container > div.main_content > div.M_con2 > div.notice > div.notibox.on > div.list_box
    const list = notibox?.querySelector("list_box > ul")

    /*const noticeHtmls = root.querySelector(".notice");
    console.log('noticeHtmls : ', noticeHtmls);
    const notiBox0 = noticeHtmls?.querySelector(":notibox .list_box")
    console.log('notiBox0 : ', notiBox0)
    const list = notiBox0?.querySelector('.list_box');*/
    console.log('list : ', list);
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

    console.log('notices : ', notices)

    return notices;
  }
}
