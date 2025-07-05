import express from "express"
import morgan from "morgan"

const app = express();
const port = 3000;

app.use(morgan("tiny"));

app.get("/", (req, res) => {
    res.send("Hello");
})

app.listen(port, (req, res) => {
    console.log(`Running on port ${port}`)})