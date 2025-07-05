import React from "react";
import ReactDOM from "react-dom";

let current_time = new Date().getHours();
let message = "good morning";

let color = "blue"
if (current_time < 12 && current_time > 0) {
  message = "Good Morning";
  color = "blue"
} else if (current_time > 12 && current_time < 18) {
  message = "Good After noon";
  color = "blue"
} else {
  message = "Good night";
  color = "blue"
}


ReactDOM.render(<h1 color={color}>{message}</h1>, document.getElementById("root"));
