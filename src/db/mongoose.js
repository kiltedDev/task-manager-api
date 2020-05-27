const mongoose = require( 'mongoose' );
const validator = require( 'validator' );

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

mongoose.connect( process.env.MONGODB_URL, mongooseOptions );
