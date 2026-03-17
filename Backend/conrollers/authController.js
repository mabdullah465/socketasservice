import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../db.js";
import { v4 as uuidv4 } from "uuid";

async function SignUp(req, res) {
  const { email, password } = req.body;
  console.log(email, password);

  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const id = uuidv4();

    const sql = "INSERT INTO users (id, email, password) VALUES (?, ?, ?)";
    await db.query(sql, [id, email, hashedPassword]);

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "User already exists" });
    }

    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function Login(req, res) {
  const { email, password } = req.body;

  try {
    const sql = "SELECT * FROM users WHERE email = ?";
    const [data] = await db.query(sql, [email]);

    if (data.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, data[0].password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: data[0].id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: { email: data[0].email },
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
}

export { SignUp, Login };
