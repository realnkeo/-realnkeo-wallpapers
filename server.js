const express = require("express");
const path = require("path");
const crypto = require("crypto");
const Razorpay = require("razorpay");
require("dotenv").config();

const app = express();

app.use(express.json());

// -------------------------
// PRODUCTS
// -------------------------
const catalog = {
  1: {
    name: "Pink Coastal Dream",
    price: 29,
    file: "IMG_3979.JPG"
  },
  2: {
    name: "Cyber Warrior",
    price: 49
  },
  3: {
    name: "Purple Dream",
    price: 39
  },
  4: {
    name: "Anime Night",
    price: 49
  },
  5: {
    name: "Moon Forest",
    price: 29
  },
  6: {
    name: "Neon Battle",
    price: 59
  },
  7: {
    name: "Sakura Sky",
    price: 39
  },
  8: {
    name: "Cosmic Earth",
    price: 49
  },
  9: {
    name: "Dark Gaming Pack",
    price: 99
  }
};

// -------------------------
// RAZORPAY
// -------------------------
const razorpay =
  process.env.RAZORPAY_KEY_ID &&
  process.env.RAZORPAY_KEY_SECRET
    ? new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
      })
    : null;

// Temporary order storage
const orders = new Map();

// Temporary download tokens
const downloads = new Map();

// -------------------------
// CREATE ORDER
// -------------------------
app.post("/api/create-order", async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({
        error: "Razorpay keys are not configured"
      });
    }

    const ids = req.body.items || [];

    const products = ids
      .map(id => catalog[id])
      .filter(Boolean);

    if (!products.length) {
      return res.status(400).json({
        error: "Invalid cart"
      });
    }

    const amount =
      products.reduce((sum, product) => {
        return sum + product.price;
      }, 0) * 100;

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: "rn_" + Date.now(),
      notes: {
        email: req.body.email || ""
      }
    });

    orders.set(order.id, {
      items: ids,
      amount: order.amount,
      email: req.body.email || "",
      createdAt: Date.now()
    });

    res.json({
      id: order.id,
      amount: order.amount,
      key: process.env.RAZORPAY_KEY_ID
    });

  } catch (e) {
    res.status(500).json({
      error: e.message
    });
  }
});

// -------------------------
// VERIFY PAYMENT
// -------------------------
app.post("/api/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    const savedOrder = orders.get(razorpay_order_id);

    if (!savedOrder) {
      return res.status(400).json({
        success: false,
        error: "Order not found"
      });
    }

    const body =
      razorpay_order_id +
      "|" +
      razorpay_payment_id;

    const expected = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(body)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: "Invalid payment signature"
      });
    }

    // -------------------------
    // CREATE TEMP DOWNLOAD TOKEN
    // -------------------------

    const token = crypto
      .randomBytes(32)
      .toString("hex");

    const firstProductId = savedOrder.items[0];
    const product = catalog[firstProductId];

    if (!product || !product.file) {
      return res.status(400).json({
        success: false,
        error: "Download file not available"
      });
    }

    downloads.set(token, {
      file: product.file,
      expiresAt: Date.now() + 10 * 60 * 1000
    });

    orders.delete(razorpay_order_id);

    res.json({
      success: true,
      downloadUrl:
        "/api/download/" + token
    });

  } catch (e) {
    res.status(500).json({
      success: false,
      error: e.message
    });
  }
});

// -------------------------
// SECURE DOWNLOAD
// -------------------------
app.get("/api/download/:token", (req, res) => {

  const token = req.params.token;
  const data = downloads.get(token);

  if (!data) {
    return res.status(404).send(`
      <h2>Download link expired or invalid.</h2>
      <p>Please contact REALNKEO support.</p>
    `);
  }

  if (Date.now() > data.expiresAt) {
    downloads.delete(token);

    return res.status(410).send(`
      <h2>Download link expired.</h2>
      <p>Please contact REALNKEO support.</p>
    `);
  }

  // One-time download
  downloads.delete(token);

  const filePath = path.join(
    __dirname,
    data.file
  );

  res.download(
    filePath,
    data.file,
    err => {
      if (err) {
        console.error(err);
      }
    }
  );
});

// -------------------------
// BLOCK DIRECT IMAGE ACCESS
// -------------------------

app.get("/IMG_3979.JPG", (req, res) => {
  res.status(403).send(`
    <h2>Access denied</h2>
    <p>This wallpaper is available only after purchase.</p>
  `);
});

// -------------------------
// STATIC WEBSITE
// -------------------------

app.use(express.static(__dirname));

app.listen(
  process.env.PORT || 3000,
  () => console.log("REALNKEO store running")
);
