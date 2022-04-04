import { DailyWeatherForecast, getWeatherDataByLatLong, getWeatherDataByZipCode } from './getWeatherData'
import axios from 'axios'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

// TODO: define actualValues as an interface
const mockForecast = (actualValues: any) => {
    mockedAxios.get.mockResolvedValueOnce({
        data: {
            forecast: {
                forecastday: [
                    {
                        hour: [
                            {
                                temp_f: actualValues.temperature,
                                feelslike_f: actualValues.feelsLike,
                                condition: {
                                    text: actualValues.weatherCondition
                                },
                                chance_of_rain: actualValues.chanceOfRain,
                                chance_of_snow:actualValues.chanceOfSnow,
                                wind_mph: actualValues.wind_mph,
                                wind_dir: actualValues.wind_dir
                            }
                        ]
                    }
                ]
            }
        }
    })
}

test(`Get Weather for Zipcode 63126 on April 6 2022 @ 5pm UTC`, () => {
    const actualValues = {
        temperature: 65.0,
        feelsLike: 70.0,
        weatherCondition: "Sunny",
        chanceOfRain: 0.2,
        chanceOfSnow: 0,
        wind_mph: 5,
        wind_dir: "NNE"
    }

    mockForecast(actualValues)

    return getWeatherDataByZipCode("63126", new Date("2022-04-06 17:00:00")).then((forecast: DailyWeatherForecast) => {
        expect(forecast.temperature).toBe(actualValues.temperature)
        expect(forecast.feelsLike).toBe(actualValues.feelsLike)
        expect(forecast.weatherCondition).toBe(actualValues.weatherCondition)
        expect(forecast.chanceOfRain).toBe(actualValues.chanceOfRain)
        expect(forecast.chanceOfSnow).toBe(actualValues.chanceOfSnow)
        expect(forecast.windSpeed).toBe(actualValues.wind_mph + " " + actualValues.wind_dir)
    })
    .catch((error) => {
        expect(error).toBeNull()
    })
})

test(`Get Weather for 38.54, -90.37 on April 6 2022 @ 5pm UTC`, () => {
    const actualValues = {
        temperature: 65.0,
        feelsLike: 70.0,
        weatherCondition: "Sunny",
        chanceOfRain: 0.2,
        chanceOfSnow: 0,
        wind_mph: 5,
        wind_dir: "NNE"
    }

    mockForecast(actualValues)

    return getWeatherDataByLatLong({lat: 38.54, long: -90.37}, new Date("2022-04-06 17:00:00")).then((forecast: DailyWeatherForecast) => {
        expect(forecast.temperature).toBe(actualValues.temperature)
        expect(forecast.feelsLike).toBe(actualValues.feelsLike)
        expect(forecast.weatherCondition).toBe(actualValues.weatherCondition)
        expect(forecast.chanceOfRain).toBe(actualValues.chanceOfRain)
        expect(forecast.chanceOfSnow).toBe(actualValues.chanceOfSnow)
        expect(forecast.windSpeed).toBe(actualValues.wind_mph + " " + actualValues.wind_dir)
    })
    .catch((error) => {
        expect(error).toBeNull()
    })
})