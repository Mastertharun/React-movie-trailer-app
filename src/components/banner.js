import { useState } from "react";
import YouTube from "react-youtube";

const Banner = ({ selectedMovie, fetchTrailer, trailerId }) => {
  const [playTrailer, setPlayTrailer] = useState(false);

  return (
    <div
      className="banner"
      style={{
        backgroundImage: playTrailer
          ? "none"
          : `url(https://image.tmdb.org/t/p/original/${selectedMovie?.backdrop_path})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {playTrailer ? (
        <YouTube
          videoId={trailerId}
          opts={{
            width: "100%",
            height: "100%",
            playerVars: { autoplay: 1 },
          }}
          className="youtube-player"
        />
      ) : (
        <div className="banner-content">
          <h1>{selectedMovie?.title}</h1>
          <p>{selectedMovie?.overview}</p>
          <button onClick={() => { fetchTrailer(selectedMovie.id); setPlayTrailer(true); }}>
            Play Trailer
          </button>
        </div>
      )}
    </div>
  );
};

export default Banner;
