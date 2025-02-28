import React, { useEffect, useState } from "react";
import axios from "axios";
import YouTube from "react-youtube";
import "./App.css";

const API_KEY = "e6fcd25d55477bb3d5d3e4cedfe19bfe";
const BASE_URL = "https://api.themoviedb.org/3";

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
      ? `${BASE_URL}/movie/popular`
      : `${BASE_URL}/search/movie`;
    
    const response = await axios.get(url, {
      params: { api_key: API_KEY, query: query !== "popular" ? query : undefined },
    });
    setMovies(response.data.results);
    setSelectedMovie(response.data.results[0]);
  };      
  const fetchTrailer = async (movieId) => {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}/videos`, {
      params: { api_key: API_KEY },
    });
    const trailer = response.data.results.find((vid) => vid.type === "Trailer");
    setTrailerId(trailer ? trailer.key : "");
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
            <button onClick={() => fetchTrailer(selectedMovie.id)}>Play Trailer</button>
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