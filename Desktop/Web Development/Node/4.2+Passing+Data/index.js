import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs")
});

app.post("/submit", (req, res) => {
  var fName = req.body["fName"];
  var lName = req.body["lName"];
  var numberOfLetters = fName.length + lName.length

  console.log(req.body)


  const data = {
    numberOfLetters: numberOfLetters,
  };
  res.render("index.ejs", data);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
