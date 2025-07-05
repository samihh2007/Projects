import express from "express";
import bodyParser from "body-parser";
import pg from "pg"
import bcrypt from "bcrypt"

const app = express();
const port = 3000;
const saltRounds = 10
let db = new pg.Client({
  user: "sami",
  host: "localhost",
  password: "953953hh",
  database: "authentication",
  port: 5432
})

async function logIn(req, res, username, password) {
  // console.log("Username: " + username);
  let query = await db.query(`Select * from users where username = '${username}'`)
  if (query.rows.length > 0) {
    const result = await bcrypt.compare(password, query.rows[0].password)
    if (result) {
      res.redirect("/secrets")
    } else {
      res.send("No Matching");
    }
  } else {
    console.log("There is no matching email and password")
  }
}

async function alreadyExists(username, password) {
  let checkResult = await db.query(`Select * from users where username = '${username}'`)
  if (checkResult.rows.length > 0) {
      return true
  } else {
    return false
    }
}

db.connect()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.get("/secrets", (req, res) => {
  res.render("secrets.ejs")
})

app.post("/register", async (req, res) => {
  try {
    let { username, password } = req.body;
    const already_exist = await alreadyExists(username, password)
    let encrypted_password = ""
    if (already_exist) {
      console.log("Email already exists")
      res.send("Email already exists")
    } else {
      if (password.length < 8 && username) {
        res.send(
          "Make sure to that you fill the username field with correct username and the password 8 characters or more"
        );
      } else {
        bcrypt.hash(password, saltRounds,async (err, hash) => {
          if (err) {
            console.log(err)
          } else {
            console.log(hash.length)
            const result = await db.query(`INSERT INTO users (username,password)
          VALUES ('${username}','${hash}')
            `);
            console.log(hash)
          }
        })
        console.log()
        res.render("secrets.ejs");
      }
    }

  } catch (error) {
    console.log("Hello from exception of post /register")
    res.send(error)
  }
}
);

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  logIn(req, res, username,password);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
