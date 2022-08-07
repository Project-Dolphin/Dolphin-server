import cheerio from 'cheerio';
import got from 'got';
import { cacheClient } from './CachingService';

export interface WeatherResult {
  status: string;
  temparature: string | number;
  windSpeed: string | number;
  humidity: string | number;
}

export class WeatherService {
  private readonly baseKey = 'weather';
  private readonly weatherUrl = 'https://www.tomorrow.io/weather/ko/KR/26/Yeongdo-gu/065552/hourly';
  private readonly API_KEY = 'cfd85e660a0b3e935f659c8e5e3609bf';
  private readonly geoPoint = { lat: 35.0763939, lon: 129.0878915 };
  private readonly weatherSubUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${this.geoPoint.lat}&lon=${this.geoPoint.lon}&appid=${this.API_KEY}&lang=kr`;


  async getCurrentWeather(): Promise<WeatherResult> {
    const cacheKey = this.baseKey;
    const cachedWeather = cacheClient.getCache<WeatherResult>(cacheKey);
    if (cachedWeather) return cachedWeather;

    try {
      const weatherResult = await this.getCurrentWeatherData();
      if (weatherResult.status !== '') {
        cacheClient.setCache(cacheKey, weatherResult, 10 * 60);
        return weatherResult;
      } else {
        const weather = await this.getCurrenWeatherSubData();
        cacheClient.setCache(cacheKey, weatherResult, 10 * 60);
        return weather;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async getCurrentWeatherData(): Promise<WeatherResult> {
    const result = await got.get(this.weatherUrl);
    const rawBody = cheerio.load(result.body);

    const weatherData = {
      status: rawBody('._1EZPSJ').eq(0).text(),
      temparature: rawBody('._1yysRb').eq(0).text(),
      windSpeed: rawBody('._2HcU4U').eq(0).text().replace('바람 ', ''),
      humidity: rawBody('._3uRmiA').eq(0).text(),
    };

    return weatherData;
  }

  async getCurrenWeatherSubData(): Promise<WeatherResult> {


    const result = await got.get(this.weatherSubUrl);
    const weather = JSON.parse(result.body);

    const weatherResult = {
      status: weather.weather.length > 0 ? weather.weather[0].description : '',
      temparature: `${Math.round(weather.main.temp - 273.15)}°`, // 켈빈 온도라서 섭씨로 변환
      windSpeed: `${weather.wind.speed}m/s`,
      humidity: `${weather.main.humidity}%`,
    };


    return weatherResult;
  }
}

export const weatherService = new WeatherService();
