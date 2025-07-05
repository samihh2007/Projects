import bodyParser from "body-parser";
import express from "express";
import path from "path";

const app = express();
const port = 3000;
const rootPath = process.cwd()

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(rootPath));

// Logger middleware (optional)
app.use((req, res, next) => {
  console.log("Request Method:", req.method);
  console.log("Request URL:", req.url);
  next();
});

// Fallback route if no file is matched
app.get("/", (req, res) => {
  res.send("Welcome to the Malware project!");
});
app.post("/submit", (req, res) => {
    console.log(req.body)
    res.sendFile(path.join(rootPath,"public" , "second.html"))
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
