const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { getPagination } = require("../../helpers/pagination");

module.exports = {
  // membuat transaksi
  createTransactions: async(req, res, next) => {
    try {
      let { source_account_id, destination_account_id, amount } = req.body;
  
      // if(!source_account_id || !destination_account_id || !amount) {
      //   return res.status(400).json({
      //     status: false,
      //     message: "All field must be filled",
      //     data: null,
      //   });
      // }

      // Validasi source_account_id dan destination_account_id
      const sourceAccount = await prisma.bank_accounts.findUnique({
        where: {
          id: source_account_id,
        },
      });
  
      if (!sourceAccount) {
        return res.status(400).json({
          status: false,
          message: "Source account tidak ditemukan",
        });
      }
  
      const destinationAccount = await prisma.bank_accounts.findUnique({
        where: {
          id: destination_account_id,
        },
      });
  
      if (!destinationAccount) {
        return res.status(400).json({
          status: false,
          message: "Destination account tidak ditemukan",
        });
      }
  
      // Validasi amount
      if (amount <= 0) {
        return res.status(400).json({
          status: false,
          message: "Amount tidak valid",
        });
      }
  
      // Validasi apakah pengguna memiliki otorisasi untuk melakukan transaksi dari rekening bank asal
      const user = await prisma.users.findUnique({
        where: {
          id: sourceAccount.user_id,
        },
      });
  
      if (user.id !== sourceAccount.user_id) {
        return res.status(400).json({
          status: false,
          message: "Pengguna tidak memiliki otorisasi untuk melakukan transaksi dari rekening bank asal",
        });
      }
  
      // Jika semua validasi berhasil, maka lakukan transaksi
      await prisma.bank_accounts.update({
        where: {
          id: source_account_id,
        },
        data: {
          balance: sourceAccount.balance - amount,
        },
      });
  
      await prisma.bank_accounts.update({
        where: {
          id: destination_account_id,
        },
        data: {
          balance: {
            increment: amount,
          },
        },
      });
  
      let transaction = await prisma.transaction.create({
        data: {
          source_account_id,
          destination_account_id,
          amount,
        },
      });
  
      return res.status(201).json({
        status: true,
        message: "Success Create Transactions",
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  },

  // menampilkan semua transaksi
  getAllTransactions: async (req, res, next) => {
    try {
      let { page = 1, limit = 10 } = req.query;
      page = Number(page);
      limit = Number(limit);

      const dataTransaction = await prisma.transaction.findMany({
        skip: (page - 1) * limit,
        take: limit,
      });

      const { _count } = await prisma.transaction.aggregate({
        _count: { id: true },
      });

      const pagination = getPagination(req, res, _count.id, page, limit);

      res.status(200).json({
        status: true,
        message: "Success",
        data: { pagination, dataTransaction },
      });
    } catch (error) {
      next(error);
    }
  },

  // menampilkan detail transaksi
  getTransactionsById: async (req, res, next) => {
    try {
      const { id } = req.params;

      // Mendapatkan informasi transaksi
      const transaction = await prisma.transaction.findUnique({
        where: {
          id: Number(id),
        },
      });

      // Mendapatkan informasi akun asal
      const sourceAccount = await prisma.bank_accounts.findUnique({
        where: {
          id: transaction.source_account_id,
        },
        select: {
            id: true,
            user_id: true,
            bank_name: true,
            bank_account_number: true,
            balance: true,
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
      });

      // Mendapatkan informasi akun tujuan
      const destinationAccount = await prisma.bank_accounts.findUnique({
        where: {
          id: transaction.destination_account_id,
        },
        select: {
          id: true,
          user_id: true,
          bank_name: true,
          bank_account_number: true,
          balance: true,
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      return res.status(200).json({
        status: true,
        message: "Success",
        data: {
          transaction,
          source_account: sourceAccount,
          destination_account: destinationAccount,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
