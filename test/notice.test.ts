import { NoticeService } from '../src/service/NoticeService';

const noticeService = new NoticeService();

describe('library notice test', () => {
  it('getLibraryNotices test - 1', async (done) => {
    const result = await noticeService.getAcademicNotice();
    expect(result).toBeTruthy();
    done();
  });
});
