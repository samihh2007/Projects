import bodyParser from "body-parser";
import express from "express"
import os from "os";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.sendFile(process.cwd() + "/public/index.html")
})

app.post("/check", (req, res) => {
    if (req.body["password"] == "ILoveProgramming") {
        res.sendFile(process.cwd() + "/public/secret.html")
    } else {
        res.sendFile(process.cwd() + "/public/index.html");
    };
})

app.listen(port, (req, res) => {
    console.log(`runing server on http://${getLocalIP()}:${port}`)
})