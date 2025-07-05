import express from "express";
import bodyParser from "body-parser";
import pg from "pg"
import env from "dotenv"


const app = express();
const port = 3000;
env.config()
const db = new pg.Client({
  user: process.env.PG_USER,
  database: PG_DATABASE,
  password: process.env.PG_PASSWORD,
  host: PG_HOST,
  port: PG_PORT,
});
let quiz = []
db.connect()

db.query("SELECT * FROM flags", (err, res) => {
  if (err) {
    console.error(err)
  } else {
    quiz = res.rows
    db.end()
  }
})

let totalCorrect = 0;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentQuestion = {};

// GET home page
app.get("/", (req, res) => {
  totalCorrect = 0;
  nextQuestion();
  console.log(currentQuestion);
  res.render("index.ejs", { question: currentQuestion });
});

// POST a new post
app.post("/submit", (req, res) => {
  let answer = req.body.answer.trim();
  let isCorrect = false;
  if (currentQuestion.name.toLowerCase() === answer.toLowerCase()) {
    totalCorrect++;
    console.log(totalCorrect);
    isCorrect = true;
  }

  nextQuestion();
  res.render("index.ejs", {
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
});

function nextQuestion() {
  const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];
  console.log(`Random Country: ${JSON.stringify(randomCountry)}`)
  currentQuestion = randomCountry;
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
