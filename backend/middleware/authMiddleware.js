import { validateJWT } from "../utils/auth.js";
import AsyncHandler from "express-async-handler";
import { pool } from "../config/db.js";

const protect = AsyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = await validateJWT(token);
      const { rows } = await pool.query(
        `SELECT id, "createdAt", name, email, "isAdmin" FROM "user" WHERE id = $1`,
        [decoded.id]
      );
      req.user = rows[0];
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized,token failed");
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("not authorized, no, token");
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not Authorized as an admin");
  }
};

export { protect, admin };
