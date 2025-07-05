import bodyParser from "body-parser"
import express from "express"
import { dirname, join } from "path"

import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))

console.log(__dirname)

const app = express();
const port = 3000;
const filePath = __dirname + "/public/index.html";

app.get("/", (req, res) => {
  console.log(filePath)
  res.sendFile(filePath);
  7887
});

app.use(bodyParser.urlencoded({ extended: true }))
app.post("/submit", (req, res) => { 
  console.log(req.body)
  console.warn(`Email is: ${req.body["email"]}`);
  console.warn(`Password is: ${req.body["password"]}`);

})


app.listen(port, (req, res) => {
    console.log(`listening on port ${port}`)
})