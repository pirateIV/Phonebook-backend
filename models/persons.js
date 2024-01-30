const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGO_URI;

console.log('connecting to ', url);

mongoose
  .connect(url)
  .then((result) => {
    console.log('connected to the database...');
  })
  .catch((error) => {
    console.log('error conneting to the mongoDB: ', error);
  });

const personsSchema = new mongoose.Schema({
  name: String,
  number: { minLength: 8, type: String },
});

personsSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Person', personsSchema);
