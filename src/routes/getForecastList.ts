import { Router, Request, Response } from 'express'
import { Event } from 'Event'
import { DailyWeatherForecast, getWeatherDataByLatLong, getWeatherDataByZipCode } from '../api/getWeatherData'
import { getEventsInNext3Days } from '../utils/dateUtils'

const router = Router()

interface EventResponse extends DailyWeatherForecast {
    id: string,
    name: string
}

function mapForecastToEvent(event: Event, forecast: DailyWeatherForecast) : EventResponse {
    return {
        id: event.id,
        name: event.name,
        ...forecast
    }
}

router.get('/', async (request: Request, response: Response) => {
    const eventList: Event[] = request.body
    const eventsInNext3Days = getEventsInNext3Days(eventList)

    // Get the forecast for each event, and wait for all the promises to be resolved
    const eventForecasts = await Promise.all(eventsInNext3Days.map((thisEvent: Event) => {
        if(thisEvent.zipCode) {
            return getWeatherDataByZipCode(thisEvent.zipCode, thisEvent.dateTime as Date)
                .then((forecast: DailyWeatherForecast) => {
                    return mapForecastToEvent(thisEvent, forecast)
                })
                .catch((error) => {
                    return response.status(500).json(error).send()
                })
        }
        else if (thisEvent.gpsLocation) {
            return getWeatherDataByLatLong(thisEvent.gpsLocation, thisEvent.dateTime as Date)
                .then((forecast: DailyWeatherForecast) => {
                    return mapForecastToEvent(thisEvent, forecast)
                })
                .catch((error) => {
                    return response.status(500).json(error).send()
                })
        }
    }))

    return response.status(200).json(eventForecasts).send()
})

export {
    router
}