import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import Movie from "./components/Movie";
import Youtube from "react-youtube";

function App() {
  const MOVIE_API = "https://api.themoviedb.org/3/";
  const SEARCH_API = MOVIE_API + "search/movie";
  const DISCOVER_API = MOVIE_API + "discover/movie";
  const API_KEY = "db7fcbea49697762df87707c38e63b29"; // Updated API key
  const BACKDROP_PATH = "https://image.tmdb.org/t/p/w1280";

  const [playing, setPlaying] = useState(false);
  const [trailer, setTrailer] = useState(null);
  const [movies, setMovies] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [movie, setMovie] = useState({ title: "Loading Movies" });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async (event) => {
    if (event) {
      event.preventDefault();
    }
    try {
      const { data } = await axios.get(
        `${searchKey ? SEARCH_API : DISCOVER_API}`,
        {
          params: {
            api_key: API_KEY,
            query: searchKey,
          },
        },
      );
      setMovies(data.results);
      setMovie(data.results[0]);
      if (data.results.length) {
        await fetchMovie(data.results[0].id);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      alert(
        "Failed to fetch movies. Please check your API key and permissions.",
      );
    }
  };

  const fetchMovie = async (id) => {
    try {
      const { data } = await axios.get(`${MOVIE_API}movie/${id}`, {
        params: {
          api_key: API_KEY,
          append_to_response: "videos",
        },
      });

      if (data.videos && data.videos.results) {
        const trailer = data.videos.results.find(
          (vid) => vid.name === "Official Trailer",
        );
        setTrailer(trailer ? trailer : data.videos.results[0]);
        console.log(
          "Trailer video ID:",
          trailer ? trailer.key : "No trailer found",
        );
      }
      setMovie(data);
    } catch (error) {
      console.error("Error fetching movie:", error);
      alert(
        "Failed to fetch movie details. Please check your API key and permissions.",
      );
    }
  };

  const selectMovie = (movie) => {
    fetchMovie(movie.id);
    setPlaying(false);
    setMovie(movie);
    window.scrollTo(0, 0);
  };

  const renderMovies = () =>
    movies.map((movie) => (
      <Movie selectMovie={selectMovie} key={movie.id} movie={movie} />
    ));

  return (
    <div className="App">
      <header className="center-max-size header">
        <span>Movie Trailer App</span>
        <form className="form" onSubmit={fetchMovies}>
          <input
            type="text"
            id="search"
            onInput={(event) => setSearchKey(event.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </header>
      <main>
        {movies.length ? (
          <>
            <div
              className="poster"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${BACKDROP_PATH}${movie.backdrop_path})`,
              }}
            >
              <div className="center-max-size">
                <div className="poster-content">
                  {playing ? (
                    <>
                      <Youtube
                        videoId={trailer?.key}
                        className={"youtube amru"}
                        containerClassName={"youtube-container amru"}
                        opts={{
                          width: "100%",
                          height: "100%",
                          playerVars: {
                            autoplay: 1,
                            controls: 1,
                            cc_load_policy: 0,
                            fs: 1,
                            iv_load_policy: 0,
                            modestbranding: 1,
                            rel: 0,
                            showinfo: 0,
                          },
                        }}
                      />
                      <button
                        onClick={() => setPlaying(false)}
                        className={"button close-video"}
                      >
                        Close
                      </button>
                    </>
                  ) : (
                    <>
                      {trailer ? (
                        <button
                          className={"button play-video"}
                          onClick={() => setPlaying(true)}
                          type="button"
                        >
                          Play Trailer
                        </button>
                      ) : (
                        "Sorry, no trailer available"
                      )}
                      <h1>{movie.title}</h1>
                      <p>{movie.overview}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className={"center-max-size container"}>{renderMovies()}</div>
          </>
        ) : (
          "Sorry, no movies found"
        )}
      </main>
    </div>
  );
}

export default App;
