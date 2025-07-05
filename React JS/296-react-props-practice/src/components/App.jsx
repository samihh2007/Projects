import React from "react";

function App(props) {
  return (
    <div>
      <h1 className="heading">{props.name}</h1>
      <div className="card">
        <div className="top">
          <h2>{props.title}</h2>
          <img
            src={props.image}
            alt="avatar_img"
          />
        </div>
        <div className="bottom">
          <p>{props.phone}</p>
          <p>{props.email}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
