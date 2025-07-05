import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com";

// HINTs: Use the axios documentation as well as the video lesson to help you.
// https://axios-http.com/docs/post_example
// Use the Secrets API documentation to figure out what each route expects and how to work with it.
// https://secrets-api.appbrewery.com/

//TODO 1: Add your own bearer token from the previous lesson.
const yourBearerToken = "6541b724-71ca-4b50-b780-0071256b04a4";
const config = {
  headers: { Authorization: `Bearer ${yourBearerToken}` },
};

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "Waiting for data..." });
});

app.post("/get-secret", async (req, res) => {
  const searchId = req.body.id;
  try {
    const result = await axios.get(API_URL + "/secrets/" + searchId, config);
    res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    res.render("index.ejs", { content: "Cannot GET /secrets" });
  }
});

app.post("/post-secret", async (req, res) => {
  // TODO 2: Use axios to POST the data from req.body to the secrets api servers.
  try {
    const body = req.body
    console.log("Sending request")
    const response = await axios.post(API_URL + "/secrets",body, config);
    var data = response.data
    // console.log(data)
    res.render("index.ejs", {
      content: JSON.stringify(data),
    });
  } catch (error) {
    res.render("index.ejs", {
      content: error.response.data,
    },)
  }
});

app.post("/put-secret", async (req, res) => {
  // TODO 3: Use axios to PUT the data from req.body to the secrets api servers.
  try {
    const searchId = req.body.id;
  const completeURL = `${API_URL}/secrets/${searchId}`;
  const response = await axios.put(completeURL, req.body,config)
  const data = await response.data;
  
  console.log(response.status)
  console.log(data)
  res.render("index.ejs", {
      content: JSON.stringify(data)
    })
    console.log(completeURL + "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
  } catch (error) {
    res.render("index.ejs", {
      content: error.response.data,
    });
  }
});

app.post("/patch-secret", async (req, res) => {
  // TODO 4: Use axios to PATCH the data from req.body to the secrets api servers.
  const searchId = req.body.id;
  try {
    const searchId = req.body.id;
  const completeURL = `${API_URL}/secrets/${searchId}`;
  const response = await axios.patch(completeURL, req.body,config)
  const data = await response.data;
  
  console.log(response.status)
  console.log(data)
  res.render("index.ejs", {
      content: JSON.stringify(data.newData)
    })
    console.log(completeURL + "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
  } catch (error) {
    res.render("index.ejs", {
      content: error.response.data,
    });
  }

});

app.post("/delete-secret", async (req, res) => {
  try {
    const searchId = req.body.id;
  const completeURL = `${API_URL}/secrets/${searchId}`;
  const response = await axios.delete(completeURL, config)
  const data = response.data
  console.log(data)
  res.render("index.ejs", {
    content: data.message,
  })
  } catch (error) {
    res.render("index.ejs", {
      content: error.response.data.error,
    });
  }
  // TODO 5: Use axios to DELETE the item with searchId from the secrets api servers.
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
