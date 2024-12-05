import { useNavigate } from 'react-router-dom';
import './Home.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import MovieCards from '../../../../components/MovieCards/MovieCards';
import { useMovieContext } from '../../../../context/MovieContext';

const Home = () => {
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const { movieList, setMovieList, setMovie } = useMovieContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  const getMovies = () => {
    axios
      .get('/movies')
      .then((response) => {
        setMovieList(response.data);
        setFeaturedMovie(response.data[0]); // Start with the first movie
      })
      .catch((e) => console.log(e));
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredMovies = movieList.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const nextFeaturedMovie = () => {
    const nextIndex = (currentIndex + 1) % movieList.length;
    setCurrentIndex(nextIndex);
    setFeaturedMovie(movieList[nextIndex]);
  };

  const prevFeaturedMovie = () => {
    const prevIndex = (currentIndex - 1 + movieList.length) % movieList.length;
    setCurrentIndex(prevIndex);
    setFeaturedMovie(movieList[prevIndex]);
  };

  useEffect(() => {
    getMovies();
  }, []);

  
  useEffect(() => {
    const interval = setInterval(nextFeaturedMovie, 5000);
    return () => clearInterval(interval); 
  }, [currentIndex, movieList]);

  return (
    <div className='main-container'>
      <h1 className='page-title'>Movies</h1>

      {/* Search Bar */}
      <div className='search-container'>
        <input
          type='text'
          placeholder='Search for a movie...'
          value={searchQuery}
          onChange={handleSearch}
          className='search-bar'
        />
      </div>

      {featuredMovie && movieList.length ? (
        <div className='featured-list-container'>
          <div
            className='featured-backdrop'
            style={{
              background: `url(${
                featuredMovie.backdropPath !==
                'https://image.tmdb.org/t/p/original/undefined'
                  ? featuredMovie.backdropPath
                  : featuredMovie.posterPath
              }) no-repeat center center`,
              backgroundSize: 'cover',
              transition: 'background-image 1s ease-in-out',
            }}
          >
            <div className='featured-content'>
              <img
                src={featuredMovie.posterPath}
                alt={featuredMovie.title}
                className='featured-poster'
              />
              <div className='featured-details'>
                <h2 className='featured-title'>{featuredMovie.title}</h2>
                <p className='featured-description'>
                  {featuredMovie.description}
                </p>
                <button
                  className='watch-now-btn'
                  onClick={() => navigate(`/view/${featuredMovie.id}`)}
                >
                  Watch Now
                </button>
              </div>
            </div>
            <button className='prev-btn' onClick={prevFeaturedMovie}>
              &#10094;
            </button>
            <button className='next-btn' onClick={nextFeaturedMovie}>
              &#10095;
            </button>
          </div>
        </div>
      ) : (
        <div className='featured-list-container-loader'></div>
      )}

      <div className='list-container'>
        {filteredMovies.map((movie) => (
          <MovieCards
            key={movie.id}
            movie={movie}
            onClick={() => {
              navigate(`/view/${movie.id}`);
              setMovie(movie);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
