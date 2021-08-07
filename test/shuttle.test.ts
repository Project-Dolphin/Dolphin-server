import { ShuttleService } from '../src/service/ShuttleService';

const shuttleService = new ShuttleService();

describe('next shuttle test', () => {
  it('getNextShuttle test - 1', async (done) => {
    const result = await shuttleService.getNextShuttle();
    expect(result).toBeTruthy();
    done();
  });
});