const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(express.static('dist'));

// middleware for parsing json requests
app.use(express.json());
app.use(cors());

morgan.token('body', (req) => JSON.stringify(req.body));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', (req, res) => {
  res.json(phonebookEntries);
});

app.get('/info', (req, res) => {
  const info = `
    <div>
      <p>Phonebook has info for ${phonebookEntries.length} people</p>
      <p>${new Date()}</p>
    </div>  
`;
  res.send(info);
});

// -------- NOTE -------------

// Middleware is a function that accepts three parameters

const requestLogger = (req, res, next) => {
  console.log('Method: ', req.method);
  console.log('Path: ', req.path);
  console.log('Body: ', req.body);
  console.log('---');
  next();
};

// execute middleare for every requests
app.use(requestLogger);

// route used for unknown routes(endpoints)
const unknownEndpoint = (req, res, next) => {
  res.status(400).send({ error: 'unknown endpoint' });
};

// app.use(unknownEndpoint);

const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('password argument is required!');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://Benjamin:${password}@cluster0.ct2wgbz.mongodb.net/contactsApp?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const Schema = mongoose.Schema;

const contactSchema = new Schema({
  name: String,
  number: String,
});

const Contact = mongoose.model('Contact', contactSchema);

// get all phonebook entries
app.get('/api/persons', (req, res) => {});

// get single phonebook entry
app.get('/api/persons/:id', (req, res) => {
  Contact.find({}).then((contacts) => {
    res.status(201).json(contacts);
  });
});

// delete single phonebook entry
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);

  if (!id) {
    res.status(404).send('contact not found');
    return;
  }

  phonebookEntries = phonebookEntries.filter((entry) => entry.id !== id);

  res.status(204).end();
});

// generate random id for contact
const generateId = () => {
  let id = '';
  for (let i = 0; i < 10; i++) {
    id += Math.floor(Math.random() * 10);
  }
  return Number(id);
};

const checkMissingDetails = (name, number) => {
  if (!name.trim() || !number.trim()) {
    return { err: 'Please fill in the missing details' };
  }
};

const checkExistingContact = (name) => {
  const isExistingContact = phonebookEntries.find((entry) => {
    return entry.name === name;
  });
  if (isExistingContact) {
    return { err: `name must be unique, ${name} already exists` };
  }
};

// create new contact
app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;

  const newContact = { name, number, id: generateId() };

  let isExisting = checkExistingContact(name);
  let isMissingDetails = checkMissingDetails(name, number);

  if (isExisting) {
    return res.status(400).json(isExisting);
  }

  if (isMissingDetails) {
    return res.status(400).json(isMissingDetails);
  }

  // reach this point if there are no errors
  phonebookEntries = phonebookEntries.concat(newContact);
  return res.status(201).json({ msg: 'new contact added', newContact });
});

// const editContact
app.put('/api/persons/:id', (req, res) => {
  const contactId = Number(req.params.id);

  const { name, number } = req.body;

  const contact = phonebookEntries.find((contact) => contact.id === contactId);

  if (!contact) {
    return res.status(404).json({ err: 'contact not found!' });
  }

  phonebookEntries = phonebookEntries.map((entry) =>
    entry.name === name ? { ...entry, number } : entry
  );

  res.status(200).json(phonebookEntries);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
