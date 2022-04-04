import config from 'config'
import axios, { AxiosResponse } from 'axios'
import { MapPoint } from 'Event'

export interface DailyWeatherForecast {
    temperature: number,
    feelsLike: number,
    weatherCondition: string,
    chanceOfRain: number,
    chanceOfSnow: number,
    windSpeed: string
}

interface WeatherApiCondition {
    text: string,
}

interface WeatherApiForecastHour { 
    temp_f: number,
    condition: WeatherApiCondition,
    wind_mph: number,
    wind_dir: string,
    feelslike_f: number,
    chance_of_rain: number,
    chance_of_snow: number,
}

interface WeatherApiForecastDay {
    date: string,
    date_epoch: number,
    day: {
        daily_chance_of_rain: number,
        daily_chance_of_snow: number
    },
    hour: WeatherApiForecastHour[]
}

interface WeatherApiForecast {
    forecastday: WeatherApiForecastDay[]
}

function mapWeatherApiData(weatherApiData: WeatherApiForecast) : DailyWeatherForecast {
    const hourForecast = weatherApiData.forecastday[0].hour[0]
    return {
        temperature:hourForecast.temp_f,
        feelsLike: hourForecast.feelslike_f,
        weatherCondition: hourForecast.condition.text,
        chanceOfRain: hourForecast.chance_of_rain,
        chanceOfSnow: hourForecast.chance_of_snow,
        windSpeed: `${hourForecast.wind_mph} ${hourForecast.wind_dir}`
    }
}

function getWeatherData(locationParameter: string, dateTime: Date) : Promise<DailyWeatherForecast> {
    // Get a string containing just the date in YYYY-mm-DD format
    const datePart = dateTime.toISOString().slice(0, 10)
    const hour = dateTime.getHours()

    const weatherApiUrl = config.get('weatherApi.url')
    const weatherApiKey = config.get('weatherApi.key')
    // Make API request for specific location, Date and Hour of the event
    return axios.get(`${weatherApiUrl}/forecast.json?key=${weatherApiKey}&q=${locationParameter}&dt=${datePart}&hour=${hour}&aqi=no&alerts=no`)
        .then((response: AxiosResponse) => {
            if(response && response.data) {
                return mapWeatherApiData(response.data.forecast)
            }
            throw {
                msg: "Weather Api did not return expected data!"
            }
        }).catch((error) => {
            console.log(error)
            throw error
        });
}

export function getWeatherDataByZipCode(zipCode: string, dateTime: Date) : Promise<DailyWeatherForecast> {
    return getWeatherData(zipCode, dateTime)
}

export function getWeatherDataByLatLong(gpsLocation: MapPoint, dateTime: Date) : Promise<DailyWeatherForecast> {
    // Convert map point into the string form accepted by Weather Api
    return getWeatherData(`${gpsLocation.lat},${gpsLocation.long}`, dateTime)
}

export default {
    getWeatherDataByZipCode,
    getWeatherDataByLatLong,
}