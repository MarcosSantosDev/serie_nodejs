const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/noderest', { useNewUrlParser: true });

module.exports = mongoose;
