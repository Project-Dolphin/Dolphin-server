import got from 'got';

// interface LibraryNotice {
//   id: string;
//   subject: string;
//   link: string;
//   title: string;
//   writer: string;
//   reportDate: string; // 2021-07-12
//   viewCount: number;
// }

interface Column {
  data: string;
}

export class NoticeService {
  private readonly libraryUrl = 'https://library.kmou.ac.kr/bbs/list/1';
  async getLibraryNotices(): Promise<Column[]> {
    const result = await got.get(this.libraryUrl);
    // fs.writeFileSync('library.html', result.body.toString());
    const rawBody = result.body;
    const noticeTable = this.parseTable(rawBody);
    const rows = this.parseRows(noticeTable);
    //console.log(rows[5]);
    const column = this.parseColumns(rows[5]);
    //console.log('column: ', column);
    return column;
  }
  private parseTable(rawBody: string): string {
    const start = rawBody.indexOf('<tbody');
    const end = rawBody.indexOf('</tbody>') + '</tbody>'.length;

    //console.log(start, end);
    return rawBody.substring(start, end).replace(/\s/g, '');
  }
  private parseRows(table: string): string[] {
    const rows = table.split('<tr');

    return rows;
  }

  private parseColumns(row: string): Column[] {
    const columns = row.split('</td>').filter((column) => column.includes('td'));
    //console.log(columns);
    const parsedColumns = columns.map((column) => {
      const data = column.replace(/<(“[^”]*”|'[^’]*’|[^'”>])*>/g, '');
      return {
        data: data,
      };
    });

    //console.log(parsedColumns);
    return parsedColumns;
  }
}
