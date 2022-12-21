import express from 'express';
import uniqid from 'uniqid'
import asyncHandler from 'express-async-handler';
import { getMovie, getMovies, getUpcomingMovies, getNowPlayingMovies, getTopRatedMovies, getRecommendedMovies, getSimilarMovies, getMovieCredits, getTrendingMovies, getMovieImages } from '../tmdb/tmdb-api';
const router = express.Router(); 


// Get movie from tmdb
router.get('/tmdb/movie/:id', asyncHandler( async(req, res,) => {
    const movie = await getMovie(req.params.id);
    res.status(200).json(movie);
  }));

// Get discover movies
router.get('/tmdb/discover', asyncHandler( async(req, res) => {
  const movies = await getMovies();
  res.status(200).json(movies);
}));

// Get upcoming movies
router.get('/tmdb/upcoming', asyncHandler( async(req, res) => {
  const movies = await getUpcomingMovies();
  res.status(200).json(movies);
}));

// Get now playing movies
router.get('/tmdb/now-playing', asyncHandler( async(req, res) => {
  const movies = await getNowPlayingMovies();
  res.status(200).json(movies);
}));

// Get top rated movies
router.get('/tmdb/top-rated', asyncHandler( async(req, res) => {
  const movies = await getTopRatedMovies();
  res.status(200).json(movies);
}));

// Get redommended movies from tmdb
router.get('/tmdb/movie/:id/recommended', asyncHandler( async(req, res,) => {
  const movies = await getRecommendedMovies(req.params.id);
  res.status(200).json(movies);
}));

// Get similar movies from tmdb
router.get('/tmdb/movie/:id/similar', asyncHandler( async(req, res,) => {
  const movies = await getSimilarMovies(req.params.id);
  res.status(200).json(movies);
}));

// Get movie cast from tmdb
router.get('/tmdb/movie/:id/credits', asyncHandler( async(req, res,) => {
  const cast = await getMovieCredits(req.params.id);
  res.status(200).json(cast);
}));

// Get trending movies
router.get('/tmdb/trending', asyncHandler( async(req, res) => {
  const movies = await getTrendingMovies();
  res.status(200).json(movies);
}));

// Get movie images
router.get('/tmdb/movie/:id/images', asyncHandler( async(req, res) => {
  const images = await getMovieImages(req.params.id);
  res.status(200).json(images);
}));
/*
//Post a movie review
router.post('/:id/reviews', (req, res) => {
  const id = parseInt(req.params.id);

  if (movieReviews.id == id) {
      req.body.created_at = new Date();
      req.body.updated_at = new Date();
      req.body.id = uniqid();
      movieReviews.results.push(req.body); //push the new review onto the list
      res.status(201).json(req.body);
  } else {
      res.status(404).json({
          message: 'The resource you requested could not be found.',
          status_code: 404
      });
  }
});

// Get movie reviews
router.get('/:id/reviews', (req, res) => {
  const id = parseInt(req.params.id);
  // find reviews in list
  if (movieReviews.id == id) {
      res.status(200).json(movieReviews);
  } else {
      res.status(404).json({
          message: 'The resource you requested could not be found.',
          status_code: 404
      });
  }
});
*/
export default router;