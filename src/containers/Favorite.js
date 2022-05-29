import React, { useEffect } from "react";
import { connect } from "react-redux";
import queryString from "query-string";
import Header from "../components/Header";
import styled from "styled-components";
import { animateScroll as scroll } from "react-scroll";

import {
  setSelectedMenu,
  getFavoriteFilmData,
  clearMovies,
  getFavoriteFilm,
} from "../actions";
import MoviesList from "../components/MoviesList";
import Loader from "../components/Loader";

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;
const Title = styled.h1`
  text-align: center;
  font-size: ${(props) => (props.size === "2" ? "4rem" : "2.5rem")};
  font-weight: 200;
  line-height: ${(props) => (props.size === "2" ? "1.2" : "1")};
  color: var(--color-primary-dark);
  letter-spacing: -0.5px;
  text-transform: uppercase;
  margin-bottom: 0.5rem;

  @media ${(props) => props.theme.mediaQueries.medium} {
    font-size: ${(props) => (props.size === "2" ? "2.7rem" : "2.2rem")};
  }

  @media ${(props) => props.theme.mediaQueries.small} {
    font-size: ${(props) => (props.size === "2" ? "2.2rem" : "2rem")};
  }
`;
const NoMoviesList = styled.div`
display: grid;
grid-template-columns: repeat(auto-fit, minmax(10rem, 25rem));
justify-content: space-evenly;
align-content: space-between;
align-items: start;
padding: 35rem 0;
grid-gap: 4rem 2rem;
`
// Discover Component
const Favorite = ({
  geral,
  match,
  location,
  setSelectedMenu,
  getFavoriteFilmData,
  clearMovies,
  movies,
  person,
  getFavoriteFilm,
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
    "Favorite",
    getFavoriteFilmData,
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
      <title>{`Favorite Movies`}</title>
      <Header title={`Favorite Movies`} subtitle="movies" />
      {movies.length > 0 ? (
        <MoviesList movies={movies} baseUrl={secure_base_url} />
      ) : (
        <NoMoviesList>
          <Title size={2}>no favorite Film</Title>
        </NoMoviesList>
      )}
    </Wrapper>
  );
};

// Hook to fetch the movies, will be called everytime the route or the filters from the state change
function useFetchMoviesDiscover(
  name,
  getFavoriteFilmData,
  params,
  clearMovies,
  person,
  getFavoriteFilm
) {
  const query = name.replace(/\s+/g, "_").toLowerCase();
  useEffect(() => {
    scroll.scrollToTop({
      smooth: true,
    });
    getFavoriteFilm(person);
    getFavoriteFilmData(person);
    return () => clearMovies();
  }, [query, params.page]);
}

// Map State to Component Props
const mapStateToProps = ({ geral, movies, person }) => {
  return { geral, movies, person };
};

export default connect(mapStateToProps, {
  setSelectedMenu,
  getFavoriteFilmData,
  clearMovies,
  getFavoriteFilm,
})(Favorite);
