import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './Main.css';

function Main() {
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/'); // Redirect to homepage after logout
  };

  useEffect(() => {
    if (
      accessToken === undefined ||
      accessToken === '' ||
      accessToken === null
    ) {
      handleLogout();
    }
  }, [accessToken, navigate]);

  return (
    <div className='Main'>
      <div className='container'>
        <div className='navigation'>
          <ul>
            <li className='logout'>
              <a onClick={() => navigate('/')}>Logout</a>
            </li>
            {accessToken ? (
              <li className='movies'>
                <a
                  onClick={() => {
                    navigate('/Home');
                    window.location.reload(); // Reload the page
                  }}
                >
                  Movies
                </a>
              </li>
            ) : (
              <li className='login'>
                <a onClick={() => alert('Go to Login page')}>Login</a>
              </li>
            )}
          </ul>
        </div>
        <div className='outlet'>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Main;
