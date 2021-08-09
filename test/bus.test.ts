import { BusService } from '../src/service/BusService';

const busService = new BusService();

describe('specific node test', () => {
  it('getAllNode test - 1', async (done) => {
    const result = await busService.getAllNode();
    expect(result).toBeTruthy();
    done();
  });
});