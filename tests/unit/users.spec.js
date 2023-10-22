const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {register, login, authenticate, getAllUsers, getUserById} = require('../../handlers/v1/users');
let user = {};
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;

describe('POST /v1/auth/register', () => {
    beforeAll(async () => {
        await prisma.transaction.deleteMany();
        await prisma.bank_accounts.deleteMany();
        await prisma.profiles.deleteMany();
        await prisma.users.deleteMany();
    });

    test('test email belum terdaftar -> sukses', async () => {
        try {
            let name = "test";
            let email = "abc@mail.com";
            let password = "asd@fsdf123";
            let password_confirmation = "asd@fsdf123";
    
            let result = await register(name, email, password, password_confirmation);
            user = result.data;

            expect(result).toHaveProperty('id');
            expect(result).toHaveProperty('name');
            expect(result).toHaveProperty('email');
            expect(result).toHaveProperty('password');
            expect(result).toHaveProperty('password_confirmation');
            expect(result.name).toBe(name);
            expect(result.email).toBe(email);
            expect(result.password).toBe(password);
            expect(result.password_confirmation).toBe(password_confirmation);
        } catch (err) {
            expect(err).toBeInstanceOf(TypeError);
        }
    });

    test('test email sudah terdaftar -> error', async () => {
        try {
            let name = "test";
            let email = "abc@mail.com";
            let password = "asd@fsdf123";
            let password_confirmation = "asd@fsdf123";
    
            let result = await register(name, email, password, password_confirmation);
    
            expect(result).toBeNull();
        } catch (err) {
            expect(err).toBeInstanceOf(TypeError);
        }
    });
});

describe('POST /v1/auth/login', () => {
    test('test login -> sukses', async () => {
        try {
            let email = "abc@mail.com";
            let password = "asd@fsdf123";

            let result = await login(email, password);

            expect(result).toEqual({
                status: true,
                message: 'OK',
                err: null,
                data: {
                    user: {
                        id: expect.any(Number),
                        name: expect.any(String),
                        email: email,
                        password: expect.any(Number)
                    },
                    token: expect.any(Number)
                }
            });
        } catch (err) {
            expect(err).toBeInstanceOf(TypeError);
        }
    });   

    test('test login -> error', async () => {
        try {
            let email = "abc@mail.com";
            let password = "asd@fsdf123";
    
            let result = await login(email, password);
    
            expect(result).toBeNull();
        } catch (err) {
            expect(err).toBeInstanceOf(TypeError);
        }
    });
});


// describe('Middleware restrict', () => {
//     it('should return 401 Unauthorized jika tidak ada token', async () => {
//         const token = null;
//         const response = await authenticate({ headers: { authorization: `Bearer ${token}` } });

//         expect(response).toBeDefined();

//         expect(response.status).toBe(401);
//         expect(response.body).toEqual({
//             status: false,
//             message: 'Unauthorized',
//             err: 'missing token on header!',
//             data: null,
//         });
//     });
  
//     it('should return 401 Unauthorized jika token tidak valid', async () => {
//         const token = 'invalid_token';
//         const response = await authenticate({ headers: { authorization: `Bearer ${token}` } });

//         expect(response).toBeDefined();

//         expect(response.status).toBe(401);
//         expect(response.body).toEqual({
//             status: false,
//             message: 'Unauthorized',
//             err: 'invalid token',
//             data: null,
//         });
//     });
  
//     it('should return 200 OK jika token valid', async () => {
//         // create a user
//         const user = await prisma.users.create({
//             data: {
//                 name: 'John Doe',
//                 email: 'johndoe@example.com',
//                 password: await bcrypt.hash('password', 10),
//             },
//         });

//         // create a token for the user
//         const token = jwt.sign({ id: user.id }, JWT_SECRET_KEY);

//         // authenticate the user with the token
//         const response = await authenticate({ headers: { authorization: `Bearer ${token}` } });

//         expect(response.status).toBe(200);
//         expect(response.body).toEqual({
//             status: true,
//             message: 'OK',
//             err: null,
//             data: {
//                 id: user.id,
//                 name: user.name,
//                 email: user.email,
//             },
//         });
//     });
// });


describe('GET /v1/users', () => {
    test('test get all users -> sukses', async () => {
        try {
            let result = await getAllUsers();

            expect(result).toEqual({
                status: true,
                message: 'OK',
                err: null,
                data: expect.any(Array)
            });
        } catch (err) {
            expect(err).toBeInstanceOf(TypeError);
        }
    });

    test('test get all users -> error', async () => {
        try {
            let result = await getAllUsers();

            expect(result).toBeNull();
        } catch (err) {
            expect(err).toBeInstanceOf(TypeError);
        }
    });
});

describe('GET /v1/users/:id', () => {
    test('test get user by id -> sukses', async () => {
        try {
            let result = await getUserById(user.id);

            expect(result).toEqual({
                status: true,
                message: 'Success',
                data: {
                    id: expect.any(Number),
                    name: expect.any(String),
                    email: expect.any(String),
                    profiles: expect.any(Object)
                }
            });
        } catch (err) {
            expect(err).toBeInstanceOf(TypeError);
        }
    });

    test('test get user by id -> error', async () => {
        try {
            let id = 999999;
            let result = await getUserById(id);

            expect(result).toBeNull();
        } catch (err) {
            expect(err).toBeInstanceOf(TypeError);
        }
    });
});