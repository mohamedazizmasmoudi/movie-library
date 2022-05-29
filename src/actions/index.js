import * as TYPES from "./types";
import tmdbAPI from "../api/tmdb";
import history from "../history";
import axios from "axios";
import { toast } from "react-toastify";
// When app inits
export const init = () => async (dispatch) => {
  dispatch({ type: TYPES.SET_LOADING });
  await dispatch(getConfig());
  await dispatch(getGenres());
  dispatch({ type: TYPES.REMOVE_LOADING });
};
export const sigin = (data, typeRequest, person) => async (dispatch) => {
  // const onSubmit = async (data) => {
  try {
    const Client = axios.create({ baseURL: "http://localhost:8080/api/" });
    dispatch({ type: TYPES.FETCH_PERSON_LOADING });
    let res = await Client.post(`${typeRequest}`, data);
    if (res.data.token) {
      localStorage.setItem("tokenmovieapp", res.data.token);
      window.location.href = "/";
      toast.success("Sigin success!");
      await dispatch({
        type: TYPES.FETCH_PERSON,
        payload: { ...person, favoriteFilm: res.data.user.favoriteFilm },
      });
      dispatch({ type: TYPES.FETCH_PERSON_FINISHED });
    } else toast.success(res.data.message);
  } catch (err) {
    toast.error(err.response.data.error);
    throw err.response.data;
  }
};
const config = (token) => {
  return {
    headers: {
      Authorization: `${token}`,
    },
  };
};
export const getFavoriteFilm = (person) => async (dispatch) => {
  try {
    const Client = axios.create({ baseURL: "http://localhost:8080/api/user/" });
    const token = localStorage.getItem("tokenmovieapp");
    dispatch({ type: TYPES.FETCH_PERSON_LOADING });
    let res = await Client.get(`getFavoriteFilm`, config(token));
    console.log('res.data',res.data)
    await dispatch({
      type: TYPES.FETCH_PERSON,
      payload: { ...person,  favoriteFilm: res.data.favoriteFilm,userData: res.data },
    });
    dispatch({ type: TYPES.FETCH_PERSON_FINISHED });
  } catch (err) {
    toast.error(err.response.data.error);
    throw err.response.data;
  }
};
export const adddeleteFavoriteFilm = (person, typeRequest, movie) => async (
  dispatch
) => {
  try {
    const Client = axios.create({ baseURL: "http://localhost:8080/api/user/" });
    const token = localStorage.getItem("tokenmovieapp");

    // dispatch({ type: TYPES.FETCH_PERSON_LOADING });
    let res = await Client.put(typeRequest, { id: movie.id }, config(token));
    if (typeRequest === "addFavoriteFilm") {
      await dispatch({
        type: TYPES.FETCH_PERSON,
        payload: { ...person, favoriteFilm: res.data.favoriteFilm },
      });

      toast.success("add movie to favorite success!");
    } else if (typeRequest === "removeFavoriteFilm") {
      await dispatch({
        type: TYPES.FETCH_PERSON,
        payload: { ...person, favoriteFilm: res.data.favoriteFilm },
      });
      toast.success("remove movie from favorite success!");
    }
    // dispatch({ type: TYPES.FETCH_PERSON_FINISHED });
  } catch (err) {
    toast.error(err.response.data.error);
    throw err.response.data;
  }
};

// Action Creator to get the config object from the API
export const getConfig = () => async (dispatch) => {
  const res = await tmdbAPI.get("/configuration");
  dispatch({
    type: TYPES.GET_CONFIG,
    payload: res.data,
  });
};

// Get genres from API
export const getGenres = () => async (dispatch) => {
  const res = await tmdbAPI.get("/genre/movie/list");
  dispatch({
    type: TYPES.GET_GENRES,
    payload: res.data,
  });
};

// Set the current selected menu (discover or genre), if is valid
export const setSelectedMenu = (name) => (dispatch, getState) => {
  const { staticCategories, genres } = getState().geral;
  if (!name) {
    dispatch({ type: TYPES.REMOVE_SELECTED_MENU });
  } else if (
    staticCategories.find((category) => category === name) ||
    genres.find((genre) => genre.name === name)
  ) {
    dispatch({
      type: TYPES.SELECTED_MENU,
      payload: name,
    });
  } else {
    history.push(process.env.PUBLIC_URL + "/404");
  }
};

// Get movies by genre
export const getMoviesGenre = (name, page, sort) => async (
  dispatch,
  getState
) => {
  const { selected, genres } = getState().geral;
  if (!selected) {
    return;
  }
  try {
    dispatch({ type: TYPES.FETCH_MOVIES_LOADING });
    const genreId = genres
      .filter((el) => el.name === name)
      .map((el) => el.id)
      .join("");
    const res = await tmdbAPI.get("/discover/movie", {
      params: {
        with_genres: genreId,
        page,
        sort_by: sort,
      },
    });
    await dispatch({
      type: TYPES.FETCH_MOVIES_GENRE,
      payload: res.data,
    });
    dispatch({ type: TYPES.FETCH_MOVIES_FINISHED });
  } catch (err) {
    dispatch({ type: TYPES.INSERT_ERROR, payload: err.response });
    history.push(process.env.PUBLIC_URL + "/error");
  }
};

// Get movies discover
export const getMoviesDiscover = (name, page) => async (dispatch, getState) => {
  const { selected } = getState().geral;
  if (!selected) {
    return;
  }
  try {
    dispatch({ type: TYPES.FETCH_MOVIES_LOADING });
    const res = await tmdbAPI.get(`/movie/${name}`, {
      params: {
        page,
      },
    });
    await dispatch({
      type: TYPES.FETCH_MOVIES_DISCOVER,
      payload: res.data,
    });
    dispatch({ type: TYPES.FETCH_MOVIES_FINISHED });
  } catch (err) {
    dispatch({ type: TYPES.INSERT_ERROR, payload: err.response });
    history.push(process.env.PUBLIC_URL + "/error");
  }
};

// Get movies search
export const getMoviesSearch = (query, page) => async (dispatch) => {
  try {
    dispatch({ type: TYPES.FETCH_MOVIES_LOADING });
    const res = await tmdbAPI.get(`/search/movie`, {
      params: {
        query,
        page,
      },
    });
    await dispatch({
      type: TYPES.FETCH_MOVIES_SEARCH,
      payload: res.data,
    });
    dispatch({ type: TYPES.FETCH_MOVIES_FINISHED });
  } catch (err) {
    dispatch({ type: TYPES.INSERT_ERROR, payload: err.response });
    history.push(process.env.PUBLIC_URL + "/error");
  }
};

// Set loading to true for next render
export const clearMovies = () => {
  return {
    type: TYPES.FETCH_MOVIES_LOADING,
  };
};

// Get single movie
export const getMovie = (id) => async (dispatch) => {
  try {
    dispatch({ type: TYPES.FETCH_MOVIE_LOADING });
    const res = await tmdbAPI.get(`/movie/${id}`, {
      params: {
        append_to_response: "videos",
      },
    });
    await dispatch({
      type: TYPES.FETCH_MOVIE,
      payload: res.data,
    });
    await dispatch(getCredits());
    dispatch({ type: TYPES.FETCH_MOVIE_FINISHED });
  } catch (err) {
    dispatch({ type: TYPES.INSERT_ERROR, payload: err.response });
    history.push(process.env.PUBLIC_URL + "/error");
  }
};
// Get single movie
export const getFavoriteFilmData = (person) => async (dispatch) => {
  try {
    dispatch({ type: TYPES.FETCH_MOVIES_LOADING });
    let movies = []
    for (let index = 0; index < person.favoriteFilm.length; index++) {
      const element = person.favoriteFilm[index];
      const res = await tmdbAPI.get(`/movie/${element}`, {
        params: {
          append_to_response: "videos",
        },
      });
      movies.push(res.data)
    }
    await dispatch({
      type: TYPES.FETCH_MOVIES_GENRE,
      payload: {results:movies,page : 1 ,total_results:movies.length,total_pages:Math.ceil(movies.length/20)},
    });
    dispatch({ type: TYPES.FETCH_MOVIES_FINISHED });
  } catch (err) {
    dispatch({ type: TYPES.INSERT_ERROR, payload: err.response });
    history.push(process.env.PUBLIC_URL + "/error");
  }
};



// Set loading to true for next render
export const clearMovie = () => {
  return {
    type: TYPES.FETCH_MOVIE_LOADING,
  };
};

// Get credits of single movie
export const getCredits = () => async (dispatch, getState) => {
  const { id } = getState().movie;

  try {
    const res = await tmdbAPI.get(`/movie/${id}/credits`);
    dispatch({
      type: TYPES.FETCH_CAST,
      payload: res.data.cast,
    });
  } catch (err) {
    dispatch({ type: TYPES.INSERT_ERROR, payload: err.response });
    history.push(process.env.PUBLIC_URL + "/error");
  }
};

// Get recommended movies based on another
export const getRecommendations = (id, page) => async (dispatch) => {
  try {
    dispatch({ type: TYPES.FETCH_RECOMMENDATIONS_LOADING });
    const res = await tmdbAPI.get(`/movie/${id}/recommendations`, {
      params: {
        page,
      },
    });
    await dispatch({
      type: TYPES.FETCH_RECOMMENDATIONS,
      payload: res.data,
    });
    dispatch({ type: TYPES.FETCH_RECOMMENDATIONS_FINISHED });
  } catch (err) {
    dispatch({ type: TYPES.INSERT_ERROR, payload: err.response });
    history.push(process.env.PUBLIC_URL + "/error");
  }
};

// Set loading to true for next render
export const clearRecommendations = () => {
  return {
    type: TYPES.FETCH_RECOMMENDATIONS_LOADING,
  };
};

// Get Person details
export const getPerson = (id, person) => async (dispatch) => {
  try {
    dispatch({ type: TYPES.FETCH_PERSON_LOADING });
    const res = await tmdbAPI.get(`/person/${id}`);
    await dispatch({
      type: TYPES.FETCH_PERSON,
      payload: { ...person, ...res.data },
    });
    dispatch({ type: TYPES.FETCH_PERSON_FINISHED });
  } catch (err) {
    dispatch({ type: TYPES.INSERT_ERROR, payload: err.response });
    history.push(process.env.PUBLIC_URL + "/error");
  }
};

// Set loading to true for next render
export const clearPerson = () => {
  return {
    type: TYPES.FETCH_PERSON_LOADING,
  };
};

// Get movies from an actor
export const getMoviesforPerson = (id, page, sort) => async (dispatch) => {
  try {
    dispatch({ type: TYPES.FETCH_MOVIESPERSON_LOADING });
    const res = await tmdbAPI.get(`/discover/movie`, {
      params: {
        with_cast: id,
        page,
        sort_by: sort,
      },
    });
    await dispatch({
      type: TYPES.FETCH_MOVIESPERSON,
      payload: res.data,
    });
    dispatch({ type: TYPES.FETCH_MOVIESPERSON_FINISHED });
  } catch (err) {
    dispatch({ type: TYPES.INSERT_ERROR, payload: err.response });
    history.push(process.env.PUBLIC_URL + "/error");
  }
};

// Set loading to true for next render
export const clearMoviesforPerson = () => {
  return {
    type: TYPES.FETCH_MOVIESPERSON_LOADING,
  };
};

// Clear error
export const clearError = () => ({ type: TYPES.CLEAR_ERROR });
