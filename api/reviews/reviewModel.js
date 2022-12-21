import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  movieId: {type: Number, required: true },
  author: { type: String, required: true},
  content: {type: String, required: true },
  rating: {type: Number, required: true},
  created_at: {type: String, required: true },
  updated_at: {type: String, required: true}
});

ReviewSchema.statics.findByMovieId = function (movieId) {
  return this.findOne({ movieId: movieId });
};

  

export default mongoose.model('Review', ReviewSchema);