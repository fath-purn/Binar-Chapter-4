const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { getPagination } = require("../../helpers/pagination");

module.exports = {
  createAccount: async (req, res, next) => {
    try {
      const { user_id, bank_name, bank_account_number, balance } = req.body;

      try {
        // Validasi user_id
        const user = await prisma.users.findUnique({
          where: {
            id: user_id,
          },
        });

        if (!user) {
          return res.status(400).json({
            status: false,
            message: "User tidak ditemukan",
            data: null,
          });
        }

        // Validasi balance
        if (balance <= 0) {
          return res.status(400).json({
            status: false,
            message: "Saldo tidak valid",
            data: null,
          });
        }

        // Validasi apakah pengguna sudah memiliki rekening bank dengan nomor rekening yang sama
        const existingBankAccountCount = await prisma.bank_accounts.count({
          where: {
            bank_account_number,
          },
        });

        if (existingBankAccountCount) {
          return res.status(400).json({
            status: false,
            message:
              "Pengguna sudah memiliki rekening bank dengan nomor rekening yang sama",
            data: null,
          });
        }

        const account = await prisma.bank_accounts.create({
          data: {
            user_id,
            bank_name,
            bank_account_number,
            balance,
          },
        });
        res.status(201).json({
          status: true,
          message: "Success Create Account",
          data: account,
        });
      } catch (err) {
        res.status(400).json({
          status: false,
          message: err.message,
          data: null,
        });
      }
    } catch (err) {
      next(err);
    }
  },
  getAllAccount: async (req, res, next) => {
    try {
      let { page = 1, limit = 10 } = req.query;
      page = Number(page);
      limit = Number(limit);

      try {
        const dataAccounts = await prisma.bank_accounts.findMany({
          skip: (page - 1) * limit,
          take: limit,
        });

        const { _count } = await prisma.bank_accounts.aggregate({
          _count: { id: true },
        });

        const pagination = getPagination(req, res, _count.id, page, limit);

        res.status(200).json({
          status: true,
          message: "Success",
          data: { pagination, dataAccounts },
        });
      } catch (err) {
        res.status(400).json({
          status: false,
          message: err.message,
          data: null,
        });
      }
    } catch (err) {
      next(err);
    }
  },
  getAccountById: async (req, res, next) => {
    try {
      let { id } = req.params;
      id = Number(id);

      try {
        const account = await prisma.bank_accounts.findUnique({
          where: {
            id,
          },
        });

        if (!account) {
          return res.status(400).json({
            status: false,
            message: "Account not found",
            data: null,
          });
        }

        res.status(200).json({
          status: true,
          message: "Success",
          data: account,
        });
      } catch (err) {
        next(err);
      }
    } catch (err) {
      next(err);
    }
  },
};
