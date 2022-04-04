import express from 'express'
import { router as getForecastListRouter } from './routes/getForecastList'
 
const app = express();
const port = process.env.PORT || 8080;

app.use(express.json())

app.use('/forecast', getForecastListRouter)

app.listen(port, () => {
    return console.log(`Server started, listening on Port ${port}`)
});

