import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 4001;
var numberOfRquests = 0

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/login", (req, res) => {
  numberOfRquests = numberOfRquests + 1 
  var data = JSON.stringify(req.body);
  console.log(`Number of requests on ${numberOfRquests}: ${data}`); //undefine
  const { username, password } = req.body;

  if (username === "sami" && password === "9797") {
    res.status(200).send("Login successful! Welcome Sami.");
  } else {
    res.status(401).send("Login failed: Invalid username or password.");
  }
});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
