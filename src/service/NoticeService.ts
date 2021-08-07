// import got from 'got';

// interface LibraryNotice {
//   id: string;
//   subject: string;
//   link: string;
//   title: string;
//   writer: string;
//   reportDate: string; // 2021-07-12
//   viewCount: number;
// }

// interface Column {
//   data: string;
// }

interface Notice {
  title: string;
  date: string;
  link: string;
}

export class NoticeService {
  public async getMainNotice(): Promise<Notice[]> {
    const notices = [
      {
        title: '「RHS 레벨2 정원원예원론 자격」교육생 모집 안내',
        date: '2021-08-06',
        link: '',
      },
      {
        title: '한국체육대학교 3D프린터와 아두이노 활용 공개강좌 안내',
        date: '2021-08-06',
        link: '',
      },
      {
        title: '[한국인터넷진흥원] 제4차 가명처리 예비인재 양성과정 교육생 모집 안내',
        date: '2021-08-06',
        link: '',
      },
      {
        title: '(교육부) LINC+ 영상콘텐츠 공모전 참가팀 모집',
        date: '2021-08-05',
        link: '',
      },
      {
        title: '한국해양대학교 종합감사 관련 제보 안내',
        date: '2021-08-05',
        link: '',
      },
      {
        title: '(교육부) LINC+ 캡스톤디자인 경진대회 참가팀 모집',
        date: '2021-08-05',
        link: '',
      },
    ];
    return notices;
  }
  // private readonly libraryUrl = 'https://library.kmou.ac.kr/bbs/list/1';
  // async getLibraryNotices(): Promise<Column[]> {
  //   const result = await got.get(this.libraryUrl);
  //   // fs.writeFileSync('library.html', result.body.toString());
  //   const rawBody = result.body;
  //   const noticeTable = this.parseTable(rawBody);
  //   const rows = this.parseRows(noticeTable);
  //   //console.log(rows[5]);
  //   const column = this.parseColumns(rows[5]);
  //   //console.log('column: ', column);
  //   return column;
  // }
  // private parseTable(rawBody: string): string {
  //   const start = rawBody.indexOf('<tbody');
  //   const end = rawBody.indexOf('</tbody>') + '</tbody>'.length;
  //   //console.log(start, end);
  //   return rawBody.substring(start, end).replace(/\s/g, '');
  // }
  // private parseRows(table: string): string[] {
  //   const rows = table.split('<tr');
  //   return rows;
  // }
  // private parseColumns(row: string): Column[] {
  //   const columns = row.split('</td>').filter((column) => column.includes('td'));
  //   //console.log(columns);
  //   const parsedColumns = columns.map((column) => {
  //     const data = column.replace(/<(“[^”]*”|'[^’]*’|[^'”>])*>/g, '');
  //     return {
  //       data: data,
  //     };
  //   });
  //   //console.log(parsedColumns);
  //   return parsedColumns;
  // }
}
