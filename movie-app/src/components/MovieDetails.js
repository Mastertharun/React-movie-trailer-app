import React, { useEffect, useState } from "react";
import { fetchMovieDetails } from "../services/movieService";

const MovieDetails = ({ movieId }) => {
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const getMovieDetails = async () => {
      const details = await fetchMovieDetails(movieId);
      setMovie(details);
    };
    getMovieDetails();
  }, [movieId]);

  if (!movie) return <div>Loading...</div>;

  return (
    <div className="movie-container">
      <h1 className="movie-title">{movie.Title}</h1>
      <p className="movie-description">{movie.Plot}</p>
      <button
        className="trailer-button"
        onClick={() =>
          window.open(`https://www.youtube.com/watch?v=${movie.Trailer}`, "_blank")
        }
      >
        PLAY TRAILER
      </button>
    </div>
  );
};

export default MovieDetails;
