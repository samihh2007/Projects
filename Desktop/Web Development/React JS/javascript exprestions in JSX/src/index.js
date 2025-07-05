import React from "react"
import ReactDOM from "react-dom"
const name = "Sami"

ReactDOM.render(<div>
    <p>Created by {name}</p>
    <p style={{color: "red",backgroundColor: "black"}} contentEditable={false}>Copyright {new Date().getFullYear}</p>
</div>,document.getElementById("root"))