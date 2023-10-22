const app = require('../../app');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;

describe('POST /api/v1/users/register', () => {            
    test('test register -> sukses', async () => {
        try {
            let name = "test";
            let email = "abc@mail.com";
            let password = "asd@fsdf123";
            let password_confirmation = "asd@fsdf123";

            let { statusCode, body } = await request(app).post('/api/v1/auth/register').send({ name, email, password, password_confirmation });

            expect(statusCode).toBe(201);
            expect(body).toEqual({
                status: expect.any(Boolean),
                message: expect.any(String),
                data: {
                    id: expect.any(Number),
                    name: name,
                    email: email,
                    password: expect.any(String)
                }
            });
        } catch (err) {
            expect(err).toBe('error');
        }
    });

    test('test register -> error', async () => {
        try {
            let name = "test";
            let email = "abc@mail.com";
            let password = "asd@fsdf123";
            let password_confirmation = "asd@fsdf123";

            let { statusCode, body } = await request(app).post('/api/v1/auth/register').send({ name, email, password, password_confirmation });

            expect(statusCode).toBe(400);
            expect(body).toHaveProperty('status');
            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('data');
        } catch (err) {
            expect(err).toBe('Register gagal');
        }
    });
});

describe('POST /api/v1/auth/login', () => {
    test('test login -> sukses', async () => {
        try {
            let email = "abc@mail.com";
            let password = "asd@fsdf123";

            let { statusCode, body } = await request(app).post('/api/v1/auth/login').send({ email, password });
            user = body.data;

            expect(statusCode).toBe(201);
            expect(body).toEqual({
                status: true,
                message: 'OK',
                err: null,
                data: {
                    user: {
                        id: expect.any(Number),
                        name: expect.any(String),
                        email: email,
                        password: expect.any(String)
                    },
                    token: expect.any(String)
                }
            });
        } catch (err) {
            expect(err).toBe('Login gagal');
        }
    });
    

    test('test login -> error', async () => {
        try {
            let email = "abc@mail.com";
            let password = "asdas@fsdf123";

            let { statusCode, body } = await request(app).post('/api/v1/auth/login').send({ email, password });

            expect(statusCode).toBe(400);
            expect(body).toHaveProperty('status');
            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('data');
        } catch (err) {
            expect(err).toBe('Login gagal');
        }
    });
});

describe('Middleware restrict', () => {
    it('should return 401 Unauthorized jika tidak ada token', async () => {
      const response = await request(app).get('/api/v1/auth/authenticate');
  
      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        status: false,
        message: 'Unauthorized',
        err: 'missing token on header!',
        data: null,
      });
    });
  
    it('should return 401 Unauthorized jika token tidak valid', async () => {
      const response = await request(app)
        .get('/api/v1/auth/authenticate')
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjY4NjE5MTY1fQ.e0394e34610e569298458f320644e94c');
  
      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        status: false,
        message: 'Unauthorized',
        err: 'invalid signature',
        data: null,
      });
    });
  
    it('should return 200 OK jika token valid', async () => {
      const token = jwt.sign({ id: 1 }, JWT_SECRET_KEY);
      const response = await request(app)
        .get('/api/v1/auth/authenticate')
        .set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(200);
    });
});

describe('GET /api/v1/users', () => {
    test('tampil semua user -> sukses', async () => {
        try {
            let { statusCode, body } = await request(app).get('/api/v1/users');

            expect(statusCode).toBe(200);
            expect(body).toHaveProperty('status');
            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('data');
        } catch (err) {
            expect(err).toBe('Tampil semua user gagal');
        }
    });
});


describe('GET /api/v1/users/:id', () => {
    test('tampil user berdasarkan id -> sukses', async () => {
        try {
            const response = await request(app).get('/api/v1/users');
            const id = response.body.data.dataUsers[0].id;
            const { statusCode, body } = await request(app).get(`/api/v1/users/${id}`);
            expect(statusCode).toBe(200);
            expect(body).toEqual({
                status: true,
                message: expect.any(String),
                data: expect.anything()
            });
        } catch (err) {
            expect(err.message).toBe('Tampil user berdasarkan id gagal');
        }
    });
    

    test('tampil user berdasarkan id -> error', async () => {
        try {
            let { statusCode, body } = await request(app).get('/api/v1/users/121331');

            expect(statusCode).toBe(400);
            expect(body).toHaveProperty('status');
            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('data');
        } catch (err) {
            expect(err.message).toBe('Tampil user berdasarkan id gagal');
            expect(err.statusCode).toBe(400);
        }
    });
});





// account
describe('POST /api/v1/account', () => {
    test('should create account', async () => {
        try {
            const response = await request(app).get('/api/v1/users');
        
            const user_id = response.body.data.dataUsers[0].id;
            let bank_name = "BNI";
            let bank_account_number = "1234567890";
            let balance = 100000;

            const {statusCode, body} = await request(app)
                .post('/api/v1/account')
                .send({
                    user_id: user_id,
                    bank_name: bank_name,
                    bank_account_number: bank_account_number,
                    balance: balance
                });

            expect(statusCode).toEqual(201);
            expect(body).toEqual({
                status: true,
                message: expect.any(String),
                data: expect.anything()
            });
        } catch (err) {
            expect(err.message).toBe('Tampil user berdasarkan id gagal');
        }
    });

    test('should create account', async () => {
        try {
            const response = await request(app).get('/api/v1/users');
        
            const user_id = response.body.data.dataUsers[0].id;
            let bank_name = "BRI";
            let bank_account_number = "2312313";
            let balance = 100000;

            const {statusCode, body} = await request(app)
                .post('/api/v1/account')
                .send({
                    user_id: user_id,
                    bank_name: bank_name,
                    bank_account_number: bank_account_number,
                    balance: balance
                });

            expect(statusCode).toEqual(201);
            expect(body).toEqual({
                status: true,
                message: expect.any(String),
                data: expect.anything()
            });
        } catch (err) {
            expect(err.message).toBe('Tampil user berdasarkan id gagal');
        }
    });

    test('user id tidak ditemukan -> error', async () => {
        try {
            const user_id = 1231313
            let bank_name = "BNI";
            let bank_account_number = "1234567890";
            let balance = 100000;

            const {statusCode, body} = await request(app)
                .post('/api/v1/account')
                .send({
                    user_id: user_id,
                    bank_name: bank_name,
                    bank_account_number: bank_account_number,
                    balance: balance
                });

            expect(statusCode).toBe(400);
            expect(body).toHaveProperty('status');
            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('data');
        } catch (err) {
            expect(err.message).toBe('Tampil user berdasarkan id gagal');
        }
    });
});


describe('GET /api/v1/account', () => {
    test('tampil semua account -> sukses', async () => {
        try {
            let { statusCode, body } = await request(app).get('/api/v1/accounts');

            expect(statusCode).toBe(200);
            expect(body).toEqual({
                status: true,
                message: expect.any(String),
                data: expect.anything()
            });
        } catch (err) {
            expect(err).toBe('Tampil semua account gagal');
        }
    });
});

describe('GET /api/v1/account/:id', () => {
    test('tampil account berdasarkan id -> sukses', async () => {
        try {
            const response = await request(app).get('/api/v1/accounts');
            if (!response.body.data || !response.body.data.dataAccounts || response.body.data.dataAccounts.length === 0) {
                throw new Error('Tampil account berdasarkan id gagal');
            }
            const id = response.body.data.dataAccounts[0].id;
            const { statusCode, body } = await request(app).get(`/api/v1/accounts/${id}`);
            
            expect(statusCode).toBe(200);
            expect(body).toEqual({
                status: true,
                message: expect.any(String),
                data: expect.anything()
            });
        } catch (err) {
            expect(err.message).toBe('Tampil account berdasarkan id gagal');
        }
    });
    

    test('tampil account berdasarkan id -> error', async () => {
        try {
            let { statusCode, body } = await request(app).get('/api/v1/accounts/121331');

            expect(statusCode).toBe(400);
            expect(body).toHaveProperty('status');
            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('data');
        } catch (err) {
            expect(err.message).toBe('Tampil account berdasarkan id gagal');
            expect(err.statusCode).toBe(400);
        }
    });
});




// transactions
describe('POST /api/v1/transaction', () => {
    test('should create transaction', async () => {
        try {
            const response = await request(app).get('/api/v1/accounts');
            const dataAccounts = response.body.data.dataAccounts;
            if (!dataAccounts || dataAccounts.length < 2) {
                throw new Error('Not enough accounts to create transaction');
            }
            const source_account_id = dataAccounts[0].id;
            const destination_account_id = dataAccounts[1].id;
            let amount = 10000;

            const {statusCode, body} = await request(app)
                .post('/api/v1/transaction')
                .send({
                    source_account_id: source_account_id,
                    destination_account_id: destination_account_id,
                    amount: amount
                });

            expect(statusCode).toEqual(201);
            expect(body).toEqual({
                status: true,
                message: expect.any(String),
                data: expect.anything()
            });
        } catch (err) {
            expect(err.message).toBe('Not enough accounts to create transaction');
        }
    });

    test('user id tidak ditemukan -> error', async () => {
        try {
            const source_account_id = 1231313
            const destination_account_id = 1231313
            let amount = 10000;

            const {statusCode, body} = await request(app)
                .post('/api/v1/transaction')
                .send({
                    source_account_id: source_account_id,
                    destination_account_id: destination_account_id,
                    amount: amount
                });

            expect(statusCode).toBe(400);
            expect(body).toHaveProperty('status');
            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('data');
        } catch (err) {
            expect(err.message).toBe('Tampil user berdasarkan id gagal');
        }
    });
});

describe('GET /api/v1/transaction', () => {
    test('tampil semua transaction -> sukses', async () => {
        try {
            let { statusCode, body } = await request(app).get('/api/v1/transactions');

            expect(statusCode).toBe(200);
            expect(body).toEqual({
                status: true,
                message: expect.any(String),
                data: expect.anything()
            });
        } catch (err) {
            expect(err).toBe('Tampil semua transaction gagal');
        }
    });
});

describe('GET /api/v1/transaction/:id', () => {
    test('tampil transaction berdasarkan id -> sukses', async () => {
        try {
            const response = await request(app).get('/api/v1/transactions');
            if (!response.body.data || !response.body.data.dataTransactions || response.body.data.dataTransactions.length === 0) {
                throw new Error('Tampil transaction berdasarkan id gagal');
            }
            const id = response.body.data.dataTransactions[0].id;
            const { statusCode, body } = await request(app).get(`/api/v1/transactions/${id}`);
            
            expect(statusCode).toBe(200);
            expect(body).toEqual({
                status: true,
                message: expect.any(String),
                data: expect.anything()
            });
        } catch (err) {
            expect(err.message).toBe('Tampil transaction berdasarkan id gagal');
        }
    });

    test('tampil transaction berdasarkan id -> error', async () => {
        try {
            let { statusCode, body } = await request(app).get('/api/v1/transactions/121331');

            expect(statusCode).toBe(400);
            expect(body).toHaveProperty('status');
            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('data');
        } catch (err) {
            expect(err.message).toBe('Tampil transaction berdasarkan id gagal');
        }
    });
});