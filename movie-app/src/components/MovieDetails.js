// src/components/MovieDetails.js
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
    <div className="movie-details">
      <h2>{movie.Title}</h2>
      <p>{movie.Plot}</p>
      <iframe
        src={`https://www.youtube.com/embed/${movie.Trailer}`}
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
        title="video"
      />
    </div>
  );
};

export default MovieDetails;
