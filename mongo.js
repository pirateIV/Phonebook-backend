require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const requestLogger = require('./middleware/requestLogger');

const app = express();

// middleware for parsing json requests
app.use(express.static('dist'));
app.use(express.json());
app.use(requestLogger);
app.use(cors());

morgan.token('body', (req) => JSON.stringify(req.body));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

const Person = require('./models/persons');

app.get('/info', async (req, res) => {
  const count = await Person.countDocuments();
  const info = `
    <div>
      <p>Phonebook has info for ${count} people</p>
      <p>${new Date()}</p>
    </div>  
  `;
  res.send(info);
});

app.get('/api/persons', (req, res) => {
  Person.find({}).then((persons) => {
    console.log('phonebook: ');
    persons.forEach(({ name, number }) => {
      console.log(`${name} ${number}`);
    });

    res.json(persons);
  });
});

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((contact) => {
      if (contact) {
        res.json(contact);
      } else {
        res.status(400).end();
      }
    })
    .catch((error) => next(error));
});

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body;

  if (!name && !number) {
    return res.status(400).send({ error: 'content is missing' });
  }

  const person = new Person({
    name,
    number,
  });
  person
    .save()
    .then((newContact) => {
      res.json(newContact);
    })
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((err, docs) => {
      if (err) {
        console.log(err);
        res.status(204).end();
      } else {
        console.log(`deleted ${docs}`);
      }
    })
    .catch((error) => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body;

  const contact = { name, number };

  Person.findByIdAndUpdate(req.params.id, contact, {
    new: true,
    // to run validation when updating
    runValidators: true,
    context: 'query',
  })
    .then((contact) => {
      if (contact) {
        res.json(contact);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

const errorHandler = (err, req, res, next) => {
  console.log(err.name);
  console.log(err.message);

  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  next(err);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
