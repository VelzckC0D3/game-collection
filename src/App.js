import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchGames, setCategory, clearCategory } from './redux/gameSlice';
import Header from './components/Header';
import Categories from './components/Home';
import GameList from './components/GameList';

const App = () => {
  const dispatch = useDispatch();
  const games = useSelector((state) => state.game.games);
  const error = useSelector((state) => state.game.error);
  const selectedCategory = useSelector((state) => state.game.selectedCategory);
  const navigate = useNavigate();
  const location = useLocation();

  const handleCategoryChange = (category) => {
    dispatch(setCategory(category));
    setTimeout(() => {
      navigate(`/${category}`);
    }, 300);
  };

  const handleGoBack = () => {
    dispatch(clearCategory());
    navigate('/');
  };

  useEffect(() => {
    if (location.pathname === '/') {
      dispatch(clearCategory());
      localStorage.removeItem('selectedCategory');
    } else {
      const categoryFromPath = location.pathname.substring(1);
      if (categoryFromPath) {
        dispatch(setCategory(categoryFromPath));
        localStorage.setItem('selectedCategory', categoryFromPath);
      } else {
        dispatch(clearCategory());
        localStorage.removeItem('selectedCategory');
      }
    }
  }, [location.pathname, dispatch]);

  useEffect(() => {
    if (selectedCategory) {
      dispatch(fetchGames(selectedCategory));
      localStorage.setItem('selectedCategory', selectedCategory);
    } else {
      dispatch(fetchGames());
    }
  }, [selectedCategory, dispatch]);

  if (error) {
    return (
      <p>
        Error:
        {' '}
        {error}
      </p>
    );
  }

  return (
    <>
      <Header
        categoryName={selectedCategory}
        handleGoBack={selectedCategory ? handleGoBack : null}
      />
      {!selectedCategory && <Categories handleCategoryChange={handleCategoryChange} />}
      {selectedCategory && <GameList games={games} selectedCategory={selectedCategory} />}
    </>
  );
};

export default App;
