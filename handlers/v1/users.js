const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  createUsers: async (req, res) => {
    const { name, email, password } = req.body;
    console.log(name, email, password);
    try {
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
      res.status(500).json({
        status: false,
        message: error.message,
        data: null,
      });
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const users = await prisma.users.findMany();
      res.status(200).json({
        status: true,
        message: "Success",
        data: users,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message,
        data: null,
      });
    }
  },
};
