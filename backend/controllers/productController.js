import AsyncHandler from "express-async-handler";
import { pool } from "../config/db.js";

// @description fetch all products
// @route  GET /api/product
// @access Public
const GetProducts = AsyncHandler(async (req, res) => {
  const keyword = req.query.keyword;
  let page = req.query.page ? req.query.page : 0;
  if (keyword) {
    const { rows } = await pool.query(
      `SELECT * FROM "product" WHERE  (name ILIKE '%'||$1||'%') order by "id" OFFSET $2 LIMIT 12 ;`,
      [keyword, page * 12]
    );
    res.json(rows);
  } else {
    const { rows } = await pool.query(
      `SELECT *,COUNT(*) OVER ()::INTEGER AS total_count FROM "product" order by "id" OFFSET $1  LIMIT 12 ;`,
      [page * 12]
    );
    res.json(rows);
  }
});

// @description fetch single product
// @route  GET /api/product/:id
// @access Public
const GetProductById = AsyncHandler(async (req, res) => {
  const { rows } = await pool.query(`SELECT * FROM "product" WHERE id=$1`, [
    req.params.id,
  ]);
  if (rows.length) {
    res.json(rows);
  } else {
    res.status(404);
    throw new Error("product not Found");
  }
});

// @description Delete product
// @route  DELETE /api/product/:id
// @access Private Admin
const deleteProduct = AsyncHandler(async (req, res) => {
  const { rows } = await pool.query(`SELECT * FROM "product" WHERE id=$1`, [
    req.params.id,
  ]);
  if (rows.length) {
    await pool.query(`DELETE from "product" WHERE "id" = $1`, [req.params.id]);
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("product not Found");
  }
});

// @description Create product
// @route  Post /api/product
// @access Private Admin
const createProduct = AsyncHandler(async (req, res) => {
  const product = {
    name: "sample name",
    price: 0,
    user: req.user.id,
    image: "/assets/images/sample.jpg",
    brand: "Sample brand",
    category: "sample category",
    countInStock: 0,
    numReviews: 0,
    description: "sample description",
  };

  const { rows } = await pool.query(
    `INSERT INTO "product" ("userId","name" ,"image", "brand", "category", "description",
     "numReviews", "price", "countInStock") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING "id","userId","name" ,"image","category", "description",
     "numReviews", "price", "countInStock", "brand"`,
    [
      product.user,
      product.name,
      product.image,
      product.brand,
      product.category,
      product.description,
      product.numReviews,
      product.price,
      product.countInStock,
    ]
  );

  if (rows[0]) {
    res.status(201).json(rows[0]);
  } else {
    res.status(400);
    throw new Error("invalid product data");
  }
});

// @description Update product
// @route  PUT /api/product/:id
// @access Private Admin
const updateProduct = AsyncHandler(async (req, res) => {
  const { rows: product } = await pool.query(
    `SELECT * FROM "product" WHERE id = $1`,
    [req.params.id]
  );
  if (product[0]) {
    const name = req.body.name || product[0].name;
    const image = req.body.image || product[0].image;
    const brand = req.body.brand || product[0].brand;
    const category = req.body.category || product[0].category;
    const description = req.body.description || product[0].description;
    const price = req.body.price || product[0].price;
    const countInStock = req.body.countInStock || product[0].countInStock;

    const { rows: updatedProduct } = await pool.query(
      `UPDATE "product" SET "name"= $1, "image"=$2, "brand"= $3, "category"=$4, "description"=$5, "price"=$6, "countInStock"= $7 WHERE id =$8 
       RETURNING "id","userId","name" ,"image", "category", "description", "numReviews", "price", "countInStock", "brand"`,
      [
        name,
        image,
        brand,
        category,
        description,
        price,
        countInStock,
        req.params.id,
      ]
    );
    res.json(updatedProduct[0]);
  } else {
    res.status(404);
    throw new Error("Product Not Found ");
  }
});

// @description Create new reviev
// @route  Post /api/products/:id/reviews
// @access Private
const createProductReview = AsyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const { rows: product } = await pool.query(
    `SELECT * FROM "product" WHERE id = $1`,
    [req.params.id]
  );
  if (product[0]) {
    const { rows: alreadyReviewd } = await pool.query(
      `SELECT * FROM "product" 
      INNER JOIN "review"
      ON "productId" = "product"."id"
      WHERE "product"."id" = $1
      AND "review"."userId" = $2`,
      [req.params.id, req.user.id]
    );

    if (alreadyReviewd[0]) {
      res.status(400);
      throw new Error("Product alredy reviewed");
    }

    try {
      await pool.query("BEGIN");
      await pool.query(
        `INSERT INTO "review" ("rating","comment","productId","userId") VALUES ($1,$2,$3,$4)`,
        [rating, comment, req.params.id, req.user.id]
      );
      await pool.query(
        `update "product" SET "numReviews" = (SELECT COUNT("id") FROM "review" WHERE "productId" = $1 ) WHERE "id" = $1`,
        [req.params.id]
      );
      await pool.query(
        `update "product" SET "rating"  = ((SELECT SUM("rating") FROM "review" WHERE "productId" = $1) / (SELECT COUNT("id") FROM "review" WHERE "productId" = $1)) WHERE "id" = $1`,
        [req.params.id]
      );
      await pool.query("COMMIT");
    } catch (e) {
      await pool.query("ROLLBACK");
      throw e;
    }

    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Product Not Found ");
  }
});

// @description fetch single product review
// @route  GET /api/product/:id/reviews
// @access Public
const GetProductReviewById = AsyncHandler(async (req, res) => {
  const { rows } = await pool.query(
    `SELECT "review"."id","review"."rating", "review"."comment", "review"."createdAt", "review"."userId","user"."name"
    FROM "review" 
    INNER JOIN "product" ON "productId" = "product"."id"
    INNER JOIN "user" ON "review"."userId" = "user"."id"
    WHERE "productId"= $1`,
    [req.params.id]
  );
  if (rows) {
    res.json(rows);
  } else {
    res.status(404);
    throw new Error("reviews not Found");
  }
});

// @description Get top Rated products
// @route  GET /api/products/top
// @access Public
const getTopProducts = AsyncHandler(async (req, res) => {
  const { rows } = await pool.query(
    `Select * from "product" ORDER BY "rating" DESC LIMIT 3 ;`
  );
  res.json(rows);
});

export {
  GetProductById,
  GetProducts,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  GetProductReviewById,
  getTopProducts,
};
