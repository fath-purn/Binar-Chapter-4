const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {createAccount, getAllAccount, getAccountById} = require('../../handlers/v1/accounts');

describe('POST /api/v1/account', () => {
    test('should create account', async () => { 
        try {
            let user_id = 1;
            let bank_name = "BNI";
            let bank_account_number = "1234567890";
            let balance = 100000;

            let result = createAccount(user_id, bank_name, bank_account_number, balance);

            expect(result).toHaveProperty('id');
            expect(result).toHaveProperty('user_id');
            expect(result).toHaveProperty('bank_name');
            expect(result).toHaveProperty('bank_account_number');
            expect(result).toHaveProperty('balance');
            expect(result.user_id).toBe(user_id);
            expect(result.bank_name).toBe(bank_name);
            expect(result.bank_account_number).toBe(bank_account_number);
            expect(result.balance).toBe(balance);
        } catch (err) {
            expect(err).toBeInstanceOf(TypeError);
        }
        
     })

    test('user id not found -> error', async () => {
        try {
            let user_id = 2;
            let bank_name = "BNI";
            let bank_account_number = "1234567890";
            let balance = 100000;

            let result = createAccount(user_id, bank_name, bank_account_number, balance);

            expect(result).toBeNull();
        } catch (err) {
            expect(err).toBeInstanceOf(TypeError);
        }
    });
});

describe('GET /api/v1/account', () => {
    test('should get all account', async () => {
        try {
            let result = getAllAccount();

            expect(result).toHaveProperty('pagination');
            expect(result).toHaveProperty('dataAccount');
        } catch (err) {
            expect(err).toBeInstanceOf(TypeError);
        }
    });

    test('test get all users -> error', async () => {
        try {
            let result = await getAllAccount();

            expect(result).toBeNull();
        } catch (err) {
            expect(err).toBeInstanceOf(TypeError);
        }
    });
});

describe('GET /api/v1/account/:id', () => {
    test('should get account by id', async () => {
        try {
            let id = 1;

            let result = await getAccountById(id);

            expect(result).toHaveProperty('id');
            expect(result).toHaveProperty('user_id');
            expect(result).toHaveProperty('bank_name');
            expect(result).toHaveProperty('bank_account_number');
            expect(result).toHaveProperty('balance');
            expect(result.id).toBe(id);
        } catch (err) {
            expect(err).toBeInstanceOf(TypeError);
        }
    });

    test('test get account by id -> error', async () => {
        try {
            let id = 2;

            let result = await getAccountById(id);

            expect(result).toBeNull();
        } catch (err) {
            expect(err).toBeInstanceOf(TypeError);
        }
    });
});