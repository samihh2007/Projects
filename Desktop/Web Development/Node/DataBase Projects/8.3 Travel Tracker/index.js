import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "sami",
  password: "953953hh",
  database: "world",
  host: "localhost",
  port: 5432,
});

let countriesNames = [];
let country_codes = {};
let doneCountriesCodes = [];
let countriesNamesCount = 0;

function renderPage(res, error) {
  res.render("index.ejs", {
    total: doneCountriesCodes.length,
    countries: doneCountriesCodes,
    error: error,
  });
}

function print(text) {
  console.log(text);
}

// Convert to async so await works correctly
async function loadData() {
  try {
    await db.connect();

    // Load all countries
    const countriesResult = await db.query("SELECT * FROM countries");
    countriesResult.rows.forEach((row) => {
      countriesNames.push(row.country_name);
      country_codes[row.country_code] = row.country_name; // <-- fill country_codes map
    });

    // Load visited countries
    const visitedResult = await db.query(
      "SELECT country_code FROM visited_countries"
    );
    doneCountriesCodes = visitedResult.rows.map((row) => row.country_code);
    countriesNamesCount = doneCountriesCodes.length;

    print("Loaded country codes and visited countries");
  } catch (err) {
    console.error("Error loading initial data:", err);
  }
}

await loadData(); // Ensure DB data is loaded before starting the server

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  renderPage(res, "");
});

app.post("/add", async (req, res) => {
  let input = ""
  if (req.body.country) {
    input = req.body.country.trim();
    
  }
  const inputLower = input.toLowerCase();

  let countryCode = null;
  let countryName = null;

  try {
    const result = await db.query(
      "SELECT country_code, country_name FROM countries WHERE LOWER(country_name) ILIKE $1 LIMIT 1",
      [inputLower + "%"]
    );

    if (result.rows.length > 0) {
      countryCode = result.rows[0].country_code;
      countryName = result.rows[0].country_name;
    } else {
      renderPage(res, "Incorrect");
      return;
    }
  } catch (err) {
    console.error("Error querying country:", err);
    res.status(500).send("DB error");
    return;
  }


  if (!countryCode || !countryName) {
    renderPage(res, "Incorrect");
    return;
  }

  if (
    doneCountriesCodes
      .map((c) => c.toLowerCase())
      .includes(countryCode.toLowerCase())
  ) {
    renderPage(res, "Already in the redeemed");
    return;
  }

  try {
    await db.query(
      "INSERT INTO visited_countries (country_name, country_code) VALUES ($1, $2)",
      [countryName, countryCode]
    );

    doneCountriesCodes.push(countryCode);
    countriesNamesCount += 1;
    renderPage(res, "Correct");
  } catch (error) {
    console.error("Database insert error:", error);
    res.status(500).send("Database error");
  }
});


app.listen(port, () => {
  print(`Server running on http://localhost:${port}`);
});

// app.get("/api/add", async (req, res) => {
//   const input = req.query.countryName || req.query.countryCode;
//   // print(input)

//   if (!input) {
//     res.json({
//       total: doneCountriesCodes.length,
//       countries: doneCountriesCodes,
//       message: "Missing input",
//     });
//     return;
//   }
//   const inputLower = input.toLowerCase();

//   let countryCode = null;
//   let countryName = null;

//   for (const [code, name] of Object.entries(country_codes)) {
//     if (code.toLowerCase() === inputLower) {
//       countryCode = code;
//       countryName = name;
//       break;
//     } else if (name.toLowerCase() === inputLower) {
//       countryCode = code;
//       countryName = name;
//       break;
//     }
//   }

//   if (!countryCode || !countryName) {
//     res.json({
//       total: doneCountriesCodes.length,
//       countries: doneCountriesCodes,
//       message: "incorrect",
//     });
//     return;
//   }

//   if (
//     doneCountriesCodes
//       .map((c) => c.toLowerCase())
//       .includes(countryCode.toLowerCase())
//   ) {
//     res.json({
//       total: doneCountriesCodes.length,
//       countries: doneCountriesCodes,
//       message: "Already in the redeemed",
//     });
//     return;
//   }

//   try {
//     await db.query(
//       "INSERT INTO visited_countries (country_name, country_code) VALUES ($1, $2)",
//       [countryName, countryCode]
//     );

//     doneCountriesCodes.push(countryCode);
//     countriesNamesCount += 1;
//     renderPage(res, "Correct");
//   } catch (error) {
//     console.error("Database insert error:", error);
//     res.status(500).json("Database error");
//   }
// });