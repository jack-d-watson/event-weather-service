import express from 'express'

const app = express();
const port = process.env.PORT || 8080;

app.listen(port, () => {
    return console.log(`Server started, listening on Port ${port}`)
});
