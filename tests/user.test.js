const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOneId, userOne, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Sign up new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Baatman',
        email: 'batman@example.com',
        password: 'avalidword13'
    }).expect(201)

    // Assert new user was created
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assert response is correct
    expect((response.body)).toMatchObject({
        user: {
            name: 'Baatman',
            email: 'batman@example.com'
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('avalidword13')
})

test('Log in existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Log in nonexistent user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: '11111111'
    }).expect(400)
})

test('Get user profile', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('User profile unauthenticated', async () => {
    await request(app)
        .get('/user/me')
        .send()
        .expect(404)
})

test('Delete account user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Delete account no auth', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Update user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'John'
        })
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).toEqual('John')
})

test('Update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Someplace'
        })
        .expect(400)
})

// User Test Ideas
//
// Should not signup user with invalid name/email/password
// Should not update user if unauthenticated
// Should not update user with invalid name/email/password
// Should not delete user if unauthenticated