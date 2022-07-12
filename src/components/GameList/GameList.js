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
  const effectRan2 = useRef(false);
  const [games, setGames] = useState([]);
  const [gamesOnline, setGamesOnline] = useState([]);
  const [genres, setGenres] = useState([]);
  const [GamesByGenre, setGamesByGenre] = useState(null);
  const [gamesByPage, setgamesByPage] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 9;
  const slideData = [
    {
      index: 0,
      headline: "New Fashion Apparel",
      src: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/225363/fashion.jpg",
    },
    {
      index: 1,
      headline: "In The Wilderness",
      src: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/225363/forest.jpg",
    },
    {
      index: 2,
      headline: "For Your Current Mood",
      src: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/225363/guitar.jpg",
    },
    {
      index: 3,
      headline: "Focus On The Writing",
      src: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/225363/typewriter.jpg",
    },
  ];

  useEffect(() => {
    if (effectRan.current === true) {
      axios.get("http://localhost:4000/api").then((res) => {
        var data = JSON.parse(res.data);
        var gameListGenre = GamesByGenre
          ? data.filter((game) => game.genre === GamesByGenre)
          : data;
        gameListGenre = gameListGenre.sort(
          (objA, objB) =>
            Number(new Date(objB.release_date)) -
            Number(new Date(objA.release_date))
        );
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

  useEffect(()=>{
    if (effectRan2.current === true) {
      axios.get("http://localhost:4000/online").then((res) => {
        let data=JSON.parse(res.data);
        let gamesMostPlayed= data.sort(
          (objA, objB) =>
            Number(objB.users) -
            Number(new Date(objA.users))
        );
        let gamesMostPlayedNewIndex = gamesMostPlayed.map((game,index)=>{ 
          game.id=index;
          return game;
        });
        console.log(gamesMostPlayedNewIndex);
        setGamesOnline(gamesMostPlayedNewIndex.slice(0, 10) );
      });
    }
    return () => {
      effectRan2.current = true;
    };
  },[])

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
      <GameSlider heading="Example Slider" slides={gamesOnline} />
    </div>
  );
};

export default GameList;
