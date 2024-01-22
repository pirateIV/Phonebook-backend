const express = require('express');
const app = express();

const mongoose = require('mongoose');

const password = process.argv[2];
// const [, , password, content, important] = process.argv[2];

const url = `mongodb+srv://Benjamin:${password}@cluster0.ct2wgbz.mongodb.net/noteApp?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message });
  }

  next(error);
};

const noteSchema = mongoose.Schema({
  content: { type: String, minLength: 5, required: true },
  important: Boolean,
});

const Note = mongoose.model('Note', noteSchema);

// const note = new Note({ content, important });

app.use(express.json());

app.get('/', (request, response) => {
  response.end(`<h1>Hello World !</h1>`);
});

app.get('/api/notes', (request, response) => {
  Note.find({}).then((notes) => {
    console.log(notes);
    response.json(notes);
  });
  mongoose.connection.close();
});

// fetching a single resource
// app.get('/api/notes/:id', (request, response) => {
//   const id = Number(request.params.id);
//   const note = notes.find((note) => note.id === id);

//   note ? response.json(note) : response.status(404).end();
// });

// // delete a resource
// app.delete('/api/notes/:id', (request, response) => {
//   const id = Number(request.params.id);
//   notes = notes.filter((note) => note.id !== id);
//   response.status(204).end();
// });

// app.post('/api/notes', (request, response) => {
//   const note = request.body;
//   const maxId = notes.length > 0 ? Math.max(...notes.map(note => note.id)) : 0;
//   note.id = maxId + 1;

//   notes = notes.concat(note)
//   response.json(note);
// });

// const generateId = () => {
//   const maxId = notes.length > 0 ? Math.max(...notes.map((note) => note.id)) : 0;
//   return maxId + 1;
// };

// app.post('/api/notes', (request, response) => {
//   const body = request.body;

//   if (!body.content) {
//     return response.status(400).json({
//       error: 'content missing',
//     });
//   }

//   const noteObject = {
//     content: body.content,
//     id: generateId(),
//     important: body.important || false,
//   };
//   notes.concat(noteObject);
//   response.json(noteObject);
// });

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
