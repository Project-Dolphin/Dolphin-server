import { BusService } from '../src/service/BusService';

const busService = new BusService();

describe('All node test', () => {
  it('getAllNode test - 1', async (done) => {
    const result = await busService.getAllNode();
    expect(result).toBeTruthy();
    done();
  });
});

describe('Specific node test', () => {
  it('getSpecificNode test - 1', async (done) => {
    const result = await busService.getSpecificNode('167720201');
    expect(result).toBeTruthy();
    done();
  });
});

describe('190 depart test', () => {
  it('getDepart190 test - 1', async (done) => {
    const result = busService.getDepart190();
    expect(result).toBeTruthy();
    done();
  });
});