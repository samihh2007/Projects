import express from "express"
const app = express()

const port = 3000
app.post("/home/kali/Desktop/", (req, res) => {
    res.send("./index.html")
    
})
app.get("/", (req, res) => {
    res.send("<h1>Hello,World!</h1>");
})

app.listen(port, () => {
    console.log(`Server is Runing on ${port}`)
})