import { DietService } from '../src/service/DietService';

const dietService = new DietService();

describe('diet test', () => {
  // it('getDiet test - 1', async (done) => {
  //   const result = await dietService.getSocietyDietAsync();
  //   expect(result).toBeTruthy();
  //   done();
  // });
  // it('getDormDiet test - 1', async (done) => {
  //   const result = await dietService.getDormDiet();
  //   console.log("result: ", result);
  //   expect(result).toBeTruthy();
  //   done();
  // });
  it('getSocietyDiet test - 1', async (done) => {
    const result = await dietService.getSocietyDiet();
    expect(result).toBeTruthy();
    done();
  });
});
