const express = require('express');
const app = express();

app.use(express.json());

let notes = [
  {
    id: 1,
    content: 'HTML is easy',
    important: true,
  },
  {
    id: 2,
    content: 'Browser can execute only JavaScript',
    important: false,
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    important: true,
  },
];

app.get('/', (request, response) => {
  response.end(`<h1>Hello World !</h1>`);
});

app.get('/api/notes', (request, response) => {
  response.json(JSON.stringify(notes));
});

// fetching a single resource
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find(note => note.id === id);

  note ? response.json(note) : response.status(404).end();
});

// delete a resource
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter(note => note.id !== id);
  response.status(204).end();
});

// app.post('/api/notes', (request, response) => {
//   const note = request.body;
//   const maxId = notes.length > 0 ? Math.max(...notes.map(note => note.id)) : 0;
//   note.id = maxId + 1;

//   notes = notes.concat(note)
//   response.json(note);
// });

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map(note => note.id)) : 0;
  return maxId + 1;
};

app.post('/api/notes', (request, response) => {
  const body = request.body;

  if(!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const noteObject = {
    content: body.content,
    id: generateId(),
    important: body.important || false,
  };
  notes.concat(noteObject)
  response.json(noteObject)
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
