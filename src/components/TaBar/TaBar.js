import React, { useState } from "react";
import "./TaBar.css";

const TaBar = ({genres,setGamesByGenre}) => {
  let [filter, setFilter] = useState("All");

  function filterGenre(e, genre) {
    setFilter(genre);
    setGamesByGenre(genre === "All"? null : genre );
  }
 
  return (
    <div className="wrapper">
      <div className="tabs_wrap">
        <ul>
          {genres.map((genre) => (
            <li
              className={`list ${filter === genre ? "active" : " "}`}
              onClick={(e) => filterGenre(e, genre)}
              key={genre}
            >
              {genre}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TaBar;
