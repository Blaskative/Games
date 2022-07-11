import React from "react";
import "./Game.css";
const Game = ({
  title,
  short_description,
  thumbnail,
  freetogame_profile_url,
}) => {
  function redirect(e) {
    e.preventDefault();
    window.open(freetogame_profile_url, "_blank").focus();
  }
  return (
    <div className="wrapper" onClick={redirect}>
      <h2>
        <strong>{title}</strong>
      </h2>
      <div className="news">
        <figure className="article">
          <img src={thumbnail} />
          <figcaption>
            <h3>Update</h3>
            <p>{short_description}</p>
          </figcaption>
        </figure>
      </div>
    </div>
  );
};

export default Game;
