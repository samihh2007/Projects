import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3001;

let visited_countries = [];
let currentUserId = 1;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "travel_tracker",
  password: "123456",
  port: 5432,
});
await db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let users = [];

async function update_users() {
  const res = await db.query("SELECT * FROM users");
  users = res.rows;
}

async function userVisitedCountries(id) {
  const res = await db.query(
    `
    SELECT visited_countries.country_name AS country_name, visited_countries.country_code AS country_code
    FROM visited_countries
    WHERE visited_countries.user_id = $1
    `,
    [id]
  );

  if (res.rows.length !== 0) {
    visited_countries = res.rows.map((row) => row.country_code);
  } else {
    visited_countries = [];
  }
}

async function renderIndexWithError(res, errorMessage) {
  try {
    await update_users();
    await userVisitedCountries(currentUserId);

    const user = users.find((u) => u.id === currentUserId);
    const color = user ? user.color : "teal";

    res.render("index.ejs", {
      countries: visited_countries,
      total: visited_countries.length,
      users: users,
      color: color,
      error: errorMessage || null,
    });
  } catch (renderErr) {
    console.error("Error rendering index with error:", renderErr);
    res.status(500).send("Server error");
  }
}

app.get("/", async (req, res) => {
  await update_users();
  await userVisitedCountries(currentUserId);

  const currentUser = users.find((u) => u.id === currentUserId);
  const color = currentUser ? currentUser.color : "teal";

  res.render("index.ejs", {
    countries: visited_countries,
    total: visited_countries.length,
    users: users,
    color: color,
    error: null,
  });
});

app.post("/add", async (req, res) => {
  const input = req.body["country"]?.trim();

  if (!input) {
    console.log("No input provided");
    return renderIndexWithError(res, "Please enter a country name or code.");
  }

  try {
    // 1. Try exact match for country code (case-insensitive)
    let result = await db.query(
      `SELECT code, name FROM countries WHERE LOWER(code) = LOWER($1) LIMIT 1`,
      [input]
    );

    // 2. If no code match, try partial match on name
    if (result.rows.length === 0) {
      result = await db.query(
        `SELECT code, name FROM countries WHERE LOWER(name) LIKE '%' || LOWER($1) || '%'`,
        [input]
      );
    }

    if (result.rows.length === 1) {
      const { code, name } = result.rows[0];

      // Check if already visited by this user
      const check = await db.query(
        `SELECT 1 FROM visited_countries WHERE user_id = $1 AND country_code = $2`,
        [currentUserId, code]
      );

      if (check.rows.length > 0) {
        return renderIndexWithError(
          res,
          `You already visited ${name} (${code}).`
        );
      } else {
        await db.query(
          `INSERT INTO visited_countries (country_code, country_name, user_id)
           VALUES ($1, $2, $3)`,
          [code, name, currentUserId]
        );
        console.log(
          `Added visited country: ${name} (${code}) for user ${currentUserId}`
        );
        return res.redirect("/");
      }
    } else if (result.rows.length > 1) {
      return renderIndexWithError(
        res,
        `Multiple countries matched "${input}". Please be more specific.`
      );
    } else {
      return renderIndexWithError(res, `No country matched "${input}".`);
    }
  } catch (err) {
    console.error("Error in /add route:", err);
    await renderIndexWithError(res, "Server error while adding country.");
  }
});

app.post("/user", async (req, res) => {
  try {
    if (req.body.add != "new") {
      const id = parseInt(req.body.user);
      if (isNaN(id)) {
        return renderIndexWithError(res, "Invalid user ID.");
      }
      currentUserId = id;

      await update_users();
      await userVisitedCountries(id);

      const user = users.find((u) => u.id === id);

      res.render("index.ejs", {
        countries: visited_countries,
        total: visited_countries.length,
        users: users,
        color: user ? user.color : "teal",
        error: null,
      });
    } else {
      res.render("new.ejs");
    }
  } catch (err) {
    console.error("Error in /user route:", err);
    await renderIndexWithError(res, "Server error while changing user.");
  }
});

app.post("/new", async (req, res) => {
  const name = req.body.name;
  const color = req.body.color;
  try {
    await db.query("INSERT INTO users (name, color) VALUES ($1, $2)", [
      name,
      color,
    ]);
    console.log(`Added new user: ${name} with color ${color}`);
    res.redirect("/");
  } catch (err) {
    console.error("Error adding new user:", err);
    await renderIndexWithError(res, "Server error while adding new user.");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
