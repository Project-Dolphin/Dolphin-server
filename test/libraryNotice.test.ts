import { NoticeService } from '../src/service/NoticeService';

const noticeService = new NoticeService();

describe('notice test', () => {
  it('getLibraryNotices test - 1', async (done) => {
    const result = await noticeService.getLibraryNotices();
    console.log(result);
    expect(result).toBeTruthy();
    done();
  });
});
