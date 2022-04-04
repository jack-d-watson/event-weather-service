export interface MapPoint {
    lat: number,
    long: number
}

export type Event = {
    id: string
    name: string
    // dateTime is either a number or string that can be converted into a Date object, or a Date object
    dateTime: number | string | Date,
    zipCode?: string,
    gpsLocation?: MapPoint
}
