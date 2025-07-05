import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com/";

const yourUsername = "jack112";
const yourPassword = "jackon112";
const yourAPIKey = "2464626c-9264-46dc-8898-1d658ab25c63";
const yourBearerToken = "6541b724-71ca-4b50-b780-0071256b04a4";

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "API Response." });
});

app.get("/noAuth", async (req, res) => {
  const response = await axios.get(API_URL + "random");
  const data = response.data;
  res.render("index.ejs", { content: JSON.stringify(data) });
});

app.get("/basicAuth", async (req, res) => {
  const response = await axios.get(API_URL + "all", {
    auth: {
      username: yourUsername,
      password: yourPassword,
    },
  });
  const data = response.data;
  res.render("index.ejs", { content: JSON.stringify(data) });
});

app.get("/apiKey", async (req, res) => {
  const response = await axios.get(API_URL + "filter?apiKey=" + yourAPIKey);
  const data = response.data;
  res.render("index.ejs", { content: JSON.stringify(data) });
});

app.get("/bearerToken", async (req, res) => {
  const response = await axios.get(API_URL + "filter?apiKey=" + yourAPIKey, {
    headers: {
      Authorization: yourBearerToken,
    },
  });
  const data = response.data;
  res.render("index.ejs", { content: JSON.stringify(data) });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
