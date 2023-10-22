const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {
  createTransactions,
  getAllTransactions,
  getTransactionsById,
} = require("../../handlers/v1/transactions");

describe("POST /api/v1/transaction", () => {
    beforeAll(async () => {
        await prisma.transaction.deleteMany();
        await prisma.bank_accounts.deleteMany();
        await prisma.profiles.deleteMany();
        await prisma.users.deleteMany();
    });

  test("should create transaction", async () => {
    try {
      let sender_id = 1;
      let receiver_id = 2;
      let amount = 10000;

      let result = createTransactions(sender_id, receiver_id, amount);

      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("sender_id");
      expect(result).toHaveProperty("receiver_id");
      expect(result).toHaveProperty("amount");
      expect(result.sender_id).toBe(sender_id);
      expect(result.receiver_id).toBe(receiver_id);
      expect(result.amount).toBe(amount);
    } catch (err) {
      expect(err).toBeInstanceOf(TypeError);
    }
  });

  test("user id not found -> error", async () => {
    try {
      let sender_id = 646465;
      let receiver_id = 333132;
      let amount = 10000;

      let result = createTransactions(sender_id, receiver_id, amount);

      expect(result).toBeNull();
    } catch (err) {
      expect(err).toBeInstanceOf(TypeError);
    }
  });
});

describe("GET /api/v1/transaction", () => {
  test("should get all transaction", async () => {
    try {
      let result = getAllTransactions();

      expect(result).toHaveProperty("pagination");
      expect(result).toHaveProperty("dataTransaction");
    } catch (err) {
      expect(err).toBeInstanceOf(TypeError);
    }
  });

  test("test get all transaction -> error", async () => {
    try {
      let result = await getAllTransactions();

      expect(result).toBeNull();
    } catch (err) {
      expect(err).toBeInstanceOf(TypeError);
    }
  });
});

describe("GET /api/v1/transaction/:id", () => {
  test("should get transaction by id", async () => {
    try {
      let id = 1;
      let result = getTransactionsById(id);

      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("sender_id");
      expect(result).toHaveProperty("receiver_id");
      expect(result).toHaveProperty("amount");
      expect(result.id).toBe(id);
    } catch (err) {
      expect(err).toBeInstanceOf(TypeError);
    }
  });

  test("test get transaction by id -> error", async () => {
    try {
      let id = 646465;
      let result = await getTransactionsById(id);

      expect(result).toBeNull();
    } catch (err) {
      expect(err).toBeInstanceOf(TypeError);
    }
  });
});
