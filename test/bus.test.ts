import { BusServiceNew } from '../src/service/BusServiceNew';

const busService = new BusServiceNew();

// describe('All node test', () => {
//   it('getAllNode test - 1', async (done) => {
//     const result = await busService.getBusInfoByRouteId('190');
//     expect(result).toBeTruthy();
//     done();
//   });
// });

// describe('Specific node test', () => {
//   it('getSpecificNode test - 1', async (done) => {
//     const result = await busService.getSpecificNode('busan_station', '190');
//     expect(result).toBeTruthy();
//     done();
//   });
// });

describe('190 depart test', () => {
  it('getDepart190 test - 1', (done) => {
    const result = busService.getNextDepartBus();
    expect(result).toBeTruthy();
    done();
  });
});

describe('shuttle depart test', () => {
  it('getNextShuttle test - 1', (done) => {
    const result = busService.getNextShuttle();
    expect(result).toBeTruthy();
    done();
  });
});