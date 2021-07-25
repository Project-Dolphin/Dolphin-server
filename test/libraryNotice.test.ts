import { NoticeService } from '../src/service/NoticeService';

const noticeService = new NoticeService();

describe('index test', () => {
  it('test1', (done) => {
    expect(1).toBe(1);
    done();
  });
  it('test2', async (done) => {
    const result = await noticeService.getLibraryNotices();
    console.log(result);
    expect(result).toBeTruthy();
    done();
  });
});
