import AsyncHandler from "express-async-handler";
import { pool } from "../config/db.js";

// @description Create new order
// @route  POST /api/orders
// @access Privete
const addOrderItems = AsyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
    return;
  } else {
    const data = await pool.query(
      `INSERT INTO "order"( "userId", "ShippingAddress",  "paymentMethod",  "taxPrice",  "Shipping",  "TotalPrice", "itemsPrice", "orderItems") 
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8) 
      RETURNING "userId", "ShippingAddress", "paymentMethod", "taxPrice", "Shipping", "TotalPrice", "itemsPrice", "orderItems" , "id"`,
      [
        req.user.id,
        JSON.stringify(shippingAddress),
        paymentMethod,
        taxPrice,
        shippingPrice,
        totalPrice,
        itemsPrice,
        JSON.stringify(orderItems),
      ]
    );

    res.status(201).json(data.rows[0]);
  }
});

// @description Create get order by Id
// @route  Get /api/orders/:id
// @access Privete
const getOrderById = AsyncHandler(async (req, res) => {
  const { rows: order } = await pool.query(
    `select "userId", "ShippingAddress", "paymentMethod", "taxPrice", "Shipping", "TotalPrice", "itemsPrice", "orderItems" , "order"."id" as "orderId", "user"."name", "user"."email", "isPaid", "isDelivred" 
  from "order" 
  INNER JOIN "user"  
  ON "user"."id" = "order"."userId"
  where "order"."id" = $1 AND "userId" =$2`,
    [req.params.id, req.user.id]
  );

  if (order[0]) {
    res.json(order[0]);
  } else {
    res.status(404);
    throw new Error("order not found");
  }
});

// @description Update order to paid
// @route  Get /api/orders/:id/pay
// @access Privete
const updateOrderToPaid = AsyncHandler(async (req, res) => {
  const { rows: order } = await pool.query(`select * where "order"."id" = $1`, [
    req.params.id,
  ]);

  if (order[0]) {
    const paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const { rows: updatedOrder } = await await pool.query(
      `
    BEGIN; 
    UPDATE "order" SET "isPaid" = $2, "paidAt"=$3  where "order"."id" = $1;
    INSERT INTO "paymentResult" ("orderId","email_address","update_time","status") VALUES($1,$4,$5,$6);
    COMMIT;`,
      [
        req.params.id,
        true,
        Date.now(),
        paymentResult.email_address,
        paymentResult.update_time,
        paymentResult.status,
      ]
    );
  } else {
    res.status(404);
    throw new Error("order not found");
  }
});

// @description  get logged in user order
// @route  Get /api/orders/myorders
// @access Privete

const getMyOrders = AsyncHandler(async (req, res) => {
  const { rows: orders } = await pool.query(
    `select *
  from "order" 
  where "userId" = $1`,
    [req.user.id]
  );

  if (orders) {
    res.json(orders);
  } else {
    res.status(404);
    throw new Error("orders not found");
  }
});

// @description  get all oreders
// @route  Get /api/orders/
// @access privite/admin

const getOrders = AsyncHandler(async (req, res) => {
  const { rows: orders } = await pool.query(
    `select "order"."id" as "orderId","order"."createdAt","TotalPrice", "isPaid", "isDelivred", "delivredAt", "PaidAt", "user"."name", "user"."id" from "order" 
     INNER JOIN "user" 
     ON "order"."userId" = "user"."id"
   `
  );

  if (orders) {
    res.json(orders);
  } else {
    res.status(404);
    throw new Error("orders not found");
  }
});

// @description  get order user order from admin
// @route  Get /api/orders/orders/:id
// @access Privete/admin

const getOrderByIdAdmin = AsyncHandler(async (req, res) => {
  const { rows: orders } = await pool.query(
    `select "PaidAt", "Shipping", "ShippingAddress", "TotalPrice" , "order"."createdAt"
     "delivredAt","order".id, "isDelivred", "isPaid", "itemsPrice", "orderItems", "paymentMethod",
     "taxPrice","userId","name", "email"
     From "order" 
     INNER JOIN "user"
     ON "user"."id" = "userId"
     where "order"."id" = $1 
  `,
    [req.params.id]
  );

  if (orders[0]) {
    res.json(orders[0]);
  } else {
    res.status(404);
    throw new Error("orders not found");
  }
});

// @description Update order to delivered
// @route  Get /api/orders/:id/delivered
// @access Privete
const updateOrderToDelivred = AsyncHandler(async (req, res) => {
  const { rows: order } = await pool.query(
    `select * from "order" where "order"."id" = $1`,
    [req.params.id]
  );

  if (order[0]) {
    const { rows: updatedOrder } = await await pool.query(
      ` 
    UPDATE "order" SET "isDelivred" = $2, "delivredAt"=$3  where "order"."id" = $1;
    `,
      [req.params.id, true, new Date()]
    );
    res.status(201).json({ message: "product delivered" });
  } else {
    res.status(404);
    throw new Error("order not found");
  }
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  getOrderByIdAdmin,
  updateOrderToDelivred,
};
