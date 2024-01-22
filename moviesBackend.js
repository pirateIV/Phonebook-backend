const express = require('express');
const app = express();

const cors = require('cors');

app.use(cors());

const mongoose = require('mongoose');

const port = 5000;

const password = 'admin01234xre';

const DB_URI = `mongodb+srv://Benjamin:${password}@cluster0.ct2wgbz.mongodb.net/sample_mflix?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(DB_URI);

const movieSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  title: { type: String, required: true },
  year: { type: Number, required: true },
  runtime: { type: Number, required: true },
  released: { type: Date, required: true },
  poster: { type: String, required: true },
  plot: { type: String, required: true },
  fullplot: { type: String, required: true },
  lastupdated: { type: Date, required: true },
  type: { type: String, required: true },
  directors: { type: [String], required: true },
  imdb: {
    rating: { type: Number, required: true },
    votes: { type: Number, required: true },
    id: { type: Number, required: true },
  },
  cast: { type: [String], required: true },
  countries: { type: [String], required: true },
  genres: { type: [String], required: true },
  tomatoes: {
    viewer: {
      rating: { type: Number, required: true },
      numReviews: { type: Number, required: true },
    },
    lastUpdated: { type: Date, required: true },
  },
  num_mflix_comments: { type: Number, required: true },
});

const Movies = mongoose.model('Movies', movieSchema);

app.get('/', (req, res) => {
  res.send('movies database');
});

app.get('/api/movies', (req, res) => {
  res.send('');
});

// app.use('/api/movies/:number', checkMaxExceeded);

// middleware to check max, number of movies to request for
function checkMaxExceeded(req, res, next) {
  let maxLength = 11;
  let requestedMoviesLength = parseInt(req.params.number);

  if (requestedMoviesLength > maxLength) {
    // next(new Error('The limit of movies to fetch is 10'));
    res.send('The limit is exceeded, you can only fetch 10 movies');
    return;
  }
  next();
}

// get the specified number of movies
app.get('/api/movies/:number', checkMaxExceeded, (req, res) => {
  const numberOfMoviestoFetch = parseInt(req.params.number);

  Movies.find({})
    .limit(numberOfMoviestoFetch)
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.log(err.stack);
    });
});

app.listen(port, () => console.log('Server is running at port ', port));
