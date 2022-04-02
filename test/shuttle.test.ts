import { ShuttleService } from '../src/service/ShuttleService';

const shuttleService = new ShuttleService();

describe('next shuttle test', () => {
  it('getNextShuttle test - 1', async (done) => {
    const result = await shuttleService.getNextShuttle();
    expect(result).toBeTruthy();
    done();
  });
});

describe('get all shuttle test', () => {
  it('getAllShuttle test - 1', async (done) => {
    const result = await shuttleService.getAllShuttle();
    expect(result).toBeTruthy();
    done();
  });
});
