import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import './Form.css';

const Form = () => {
  const [query, setQuery] = useState('');
  const [searchedMovieList, setSearchedMovieList] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(undefined);
  const [movie, setMovie] = useState(undefined);
  const [castAndCrew, setCastAndCrew] = useState(null);
  const [photos, setPhotos] = useState(null);
  const [videos, setVideos] = useState(null);
  const [activeTab, setActiveTab] = useState('');  // Added state for the active tab
  const navigate = useNavigate();
  let { movieId } = useParams();

  // Fetch movies based on the search query
  const handleSearch = useCallback(() => {
    axios({
      method: 'get',
      url: `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`,
      headers: {
        Accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjMTljYjFjZDgyMzc0ZjEyNzg0OThmNjUzODgwZTAzNyIsIm5iZiI6MTczMzMwMTEyOC4yOSwic3ViIjoiNjc1MDEzODg4MDEyZjkzZGJjNjk5YzZjIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.3OgGYzjxsWYnyqHHqtxSFJUC7njqWUFVacEvEzCC9Q4',
      },
    }).then((response) => {
      setSearchedMovieList(response.data.results);
      console.log(response.data.results);
    });
  }, [query]);

  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
  };

  const handleSave = () => {
    const accessToken = localStorage.getItem('accessToken');
    console.log(accessToken);
    if (selectedMovie === undefined) {
      alert('Please search and select a movie.');
    } else {
      const data = {
        tmdbId: selectedMovie.id,
        title: selectedMovie.title,
        overview: selectedMovie.overview,
        popularity: selectedMovie.popularity,
        releaseDate: selectedMovie.release_date,
        voteAverage: selectedMovie.vote_average,
        backdropPath: `https://image.tmdb.org/t/p/original/${selectedMovie.backdrop_path}`,
        posterPath: `https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`,
        isFeatured: 0,
      };

      const request = axios({
        method: 'post',
        url: '/movies',
        data: data,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((saveResponse) => {
          console.log(saveResponse);
          alert('Success');
        })
        .catch((error) => console.log(error));
    }
  };

  // Fetch the movie details for editing
  useEffect(() => {
    if (movieId) {
      axios.get(`/movies/${movieId}`).then((response) => {
        setMovie(response.data);
        const tempData = {
          id: response.data.tmdbId,
          original_title: response.data.title,
          overview: response.data.overview,
          popularity: response.data.popularity,
          poster_path: response.data.posterPath,
          release_date: response.data.releaseDate,
          vote_average: response.data.voteAverage,
        };
        setSelectedMovie(tempData);
        console.log(response.data);
      });
    }
  }, [movieId]);

  // Fetch Cast & Crew
  const fetchCastAndCrew = (movieId) => {
    axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjMTljYjFjZDgyMzc0ZjEyNzg0OThmNjUzODgwZTAzNyIsIm5iZiI6MTczMzMwMTEyOC4yOSwic3ViIjoiNjc1MDEzODg4MDEyZjkzZGJjNjk5YzZjIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.3OgGYzjxsWYnyqHHqtxSFJUC7njqWUFVacEvEzCC9Q4',
      },
    })
    .then((response) => setCastAndCrew(response.data));
  };

  // Fetch Photos
  const fetchPhotos = (movieId) => {
    axios.get(`https://api.themoviedb.org/3/movie/${movieId}/images`, {
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjMTljYjFjZDgyMzc0ZjEyNzg0OThmNjUzODgwZTAzNyIsIm5iZiI6MTczMzMwMTEyOC4yOSwic3ViIjoiNjc1MDEzODg4MDEyZjkzZGJjNjk5YzZjIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.3OgGYzjxsWYnyqHHqtxSFJUC7njqWUFVacEvEzCC9Q4',
      },
    })
    .then((response) => setPhotos(response.data));
  };

  // Fetch Videos
  const fetchVideos = (movieId) => {
    axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos`, {
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjMTljYjFjZDgyMzc0ZjEyNzg0OThmNjUzODgwZTAzNyIsIm5iZiI6MTczMzMwMTEyOC4yOSwic3ViIjoiNjc1MDEzODg4MDEyZjkzZGJjNjk5YzZjIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.3OgGYzjxsWYnyqHHqtxSFJUC7njqWUFVacEvEzCC9Q4',
      },
    })
    .then((response) => setVideos(response.data));
  };

  // Handle tab clicks
  const handleTabClick = (tab) => {
    setActiveTab(tab);  // Set active tab
    if (selectedMovie) {
      switch (tab) {
        case 'cast':
          fetchCastAndCrew(selectedMovie.id);
          break;
        case 'photos':
          fetchPhotos(selectedMovie.id);
          break;
        case 'videos':
          fetchVideos(selectedMovie.id);
          break;
        default:
          break;
      }
    }
  };

  return (
    <>
      <h1>{movieId !== undefined ? 'Edit ' : 'Create '} Movie</h1>

      {movieId === undefined && (
        <>
          <div className='search-container'>
            Search Movie:{' '}
            <input
              type='text'
              onChange={(event) => setQuery(event.target.value)}
            />
            <button type='button' onClick={handleSearch}>
              Search
            </button>
            <div className='searched-movie'>
              {searchedMovieList.map((movie) => (
                <p onClick={() => handleSelectMovie(movie)} key={movie.id}>
                  {movie.original_title}
                </p>
              ))}
            </div>
          </div>
          <hr />
        </>
      )}

      <div className='container'>
        <form>
          {selectedMovie && (
            <img
              className='poster-image'
              src={`https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`}
              alt={selectedMovie.original_title}
            />
          )}
          <div className='field'>
            Title:
            <input
              type='text'
              value={selectedMovie ? selectedMovie.original_title : ''}
            />
          </div>
          <div className='field'>
            Overview:
            <textarea
              rows={10}
              value={selectedMovie ? selectedMovie.overview : ''}
            />
          </div>

          <div className='field'>
            Popularity:
            <input
              type='text'
              value={selectedMovie ? selectedMovie.popularity : ''}
            />
          </div>

          <div className='field'>
            Release Date:
            <input
              type='text'
              value={selectedMovie ? selectedMovie.release_date : ''}
            />
          </div>

          <div className='field'>
            Vote Average:
            <input
              type='text'
              value={selectedMovie ? selectedMovie.vote_average : ''}
            />
          </div>

          <button type='button' onClick={handleSave}>
            Save
          </button>
        </form>
      </div>

      {movieId !== undefined && selectedMovie && (
        <div>
          <hr />
          <nav>
            <ul className='tabs'>
              <li onClick={() => handleTabClick('cast')} className={activeTab === 'cast' ? 'active' : ''}>Cast & Crews</li>
              <li onClick={() => handleTabClick('videos')} className={activeTab === 'videos' ? 'active' : ''}>Videos</li>
              <li onClick={() => handleTabClick('photos')} className={activeTab === 'photos' ? 'active' : ''}>Photos</li>
            </ul>
          </nav>

          <div className='data-section'>
            {activeTab === 'cast' && castAndCrew && (
              <div>
                <h3>Cast & Crew</h3>
                <ul>
                  {castAndCrew.cast.map((cast) => (
                    <li key={cast.id}>{cast.name}</li>
                  ))}
                </ul>
                <ul>
                  {castAndCrew.crew.map((crew) => (
                    <li key={crew.id}>{crew.name}</li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'photos' && photos && photos.backdrops && (
              <div>
                <h3>Photos</h3>
                <div>
                  {photos.backdrops.map((photo) => (
                    <img
                      key={photo.file_path}
                      src={`https://image.tmdb.org/t/p/original/${photo.file_path}`}
                      alt="Movie Backdrop"
                      style={{ width: '200px' }}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'videos' && videos && (
              <div>
                <h3>Videos</h3>
                <ul>
                  {videos.results.map((video) => (
                    <li key={video.id}>
                      <a
                        href={`https://www.youtube.com/watch?v=${video.key}`}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        {video.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Form;
