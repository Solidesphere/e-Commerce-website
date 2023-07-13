import AsyncHandler from "express-async-handler";
import { pool } from "../config/db.js";
import { createJWT } from "../utils/auth.js";
import { comparePasswords, hashPassword } from "../utils/auth.js";

// @description  Auth user & get token
// @route  Post /api/users/login
// @access Public
const authUser = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { rows } = await pool.query(`SELECT * FROM "user" WHERE email = $1`, [
    email,
  ]);
  if (rows[0] && (await comparePasswords(password, rows[0].password))) {
    res.json({
      id: rows[0].id,
      name: rows[0].name,
      email: rows[0].email,
      isAdmin: rows[0].isAdmin,
      token: await createJWT(rows[0]),
    });
  } else {
    res.status(401);
    throw new Error("invalid email or password");
  }
});

// @description  Register new user
// @route  Post /api/users
// @access Public
const registerUser = AsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const { rows } = await pool.query(`SELECT * FROM "user" WHERE email = $1`, [
    email,
  ]);
  if (rows[0]) {
    res.status(400);
    throw new Error("User already exists");
  }
  const data = await pool.query(
    `INSERT INTO "user"(name, email, password) VALUES ($1,$2,$3) RETURNING id, name, email`,
    [name, email, await hashPassword(password)]
  );

  const user = data.rows[0];

  if (user) {
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: await createJWT(user),
    });
  } else {
    res.status(400);
    throw new Error("invalid user data");
  }
});

// @description  Get user profile
// @route  Get /api/users/profile
// @access Private
const getUserProfile = AsyncHandler(async (req, res) => {
  const { rows } = await pool.query(`SELECT * FROM "user" WHERE id = $1`, [
    req.user.id,
  ]);
  if (rows[0]) {
    res.json({
      id: rows[0].id,
      name: rows[0].name,
      email: rows[0].email,
      isAdmin: rows[0].isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User Not Found ");
  }
});

// @description  Update user profile
// @route  Put /api/users/profile
// @access Private
const updateUserProfile = AsyncHandler(async (req, res) => {
  const { rows } = await pool.query(`SELECT * FROM "user" WHERE id = $1`, [
    req.user.id,
  ]);
  if (rows[0]) {
    const name = req.body.name || rows[0].name;
    const email = req.body.email || rows[0].email;
    const id = rows[0].id;

    if (req.body.password) {
      const updatedUser = await pool.query(
        `UPDATE "user" SET password = $1, email = $2, name =$3 WHERE id =$4 RETURNING id, name, email, "isAdmin"`,
        [await hashPassword(req.body.password), email, name, id]
      );
      res.json({
        id: updatedUser.rows[0].id,
        name: updatedUser.rows[0].name,
        email: updatedUser.rows[0].email,
        isAdmin: updatedUser.rows[0].isAdmin,
        token: await createJWT(updatedUser.rows[0]),
      });
    } else {
      const updatedUser = await pool.query(
        `UPDATE "user" SET email = $1, name =$2 WHERE id =$3 RETURNING id, name, email, "isAdmin"`,
        [email, name, id]
      );
      res.json({
        id: updatedUser.rows[0].id,
        name: updatedUser.rows[0].name,
        email: updatedUser.rows[0].email,
        isAdmin: updatedUser.rows[0].isAdmin,
        token: await createJWT(updatedUser.rows[0]),
      });
    }
  } else {
    res.status(404);
    throw new Error("User Not Found ");
  }
});

// @description  Get All users
// @route  Get /api/users
// @access Private/Admin
const getUsers = AsyncHandler(async (req, res) => {
  const { rows } = await pool.query(`SELECT * FROM "user" `);
  if (rows) {
    res.json(rows);
  } else {
    res.status(404);
    throw new Error("User Not Found ");
  }
});

// @description  Delete user
// @route  DELETE /api/users/:id
// @access Private/Admin
const deleteUser = AsyncHandler(async (req, res) => {
  const { rows } = await pool.query(`SELECT * FROM "user" where "id" = $1`, [
    req.params.id,
  ]);
  if (rows[0]) {
    await pool.query(`DELETE FROM "user" WHERE "id" = $1`, [req.params.id]);
    res.json({ message: "user removed" });
  } else {
    res.status(404);
    throw new Error("User Not Found ");
  }
});

// @description  Get by id
// @route  Get /api/users/:id
// @access Private/Admin
const getUserbyId = AsyncHandler(async (req, res) => {
  const { rows } = await pool.query(
    `SELECT "id", "name", "email", "createdAt","updatedAt","isAdmin" FROM "user" where "id"=$1;`,
    [req.params.id]
  );
  if (rows[0]) {
    res.json(rows[0]);
  } else {
    res.status(404);
    throw new Error("User Not Found ");
  }
});

// @description  Update user
// @route  PUT /api/users/:id
// @access Private/Admin

const updateUser = AsyncHandler(async (req, res) => {
  const { rows } = await pool.query(`SELECT * FROM "user" WHERE id = $1`, [
    req.params.id,
  ]);
  if (rows[0]) {
    const name = req.body.name || rows[0].name;
    const email = req.body.email || rows[0].email;
    const isAdmin = req.body.isAdmin;
    const id = rows[0].id;

    const updatedUser = await pool.query(
      `UPDATE "user" SET  email = $1, name =$2, "isAdmin" = $3, "updatedAt"= $5 WHERE id =$4 
      RETURNING id, name, email, "updatedAt", "createdAt","isAdmin"`,
      [email, name, isAdmin, id, new Date()]
    );
    res.json({
      id: updatedUser.rows[0].id,
      name: updatedUser.rows[0].name,
      email: updatedUser.rows[0].email,
      updatedAt: updatedUser.rows[0].updatedAt,
      createdAt: updatedUser.rows[0].createdAt,
      isAdmin: updatedUser.rows[0].isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User Not Found ");
  }
});

export {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserbyId,
  updateUser,
};
