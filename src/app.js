const express = require( 'express' );
require( './db/mongoose' );
const taskRouter = require( './routers/task.router' );
const userRouter = require( './routers/user.router' );

const app = express();

app.use( express.json());
app.use( taskRouter );
app.use( userRouter );

module.exports = app;
