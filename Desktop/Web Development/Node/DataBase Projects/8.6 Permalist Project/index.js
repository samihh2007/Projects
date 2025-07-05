import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;
let db = new pg.Client({
  user: "sami",
  password: "953953hh",
  database: "permalist",
  port: 5432,
  host: "localhost",
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

function renderPage(res) {
  res.render("index.ejs", {
    listTitle: "ToDo",
    listItems: items,
  });
}

function updateItems() {
  db.query("SELECT * from items", (error, res) => {
    items = res.rows;
    // console.log(items);
  });
}

function deleteItemId(id) {
  try {
    db.query(`DELETE FROM items WHERE id = ${id}`, (error) => {
      // console.log(error);
    });
  } catch (error) {
    console.error(error);
  }
}

updateItems();

app.get("/", (req, res) => {
  renderPage(res);
});

app.post("/add", (req, res) => {
  try {
    const item = req.body.newItem;
    // console.log(item);
    db.query(`INSERT INTO items (title) VALUES('${item}')`);
    items.push({ title: item });
    updateItems();
    res.redirect("/");
  } catch (error) {
    console.error(error);
  }
});

app.post("/edit", (req, res) => {
  try {
    const { updatedItemId, updatedItemTitle } = req.body;

    db.query(
      `UPDATE items set title = '${updatedItemTitle}' WHERE id = '${updatedItemId}'`
    );
    updateItems();
    res.redirect("/");
  } catch (error) {
    console.error(error);
  }
});

app.post("/delete", (req, res) => {
  try {
    deleteItemId(parseInt(req.body.deleteItemId));
    updateItems();
    res.redirect("/");
  } catch (error) {
    console.error(error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
