import React, { useEffect, useState } from "react";
import axios from "axios";
import YouTube from "react-youtube";
import "./App.css";

const TMDB_API_KEY = "e6fcd25d55477bb3d5d3e4cedfe19bfe";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
const YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [trailerId, setTrailerId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchMovies("popular");
  }, []);

  const fetchMovies = async (query) => {
    const url = query === "popular"
      ? `${TMDB_BASE_URL}/movie/popular`
      : `${TMDB_BASE_URL}/search/movie`;

    const response = await axios.get(url, {
      params: { api_key: TMDB_API_KEY, query: query !== "popular" ? query : undefined },
    });

    setMovies(response.data.results);
    setSelectedMovie(response.data.results[0]);
  };

  const fetchTrailer = async (movie) => {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${movie.id}/videos`, {
      params: { api_key: TMDB_API_KEY },
    });

    const trailer = response.data.results.find((vid) => vid.type === "Trailer");

    if (trailer) {
      setTrailerId(trailer.key);
    } else {
      fetchYouTubeTrailer(movie.title);
    }
  };

  const fetchYouTubeTrailer = async (movieTitle) => {
    const response = await axios.get(YOUTUBE_SEARCH_URL, {
      params: {
        key: YOUTUBE_API_KEY,
        q: `${movieTitle} trailer`,
        part: "snippet",
        maxResults: 1,
        type: "video",
      },
    });

    const youtubeTrailer = response.data.items[0];
    setTrailerId(youtubeTrailer ? youtubeTrailer.id.videoId : "");
  };

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      fetchMovies(searchTerm);
    }
  };

  return (
    <div className="app">
      <form onSubmit={handleSearch} className="search-bar">
        <input
          type="text"
          placeholder="Search for movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {selectedMovie && (
        <div
          className="banner"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original/${selectedMovie.backdrop_path})`,
          }}
        >
          <div className="banner-content">
            <h1>{selectedMovie.title}</h1>
            <p>{selectedMovie.overview}</p>
            <button onClick={() => fetchTrailer(selectedMovie)}>Play Trailer</button>
          </div>
        </div>
      )}

      {trailerId && <YouTube videoId={trailerId} className="youtube-player" />}

      <div className="movies-grid">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <img
              src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
              alt={movie.title}
              onClick={() => setSelectedMovie(movie)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
