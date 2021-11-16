import { WeatherService } from '../src/service/weather.service';

const weatherService = new WeatherService();

describe('weather test', () => {
  it('getWeather test - 1', async (done) => {
    const result = await weatherService.getCurrentWeather();
    expect(result).toBeTruthy();
    done();
  });
});
