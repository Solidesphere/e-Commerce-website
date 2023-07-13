import express from "express";
import {
  GetProductById,
  GetProducts,
  deleteProduct,
  updateProduct,
  createProduct,
  createProductReview,
  GetProductReviewById,
  getTopProducts,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(GetProducts).post(protect, admin, createProduct);
router.get("/top", getTopProducts);
router
  .route("/:id/reviews")
  .post(protect, createProductReview)
  .get(GetProductReviewById);

router
  .route("/:id")
  .get(GetProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct);

export default router;
