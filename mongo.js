const mongoose = require('mongoose');

// check if command-line arguments are provided
if (process.argv.length < 3) {
  console.log('Usage: node mongo.js <name> <number>');
  process.exit(1);
}

// const [, , password, name, number] = process.argv;
const password = process.argv[2];

// const url = `mongodb+srv://Benjamin:${password}@cluster0.ct2wgbz.mongodb.net/noteApp?retryWrites=true&w=majority`;
const url = `mongodb+srv://Benjamin:${password}@cluster0.ct2wgbz.mongodb.net/contactsApp?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

// const noteSchema = new mongoose.Schema({
//   content: String,
//   important: Boolean,
// });

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
});

// const Note = mongoose.model('Note', noteSchema);
const Contact = mongoose.model('Contact', contactSchema);

// const contact = new Contact({
//   name,
//   number,
// });

// contact.save().then((data) => {
//   console.log('contact added to database');
//   const { name, number } = data;
//   console.log(`added ${name} number ${number} to phonebook`);
//   mongoose.connection.close();
// });

Contact.find({}).then((persons) => {
  // console.log(persons);
  console.log('phonebook:');
  persons.forEach((person) => {
    console.log(`${person.name} ${person.number}`);
  });
  mongoose.connection.close();
}); 

// const note = new Note({
//   content: 'Coding is Easy',
//   important: false,
// });

// note.save().then(result => {
//   console.log('note saved');
//   console.log(result)
//   mongoose.connection.close();
// }).catch((err) => {
//   console.log(err)
// })

// Note.find({ important: false, content: 'Coding is Easy' }).then((result) => {
//   result.forEach((note) => {
//     console.log(note);
//   });
//   mongoose.connection.close();
// });
