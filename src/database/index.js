const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/noderest');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

module.exports = mongoose;
