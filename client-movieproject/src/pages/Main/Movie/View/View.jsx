import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './View.css';

const View = () => {
  const [movie, setMovie] = useState(null);
  const [castAndCrew, setCastAndCrew] = useState(null);
  const [photos, setPhotos] = useState(null);
  const [videos, setVideos] = useState(null);
  const [activeTab, setActiveTab] = useState('');
  const { movieId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (movieId) {
      axios.get(`/movies/${movieId}`).then((response) => {
        setMovie(response.data);
      });
    }
  }, [movieId]);

  useEffect(() => {
    if (movieId && activeTab === 'cast' && movie) {
      axios
        .get(`https://api.themoviedb.org/3/movie/${movie.tmdbId}/credits`, {
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjMTljYjFjZDgyMzc0ZjEyNzg0OThmNjUzODgwZTAzNyIsIm5iZiI6MTczMzMwMTEyOC4yOSwic3ViIjoiNjc1MDEzODg4MDEyZjkzZGJjNjk5YzZjIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.3OgGYzjxsWYnyqHHqtxSFJUC7njqWUFVacEvEzCC9Q4',
          },
        })
        .then((response) => setCastAndCrew(response.data));
    }
  }, [movieId, activeTab, movie]);

  useEffect(() => {
    if (movieId && activeTab === 'photos' && movie) {
      axios
        .get(`https://api.themoviedb.org/3/movie/${movie.tmdbId}/images`, {
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjMTljYjFjZDgyMzc0ZjEyNzg0OThmNjUzODgwZTAzNyIsIm5iZiI6MTczMzMwMTEyOC4yOSwic3ViIjoiNjc1MDEzODg4MDEyZjkzZGJjNjk5YzZjIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.3OgGYzjxsWYnyqHHqtxSFJUC7njqWUFVacEvEzCC9Q4',
          },
        })
        .then((response) => setPhotos(response.data));
    }
  }, [movieId, activeTab, movie]);

  useEffect(() => {
    if (movieId && activeTab === 'videos' && movie) {
      axios
        .get(`https://api.themoviedb.org/3/movie/${movie.tmdbId}/videos`, {
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjMTljYjFjZDgyMzc0ZjEyNzg0OThmNjUzODgwZTAzNyIsIm5iZiI6MTczMzMwMTEyOC4yOSwic3ViIjoiNjc1MDEzODg4MDEyZjkzZGJjNjk5YzZjIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.3OgGYzjxsWYnyqHHqtxSFJUC7njqWUFVacEvEzCC9Q4',
          },
        })
        .then((response) => setVideos(response.data));
    }
  }, [movieId, activeTab, movie]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleBackClick = () => {
    navigate('/Home');
  };

  return (
    <div className="view-container">
      {movie && (
        <>
          <div className="movie-banner">
            <button className="back-button" onClick={handleBackClick}>
              Back
            </button>
            <div className="movie-details-container">
              {movie.posterPath && (
                <img
                  className="movie-thumbnail"
                  src={`https://image.tmdb.org/t/p/original/${movie.posterPath}`}
                  alt={`${movie.title} Thumbnail`}
                />
              )}
              <div className="movie-info">
                <h1 className="movie-title">{movie.title}</h1>
                <p className="movie-overview">{movie.overview}</p>
                <p><strong>Released:</strong> {movie.releaseDate}</p>
                <p><strong>Genre:</strong> {movie.genre}</p>
                <p><strong>Duration:</strong> {movie.duration} min</p>
                <p><strong>IMDB:</strong> {movie.imdbRating}</p>
              </div>
            </div>
          </div>

          <nav>
            <ul className="tabs">
              <li
                onClick={() => handleTabClick('cast')}
                className={activeTab === 'cast' ? 'active tab-border' : 'tab-border'}
              >
                Cast & Crew
              </li>
              <li
                onClick={() => handleTabClick('photos')}
                className={activeTab === 'photos' ? 'active tab-border' : 'tab-border'}
              >
                Photos
              </li>
              <li
                onClick={() => handleTabClick('videos')}
                className={activeTab === 'videos' ? 'active tab-border' : 'tab-border'}
              >
                Videos
              </li>
            </ul>
          </nav>

          <div className="movie-data">
            {activeTab === 'cast' && castAndCrew && (
              <div className="cast-crew">
                <h3>Cast & Crew</h3>
                <div className="cast-list">
                  {castAndCrew.cast.map((cast) => (
                    <div key={cast.id} className="cast-item">
                      {cast.profile_path && (
                        <img
                          className="cast-image"
                          src={`https://image.tmdb.org/t/p/original/${cast.profile_path}`}
                          alt={cast.name}
                        />
                      )}
                      <p>{cast.name}</p>
                      <p>{cast.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'photos' && photos && photos.backdrops && (
              <div className="photos-section">
                <h3>Photos</h3>
                <div className="photos-list">
                  {photos.backdrops.map((photo) => (
                    <img
                      key={photo.file_path}
                      src={`https://image.tmdb.org/t/p/original/${photo.file_path}`}
                      alt="Movie Photo"
                      className="photo-item"
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'videos' && videos && videos.results && (
              <div className="videos-section">
                <h3>Videos</h3>
                <div className="videos-list">
                  {videos.results.map((video) => (
                    <div key={video.id} className="video-item">
                      <iframe
                        className="video-iframe"
                        src={`https://www.youtube.com/embed/${video.key}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                      <p>{video.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default View;
