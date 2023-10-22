const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = process.env;
const { getPagination } = require("../../helpers/pagination");

module.exports = {
  register: async (req, res, next) => {
    try {
      const { name, email, password, password_confirmation } = req.body;

      try {
        if (password !== password_confirmation) {
          return res.status(400).json({
            status: false,
            message: "Bad Request",
            err: "please ensure that the password and password confirmation match!",
            data: null,
          });
        }

        // Untuk mengecek data yang dikirim harus sesuai
        if (!name || !email || !password) {
          return res.status(400).json({
            status: false,
            message: "Bad Request",
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
            message: "Bad Request",
            message: "Email already exist",
            data: null,
          });
        }

        let encryptedPassword = await bcrypt.hash(password, 10);
        let newUser = await prisma.users.create({
          data: {
            name,
            email,
            password: encryptedPassword,
          },
        });

        res.status(201).json({
          status: true,
          message: "Created",
          message: "Success",
          data: newUser,
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

  login: async (req, res, next) => {
    try {
      let { email, password } = req.body;

      try {
        let user = await prisma.users.findUnique({ where: { email } });
        if (!user) {
          return res.status(400).json({
            status: false,
            message: "Bad Request",
            err: "invalid email or password!",
            data: null,
          });
        }

        let isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
          return res.status(400).json({
            status: false,
            message: "Bad Request",
            err: "invalid email or password!",
            data: null,
          });
        }

        if (!JWT_SECRET_KEY) {
          return res.status(500).json({
            status: false,
            message: "Internal Server err",
            err: "JWT_SECRET_KEY is not defined!",
            data: null,
          });
        }

        let token = jwt.sign({ id: user.id }, JWT_SECRET_KEY);

        return res.status(201).json({
          status: true,
          message: "OK",
          err: null,
          data: { user, token },
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

  authenticate: (req, res, next) => {
    return res.status(200).json({
      status: true,
      message: "OK",
      err: null,
      data: { user: req.user },
    });
  },

  // menampilkan daftar user
  getAllUsers: async (req, res, next) => {
    try {
      let { page = 1, limit = 10 } = req.query;
      page = Number(page);
      limit = Number(limit);

      try {
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

  // menampilkan detail informasi user (tampilkan juga profile)
  getUserById: async (req, res, next) => {
    try {
      const { id } = req.params;

      try {
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
};
