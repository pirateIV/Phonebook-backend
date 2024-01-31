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
  name: { minLength: 3, type: String, required: true },
  number: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        const regex = /^\d{2,3}-\d{6}$/;
        return regex.test(value);
      },
      message: (props) => `${props.value} is not a valid phone number`,
    },
  },
});

personsSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Person', personsSchema);
