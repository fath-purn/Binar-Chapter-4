const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {register, login, authenticate, getAllUsers, getUserById} = require('../../handlers/v1/users');
const {createAccount, getAllAccount, getAccountById} = require('../../handlers/v1/accounts');
const {
    createTransactions,
    getAllTransactions,
    getTransactionsById,
  } = require("../../handlers/v1/transactions");
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

describe('POST /v1/auth/authenticate', () => {
    test('test authenticate -> sukses', async () => {
        try {
            let email = "abc@mail.com";

            let result = await authenticate(email);

            expect(result).toEqual({
                status: true,
                message: expect.any(String),
                data: expect.anything()
            });
        } catch (err) {
            expect(err).toBeInstanceOf(TypeError);
        }
    });

    test('test authenticate -> error', async () => {
        try {
            let email = "abc@mail.com";

            let result = await authenticate(email);

            expect(result).toBeNull();
        } catch (err) {
            expect(err).toBeInstanceOf(TypeError);
        }
    });
});


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



// accounts
describe('POST /v1/accounts', () => {
    test('test create account -> sukses', async () => {
        try {
            let user_id = user.id;
            let bank_name = "BCA";
            let bank_account_number = "123456789";
            let balance = 100000;

            let result = await createAccount(user_id, bank_name, bank_account_number, balance);

            expect(result).toEqual({
                status: true,
                message: 'Success Create Account',
                data: {
                    id: expect.any(Number),
                    user_id: user_id,
                    bank_name: bank_name,
                    bank_account_number: bank_account_number,
                    balance: balance
                }
            });
        } catch (err) {
            expect(err).toBeInstanceOf(TypeError);
        }
    });

    test('test create account -> error', async () => {
        try {
            let user_id = user.id;
            let bank_name = "BCA";
            let bank_account_number = "123456789";
            let balance = 100000;

            let result = await createAccount(user_id, bank_name, bank_account_number, balance);

            expect(result).toBeNull();
        } catch (err) {
            expect(err).toBeInstanceOf(TypeError);
        }
    });
});

describe('GET /v1/accounts', () => {
    test('test get all account -> sukses', async () => {
        try {
            let result = await getAllAccount();

            expect(result).toEqual({
                status: true,
                message: 'Success',
                data: {
                    pagination: expect.any(Object),
                    dataAccounts: expect.any(Array)
                }
            });
        } catch (err) {
            expect(err).toBeInstanceOf(TypeError);
        }
    });

    test('test get all account -> error', async () => {
        try {
            let result = await getAllAccount();

            expect(result).toBeNull();
        } catch (err) {
            expect(err).toBeInstanceOf(TypeError);
        }
    });
});

describe('GET /v1/accounts/:id', () => {
    test('test get account by id -> sukses', async () => {
        try {
            let id = 1;

            let result = await getAccountById(id);

            expect(result).toEqual({
                status: true,
                message: 'Success',
                data: {
                    id: expect.any(Number),
                    user_id: expect.any(Number),
                    bank_name: expect.any(String),
                    bank_account_number: expect.any(String),
                    balance: expect.any(Number),
                    user: expect.any(Object)
                }
            });
        } catch (err) {
            expect(err).toBeInstanceOf(TypeError);
        }
    });

    test('test get account by id -> error', async () => {
        try {
            let id = 999999;

            let result = await getAccountById(id);

            expect(result).toBeNull();
        } catch (err) {
            expect(err).toBeInstanceOf(TypeError);
        }
    });
});



// transactions
describe('POST /v1/transactions', () => {
    test('test create transactions -> sukses', async () => {
        try {
            let source_account_id = 1;
            let destination_account_id = 2;
            let amount = 10000;

            let result = await createTransactions(source_account_id, destination_account_id, amount);

            expect(result).toEqual({
                status: true,
                message: 'Success',
                data: {
                    transaction: expect.any(Object),
                    source_account: expect.any(Object),
                    destination_account: expect.any(Object)
                }
            });
        } catch (err) {
            expect(err).toBeInstanceOf(TypeError);
        }
    });

    test('test create transactions -> error', async () => {
        try {
            let source_account_id = 1;
            let destination_account_id = 2;
            let amount = 10000;

            let result = await createTransactions(source_account_id, destination_account_id, amount);

            expect(result).toBeNull();
        } catch (err) {
            expect(err).toBeInstanceOf(TypeError);
        }
    });
});

describe('GET /v1/transactions', () => {
    test('test get all transactions -> sukses', async () => {
        try {
            let result = await getAllTransactions();

            expect(result).toEqual({
                status: true,
                message: 'Success',
                data: {
                    pagination: expect.any(Object),
                    dataTransaction: expect.any(Array)
                }
            });
        } catch (err) {
            expect(err).toBeInstanceOf(TypeError);
        }
    });

    test('test get all transactions -> error', async () => {
        try {
            let result = await getAllTransactions();

            expect(result).toBeNull();
        } catch (err) {
            expect(err).toBeInstanceOf(TypeError);
        }
    });
});

describe('GET /v1/transactions/:id', () => {
    test('test get transactions by id -> sukses', async () => {
        try {
            let id = 1;

            let result = await getTransactionsById(id);

            expect(result).toEqual({
                status: true,
                message: 'Success',
                data: {
                    id: expect.any(Number),
                    source_account_id: expect.any(Number),
                    destination_account_id: expect.any(Number),
                    amount: expect.any(Number),
                    source_account: expect.any(Object),
                    destination_account: expect.any(Object)
                }
            });
        } catch (err) {
            expect(err).toBeInstanceOf(TypeError);
        }
    });

    test('test get transactions by id -> error', async () => {
        try {
            let id = 999999;

            let result = await getTransactionsById(id);

            expect(result).toBeNull();
        } catch (err) {
            expect(err).toBeInstanceOf(TypeError);
        }
    });
});