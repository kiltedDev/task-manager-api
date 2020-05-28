const mongoose = require( 'mongoose' );
const jwt = require( 'jsonwebtoken' );
const User = require( '../../src/models/user.model' );
const Task = require( '../../src/models/task.model' );

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: 'Bob Johansson',
  email: 'bob@bob.net',
  password: 'Archimedes!',
  tokens: [{
    token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET ),
  }],
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: 'Bill Johansson',
  email: 'Bill@bob.net',
  password: 'Ragnaro|<',
  tokens: [{
    token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET ),
  }],
};

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: 'find life',
  completed: false,
  owner: userOneId,
};

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: 'violate prime directive',
  completed: false,
  owner: userOneId,
};

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: 'move ice',
  completed: false,
  owner: userTwoId,
};

const setupDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  await new User( userOne ).save();
  await new User( userTwo ).save();
  await new Task( taskOne ).save();
  await new Task( taskTwo ).save();
  await new Task( taskThree ).save();
};

module.exports = {
  userOne,
  userOneId,
  userTwo,
  taskOne,
  taskTwo,
  taskThree,
  setupDatabase,
};
