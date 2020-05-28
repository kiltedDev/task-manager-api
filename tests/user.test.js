const request = require( 'supertest' );
const app = require( '../src/app' );
const User = require( '../src/models/user.model' );
const { userOne, userOneId, setupDatabase } = require( './fixtures/db' );

beforeEach( setupDatabase );

test( 'Should sign up a new user', async () => {
  const response = await request( app )
    .post( '/users' )
    .send({
      name: 'Butterworth',
      email: 'col.butterworth@uk.mil',
      password: 'whiskey',
    })
    .expect( 201 );

  const user = await User.findById( response.body.user._id );
  expect( user ).not.toBeNull();
  expect( response.body ).toMatchObject({
    user: {
      name: 'Butterworth',
      email: 'col.butterworth@uk.mil',
    },
    token: user.tokens[0].token,
  });
});

test( 'should log in existing user', async () => {
  const { email, password } = userOne;
  const response = await request( app )
    .post( '/users/login' )
    .send({
      email,
      password,
    })
    .expect( 200 );
  const user = await User.findById( userOneId );
  expect( response.body.token ).toBe( user.tokens[1].token );
});

test( 'should not log in nonexistant user', async () => {
  await request( app )
    .post( '/users/login' )
    .send({
      email: 'bill@bob.net',
      password: 'Archimedes!',
    })
    .expect( 400 );
});

test( 'should get profile for user', async () => {
  await request( app )
    .get( '/users/me' )
    .set( 'Authorization', `Bearer ${ userOne.tokens[0].token }` )
    .send()
    .expect( 200 );
});

test( 'should not get profile for unauthorized user', async () => {
  await request( app )
    .get( '/users/me' )
    .send()
    .expect( 401 );
});

test( 'should delete account for user', async () => {
  await request( app )
    .delete( '/users/me' )
    .set( 'Authorization', `Bearer ${ userOne.tokens[0].token }` )
    .send()
    .expect( 200 );

  const user = await User.findById( userOneId );
  expect( user ).toBeNull();
});

test( 'should not delete account for unauthorized user', async () => {
  await request( app )
    .delete( '/users/me' )
    .send()
    .expect( 401 );
});

test( 'should update valid user fields', async () => {
  await request( app )
    .patch( '/users/me' )
    .set( 'Authorization', `Bearer ${ userOne.tokens[0].token }` )
    .send({
      name: 'Riker',
    })
    .expect( 200 );

  const user = await User.findById( userOneId );
  expect( user.name ).toBe( 'Riker' );
});

test( 'should not update with unauthorized user', async () => {
  await request( app )
    .patch( '/users/me' )
    .send({
      name: 'Riker',
    })
    .expect( 401 );

  const user = await User.findById( userOneId );
  expect( user.name ).toBe( 'Bob Johansson' );
});

test( 'should not update invalid fields', async () => {
  await request( app )
    .patch( '/users/me' )
    .set( 'Authorization', `Bearer ${ userOne.tokens[0].token }` )
    .send({
      food: 'Donuts',
    })
    .expect( 400 );
});

test( 'should upload avatar image', async () => {
  await request( app )
    .post( '/users/me/avatar' )
    .set( 'Authorization', `Bearer ${ userOne.tokens[0].token }` )
    .attach( 'avatar', 'tests/fixtures/profile-pic.jpg' )
    .expect( 200 );

  const user = await User.findById( userOneId );
  expect( user.avatar ).toEqual( expect.any( Buffer ));
});
