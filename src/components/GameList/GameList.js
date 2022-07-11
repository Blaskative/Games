import React, { useRef, useEffect, useState } from "react";
import Game from "../Game/Game";
import GameVideo from "../GameVideo/GameVideo";
import TaBar from "../TaBar/TaBar";
import axios from "axios";
import "./GameList.css";
import ReactPaginate from "react-paginate";
import GameSlider from "../GameSlider/GameSlider";

const GameList = () => {
  const effectRan = useRef(false);
  const [games, setGames] = useState([]);
  const [genres, setGenres] = useState([]);
  const [GamesByGenre, setGamesByGenre] = useState(null);
  const [gamesByPage, setgamesByPage] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 9;

  useEffect(() => {
    if (effectRan.current === true) {
      axios.get("http://localhost:4000/api").then((res) => {
        var data = JSON.parse(res.data);
        var gameListGenre = GamesByGenre
          ? data.filter((game) => game.genre == GamesByGenre)
          : data;
          gameListGenre= gameListGenre.sort(
            (objA, objB) => Number(new Date(objB.release_date)) - Number(new Date(objA.release_date)),
          );
          console.log(gameListGenre);
        const genres = data.map((game) => game.genre);
        let genreList = genres.filter(
          (genre, index) => genres.indexOf(genre) === index
        );
        const endOffset = itemOffset + itemsPerPage;
        setgamesByPage(gameListGenre.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(gameListGenre.length / itemsPerPage));
        setGenres(["All", ...genreList]);
        setGames(gameListGenre);
      });
    }
    return () => {
      effectRan.current = true;
    };
  }, [itemOffset, itemsPerPage, GamesByGenre]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % games.length;
    setItemOffset(newOffset);
    effectRan.current = false;
  };

  return (
    <div className="container">
      <GameVideo />
      <TaBar genres={genres} setGamesByGenre={setGamesByGenre} />
      <div className="cards_container">
        {gamesByPage ? (
          gamesByPage.map((game) => (
            <Game
              key={game.id}
              title={game.title}
              short_description={game.short_description}
              thumbnail={game.thumbnail}
              freetogame_profile_url={game.freetogame_profile_url}
            />
          ))
        ) : (
          <p className="error">No games found</p>
        )}
      </div>
      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="< previous"
        renderOnZeroPageCount={null}
        containerClassName="pagination"
        pageLinkClassName="page-num"
        previousClassName="page-num"
        nextLinkClassName="page-num"
        activeLinkClassName="active"
      />
    </div>
  );
};

export default GameList;
