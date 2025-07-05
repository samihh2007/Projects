import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com/";

//TODO 1: Fill in your values for the 3 types of auth.
const yourUsername = "jack112";
const yourPassword = "jackon112";
const yourAPIKey = "2464626c-9264-46dc-8898-1d658ab25c63";
const yourBearerToken = "6541b724-71ca-4b50-b780-0071256b04a4";

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "API Response." });
});

app.get("/noAuth", async (req, res) => {
  const response = await axios.get(API_URL + "random")
  const data = response.data
  // console.log(data)
  res.render("index.ejs", { content: JSON.stringify(data) });
  //TODO 2: Use axios to hit up the /random endpoint
  //The data you get back should be sent to the ejs file as "content"
  //Hint: make sure you use JSON.stringify to turn the JS object from axios into a string.
});

app.get("/basicAuth",async (req, res) => {
  const response = await axios.get(API_URL + "all", {
    auth: {
      username: yourUsername,
      password:yourPassword,
  }})
  const data = response.data
  // console.log(data)
  res.render("index.ejs", { content: JSON.stringify(data) });
  //TODO 3: Write your code here to hit up the /all endpoint
  //Specify that you only want the secrets from page 2
  //HINT: This is how you can use axios to do basic auth:
  // https://stackoverflow.com/a/74632908
  /*
   axios.get(URL, {
      auth: {
        username: "abc",
        password: "123",
      },
    });
  */
});

app.get("/apiKey", async (req, res) => {
  const response = await axios.get(API_URL + "filter?apiKey=" + yourAPIKey)
  const data = response.data
  // console.log(data)
  res.render("index.ejs", { content: JSON.stringify(data) });
  //TODO 4: Write your code here to hit up the /filter endpoint
  //Filter for all secrets with an embarassment score of 5 or greater
  //HINT: You need to provide a query parameter of apiKey in the request.
});

app.get("/bearerToken", async (req, res) => {
  const response = await axios.get(API_URL + "filter?apiKey=" + yourAPIKey, {
    headers: {
      Authorization: yourBearerToken,
    },
  });
  
  const data = response.data
  console.log(data)
  res.render("index.ejs", { content: JSON.stringify(data) });
  //TODO 5: Write your code here to hit up the /secrets/{id} endpoint
  //and get the secret with id of 42
  //HINT: This is how you can use axios to do bearer token auth:
  // https://stackoverflow.com/a/52645402
  /*
  axios.get(URL, {
    headers: { 
      Authorization: `Bearer <YOUR TOKEN HERE>` 
    },
  });
  */
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
