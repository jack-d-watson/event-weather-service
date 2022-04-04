import { Event } from "Event";

export function getEventsInNext3Days(eventList: Event[]) {
    const dateNow = new Date()
    //Gets todays date and adds 3 days
    const forecastDateThreshold = new Date()
    forecastDateThreshold.setDate(forecastDateThreshold.getDate() + 3)
    
    // Events between now and the next 3 days
    return eventList.filter((thisEvent: Event) => {
        thisEvent.dateTime = new Date(thisEvent.dateTime)
        return thisEvent.dateTime < forecastDateThreshold && thisEvent.dateTime >= dateNow
    })
}
