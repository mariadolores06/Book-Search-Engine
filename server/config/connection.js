const mongoose = require('mongoose');

mongoose.connect(process.MONGODB_URI || 'mongodb://127.0.0.1:27017/book-search-engine', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

module.exports = mongoose.connection;
