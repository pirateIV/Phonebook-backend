require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

// middleware for parsing json requests
app.use(express.json());
app.use(cors());

morgan.token('body', (req) => JSON.stringify(req.body));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

const Person = require('./models/persons');

const mongoose = require('mongoose');

// if (process.argv.length < 3) {
//   console.log('password argument is required!');
//   process.exit(1);
// }

// const password = process.argv[2];

const errorHandler = (res, req, next) => {
  
}

app.get('/api/persons', (req, res) => {
  Person.find({}).then((persons) => {
    console.log('phonebook: ');
    persons.forEach(({ name, number }) => {
      console.log(`${name} ${number}`);
    });

    res.json(persons);
    // mongoose.connection.close();
  });
});

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id)
    .then((contact) => {
      if (contact) {
        res.json(contact);
      } else {
        res.status(400).end();
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).end();
    });
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
    .catch((error) => {
      next(error);
    });
});

app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndDelete(req.params.id).then((err, docs) => {
    if (err) {
      console.log(err);
      res.status(204).end();
    } else {
      console.log(`deleted ${docs}`);
    }
  });
});

app.put('/api/persons/:id', (req, res) => {
  const { name, number } = req.body;

  Person.findByIdAndUpdate(req.params.id, { name, number }, { new: true }).then(
    (contact) => {
      res.json(contact);
    }
  );
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
