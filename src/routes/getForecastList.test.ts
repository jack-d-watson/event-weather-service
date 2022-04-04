import { app } from "../index"
import request from "supertest"
import { Event } from "Event"
import MockDate from 'mockdate'
import getWeatherData, { DailyWeatherForecast } from '../api/getWeatherData'

jest.mock('../api/getWeatherData')

const eventList: Event[] = [
    {
        id: "1",
        name: "first event",
        dateTime: new Date("2022-04-03"),
        zipCode: "63126"
    },
    {
        id: "2",
        name: "second event",
        dateTime: new Date("2022-04-04"),
        zipCode: "77095"
    },
    {
        id: "3",
        name: "third event",
        dateTime: new Date("2022-04-05"),
        gpsLocation: {
            lat: 40.62,
            long: -74.24
        }
    }
]

const eventForecasts: DailyWeatherForecast[] = [
    {
        temperature: 65.0,
        feelsLike: 70.0,
        weatherCondition: "Sunny",
        chanceOfRain: 0.2,
        chanceOfSnow: 0,
        windSpeed: "15 NNW"
    },
    {
        temperature: 85.0,
        feelsLike: 90.0,
        weatherCondition: "Sunny",
        chanceOfRain: 0.0,
        chanceOfSnow: 0,
        windSpeed: "5 NNW"
    },
    {
        temperature: 55.0,
        feelsLike: 50.0,
        weatherCondition: "Cloudy",
        chanceOfRain: 0.5,
        chanceOfSnow: 0,
        windSpeed: "15 SSW"
    }
]

beforeEach(() => {
    jest.spyOn(getWeatherData, "getWeatherDataByLatLong").mockResolvedValueOnce(eventForecasts[2])
    jest.spyOn(getWeatherData, "getWeatherDataByZipCode")
        .mockImplementation((zipCode: string, dateTime: Date) => {
            if(zipCode === "63126") {
                return Promise.resolve(eventForecasts[0])
            }
            else {
                return Promise.resolve(eventForecasts[1])
            }
        })
})

test("/forecast returns forecasts for the first event", async () => {
    MockDate.set(new Date("2022-04-01"))
    const response = await request(app)
        .get("/forecast")
        .set('Accept', 'application/json')
        .send(eventList)
    expect(response.statusCode).toBe(200)
    expect(response.body.length).toBe(1)
    expect(response.body[0]).toStrictEqual({
        id: eventList[0].id,
        name: eventList[0].name,
        ...eventForecasts[0]
    })
})

test("/forecast returns forecasts for all events", async () => {
    MockDate.set(new Date("2022-04-03"))
    const response = await request(app)
        .get("/forecast")
        .set('Accept', 'application/json')
        .send(eventList)
    expect(response.statusCode).toBe(200)
    expect(response.body.length).toBe(3)
    for(let index = 0; index < response.body.length; index++) {
        expect(response.body[index]).toStrictEqual({
            id: eventList[index].id,
            name: eventList[index].name,
            ...eventForecasts[index]
        })
    }
    
})