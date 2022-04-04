# Event Weather Service

This is a small Typescript & Express project to take some basic data from a list of events, and return simple weather forecasts for any upcoming events. It has a single REST endpoint, and uses a single API endpoint from weatherapi.com 

## Running this service

To run this service locally, download the repository. 

1. Under `config` create a file named `local.yml`

    The file should look something like the following
    ```yaml
    weatherApi:
        key: <WEATHER_API_KEY>
    ```
1. Add your weatherapi.com API Key in the blank
1. From the command line, run `yarn` to install the services dependencies. You can start the service two ways, detailed below.
    
    1. Run `yarn build` to build the project and then `yarn start` to start the server
    1. Run `yarn dev` to build and run the server all at once. In this mode you can make changes to the project's `src` folder, and they will cause the app to be rebuilt and restart

1. Make a request! You can do this any number of ways, but I'll throw my example for testing the service manually below. The request format will be detailed in the next section. This cUrl command can be run via command line, or imported into a tool like Postman for making more requests
    ```
    curl --location --request GET 'localhost:8080/forecast/' \
    --header 'Content-Type: application/json' \
    --data-raw '[
        {
            "id": "cb332848-7295-4196-acf8-468d113b1fde",
            "name": "A movie happens",
            "dateTime": 1651877835000,
            "zipCode": 33139
        },
        {
            "id": "c7d71066-7792-45f6-aefc-e5df0f62d28f",
            "name": "st louis nonsense",
            "dateTime": 1649267729000,
            "gpsLocation": {
                "lat": 38.55,
                "long": -90.38
            }
        },
        {
            "id": "437f3ee0-498e-4344-90f7-0b4d2fc69580",
            "name": "houston is big",
            "dateTime": 1649184636000,
            "zipCode": 77095
        }
    ]'
    ```

## Request Format
Currently the api has one endpoint.

GET `/forecast`, requires a header `Content-Type: application/json`, and a body of json data. This should be an array of any number of elements.
Each element must have the following properties
* id: String; a unique identifier, usually as a UUID
* name: String; a 'user friendly' name to identify the event
* dateTime: Number or String; The time of the event. Specified either using a unix timestamp, specified to milliseconds, or the date represented as a string using the ISO 8601 format

Each element must have one of the following properties. If both are specified the app defaults to ZipCode: 
* zipCode: String;
* gpsLocation: Object with properties lat: number, long: number;

## Automated tests
Simple automated tests exist for the Happy path of the app. These can be run using `yarn test`

# Future Improvements
* Automated tests for non-happy paths, error cases
* Better error handling, especially around the API call with Axios
* Install automated linting and code style checks
* Expand forecast to display more data around precipitation for the day, or perhaps more specifically for the duration of the event
* More testing and validation around the format of the incoming request data
* Ensure this app handles timezones & DST appropriately
