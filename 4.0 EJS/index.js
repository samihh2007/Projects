import express from "express"

const app = express();
const port = 3000;
const day = new Date().getDay();

app.get("/", (req, res) => {
    let type = "a weekday";
    let adv = "it's time to work hard"
    if (day == 0 || day == 6) {
        type = "a weekend"
        adv = "it's time to have some fun"
    }
    res.render("index.ejs",{daytype: type,advice: adv})
})

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
})