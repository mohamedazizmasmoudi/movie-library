import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import Header from '../components/Header';
import styled from 'styled-components';
import { animateScroll as scroll } from 'react-scroll';

import { setSelectedMenu, getMoviesDiscover, clearMovies, getFavoriteFilm } from '../actions';
import MoviesList from '../components/MoviesList';
import Loader from '../components/Loader';

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

// Discover Component
const Discover = ({
  geral,
  match,
  location,
  setSelectedMenu,
  getMoviesDiscover,
  clearMovies,
  movies,
  person,
  getFavoriteFilm
}) => {
  const params = queryString.parse(location.search);
  const { secure_base_url } = geral.base.images;

  // Send url to setSelected Action Creator, it will check if is valid
  useEffect(() => {
    setSelectedMenu(match.params.name);
    // Clean up to remove selected menu from state
    return () => setSelectedMenu();
  }, [match.params.name]);

  // Call hook to fetch movies discover, pass in the url query
  useFetchMoviesDiscover(
    match.params.name,
    getMoviesDiscover,
    params,
    clearMovies,
    person,
    getFavoriteFilm
  );

  // If loading
  if (movies.loading) {
    return <Loader />;
  }
  if (person.loading) {
    return <Loader />;
  }
  // Else return movies list
  return (
    <Wrapper>
        <meta charSet="utf-8" />
        <title>{`${geral.selected} Movies`}</title>
      <Header title={geral.selected} subtitle="movies" />
      <MoviesList movies={movies} baseUrl={secure_base_url} />
    </Wrapper>
  );
};

// Hook to fetch the movies, will be called everytime the route or the filters from the state change
function useFetchMoviesDiscover(name, getMoviesDiscover, params, clearMovies, person,
  getFavoriteFilm) {
  const query = name.replace(/\s+/g, '_').toLowerCase();
  useEffect(() => {
    scroll.scrollToTop({
      smooth: true,
    });
    getMoviesDiscover(query, params.page);
    getFavoriteFilm(person)
    return () => clearMovies();
  }, [query, params.page]);
}

// Map State to Component Props
const mapStateToProps = ({ geral, movies, person }) => {
  return { geral, movies, person };
};

export default connect(
  mapStateToProps,
  { setSelectedMenu, getMoviesDiscover, clearMovies, getFavoriteFilm }
)(Discover);
