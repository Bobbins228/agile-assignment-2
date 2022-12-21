import express from 'express';
import { getGenres } from '../tmdb/tmdb-api';

const router = express.Router(); 

// Get all genres
router.get('/', async (req, res) => {
    const genres = await getGenres();
    res.status(200).json(genres);
});

export default router;