import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombre,
        email,
        password: hashed,
        rol: "cliente", // 👈 por defecto
      },
    });

    res.json({ msg: "Usuario creado con éxito", user: nuevoUsuario });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
