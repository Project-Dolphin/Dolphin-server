import { BusService } from '../src/service/BusService';

const noticeService = new BusService();

describe('library notice test', () => {
  it('getLibraryNotices test - 1', async (done) => {
    const result = await noticeService.getSpecificNode(168540201);
    console.log(result);
    expect(result).toBeTruthy();
    done();
  });
});
