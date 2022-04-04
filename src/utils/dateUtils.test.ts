import { Event } from 'Event'
import MockDate from 'mockdate'
import { getEventsInNext3Days } from './dateUtils'

const eventList: Event[] = [
    {
        id: "1",
        name: "first event",
        dateTime: new Date("2022-04-03")
    },
    {
        id: "2",
        name: "second event",
        dateTime: new Date("2022-04-04")
    },
    {
        id: "3",
        name: "third event",
        dateTime: new Date("2022-04-05")
    }
]

test("When run on April 1, the List of events is filtered from 3 to 1", () => {
    MockDate.set(new Date("2022-04-01"))
    const actualFilteredEvents = getEventsInNext3Days(eventList)
    expect(actualFilteredEvents.length).toBe(1)
    expect(actualFilteredEvents[0]).toBe(eventList[0])
})

test("When run on April 3, the List of events is not reduced", () => {
    MockDate.set(new Date("2022-04-03"))
    const actualFilteredEvents = getEventsInNext3Days(eventList)
    expect(actualFilteredEvents.length).toBe(3)
    expect(actualFilteredEvents[0]).toBe(eventList[0])
    expect(actualFilteredEvents[1]).toBe(eventList[1])
    expect(actualFilteredEvents[2]).toBe(eventList[2])
})

test("When run on April 4, the List of events contains the 2nd and 3rd event", () => {
    MockDate.set(new Date("2022-04-04"))
    const actualFilteredEvents = getEventsInNext3Days(eventList)
    expect(actualFilteredEvents.length).toBe(2)
    expect(actualFilteredEvents[0]).toBe(eventList[1])
    expect(actualFilteredEvents[1]).toBe(eventList[2])
})

test("When run on April 6, no events are returned", () => {
    MockDate.set(new Date("2022-04-06"))
    const actualFilteredEvents = getEventsInNext3Days(eventList)
    expect(actualFilteredEvents.length).toBe(0)
})