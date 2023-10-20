const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { getPagination } = require("../../helpers/pagination");

module.exports = {
  createUsers: async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      // Untuk mengecek data yang dikirim harus sesuai
      if (!name || !email || !password) {
        return res.status(400).json({
          status: false,
          message: "All field must be filled",
          data: null,
        });
      }

      // Untuk mengecek apakah email sudah terdaftar
      const user = await prisma.users.findUnique({
        where: {
          email,
        },
      });

      // validasi jika email sudah terdaftar
      if (user) {
        return res.status(400).json({
          status: false,
          message: "Email already exist",
          data: null,
        });
      }

      // Jika email belum terdaftar, maka akan membuat user baru
      const newUser = await prisma.users.create({
        data: {
          name,
          email,
          password,
        },
      });
      res.status(200).json({
        status: true,
        message: "Success",
        data: newUser,
      });
    } catch (error) {
      next(error);
    }
  },

  // menampilkan daftar user
  getAllUsers: async (req, res, next) => {
    try {
      let { page = 1, limit = 10 } = req.query;
      page = Number(page);
      limit = Number(limit);

      const dataUsers = await prisma.users.findMany({
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
        },
        orderBy: {
          id: "asc",
        },
      });

      const { _count } = await prisma.users.aggregate({
        _count: { id: true },
      });

      const pagination = getPagination(req, res, _count.id, page, limit);

      res.status(200).json({
        status: true,
        message: "Success",
        data: { pagination, dataUsers },
      });
    } catch (error) {
      next(error);
    }
  },

  // menampilkan detail informasi user (tampilkan juga profile)
  getUserById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await prisma.users.findUnique({
        where: {
          id: Number(id),
        },
        select: {
          id: true,
          name: true,
          email: true,
          profiles: {
            select: {
              identity_type: true,
              identity_number: true,
              address: true,
            },
          },
        },
      });

      if (!user) {
        return res.status(400).json({
          status: false,
          message: "User not found",
          data: null,
        });
      }

      res.status(200).json({
        status: true,
        message: "Success",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },
};
