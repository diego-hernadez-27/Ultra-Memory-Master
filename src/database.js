const mongoose = require('mongoose')

const { MEMORY_APP_MONGODB_HOST ,MEMORY_APP_MONGODB_DATABASE } = process.env;
const MONGODB_URI = `mongodb+srv://${MEMORY_APP_MONGODB_HOST}/${MEMORY_APP_MONGODB_DATABASE}`;

mongoose.connect(MONGODB_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})
  .then(db => console.log('Database is connected'))
  .catch(err => console.log(err));