import express from 'express';
import asyncHandler from 'express-async-handler';
import { getPeopleMovieCredits, getPerson, getPersonImages, getPopularPeople, getTrendingPeople } from '../tmdb/tmdb-api';


const router = express.Router(); 

// Get popular actors from tmdb
router.get('/tmdb/popular', asyncHandler( async(req, res) => {
    const actors = await getPopularPeople();
    res.status(200).json(actors);
  }));

// Get trending actors from tmdb
router.get('/tmdb/trending', asyncHandler( async(req, res) => {
  const actors = await getTrendingPeople();
  res.status(200).json(actors);
}));

// Get actor from tmdb
router.get('/tmdb/actor/:id', asyncHandler( async(req, res,) => {
  const actor = await getPerson(req.params.id);
  res.status(200).json(actor);
}));

// Get actor movie credits from tmdb
router.get('/tmdb/actor/:id/movie-credits', asyncHandler( async(req, res,) => {
  const movies = await getPeopleMovieCredits(req.params.id);
  res.status(200).json(movies);
}));

// Get actor images from tmdb
router.get('/tmdb/actor/:id/images', asyncHandler( async(req, res,) => {
  const images = await getPersonImages(req.params.id);
  res.status(200).json(images);
}));


export default router;