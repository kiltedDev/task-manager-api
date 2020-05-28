const request = require( 'supertest' );
const app = require( '../src/app' );
const Task = require( '../src/models/task.model' );
const {
  userOne,
  userTwo,
  taskOne,
  taskTwo,
  taskThree,
  setupDatabase,
} = require( './fixtures/db' );

beforeEach( setupDatabase );

test( 'Should create task for user', async () => {
  const response = await request( app )
    .post( '/tasks' )
    .set( 'Authorization', `Bearer ${ userOne.tokens[0].token }` )
    .send({
      description: 'explore space',
    })
    .expect( 201 );

  const task = await Task.findById( response.body._id );
  expect( task ).not.toBeNull();
  expect( task.completed ).toBe( false );
});

test( 'fetch user\'s tasks', async () => {
  const response = await request( app )
    .get( '/tasks' )
    .set( 'Authorization', `Bearer ${ userOne.tokens[0].token }` )
    .send()
    .expect( 200 );

  expect( response.body ).toHaveLength( 2 );
});

test( 'authorized user can delete task', async () => {
  const response = await request( app )
    .delete( `/tasks/${ taskTwo._id }` )
    .set( 'Authorization', `Bearer ${ userOne.tokens[0].token }` )
    .send()
    .expect( 200 );

  const task = await Task.findById( taskTwo._id );
  expect( task ).toBeNull();
});

test( 'unauthorized user cannot delete task', async () => {
  const task = await Task.findById( taskTwo._id );
  const response = await request( app )
    .delete( `/tasks/${ taskTwo._id }` )
    .set( 'Authorization', `Bearer ${ userTwo.tokens[0].token }` )
    .send()
    .expect( 404 );

  expect( task ).not.toBeNull();
});
