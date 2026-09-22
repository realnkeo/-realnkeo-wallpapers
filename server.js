const express = require("express");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const { createClient } = require("@supabase/supabase-js");
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
    file: "IMG_3979 2.JPG"
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

// -------------------------
// SUPABASE
// -------------------------
const supabase =
  process.env.SUPABASE_URL &&
  process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      )
    : null;

// Temporary storage
const orders = new Map();
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

    if (!supabase) {
      return res.status(503).json({
        error: "Supabase is not configured"
      });
    }

    const ids = Array.isArray(req.body.items)
      ? [...new Set(req.body.items.map(Number))]
      : [];

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
    console.error(e);

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
    if (!razorpay || !supabase) {
      return res.status(503).json({
        success: false,
        error: "Payment system is not configured"
      });
    }

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

    // -------------------------
    // VERIFY SIGNATURE
    // -------------------------

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

    if (
      !razorpay_signature ||
      expected.length !== razorpay_signature.length ||
      !crypto.timingSafeEqual(
        Buffer.from(expected),
        Buffer.from(razorpay_signature)
      )
    ) {
      return res.status(400).json({
        success: false,
        error: "Invalid payment signature"
      });
    }

    // -------------------------
    // VERIFY RAZORPAY ORDER
    // -------------------------

    const razorpayOrder =
      await razorpay.orders.fetch(razorpay_order_id);

    if (
      razorpayOrder.amount !== savedOrder.amount ||
      razorpayOrder.currency !== "INR"
    ) {
      return res.status(400).json({
        success: false,
        error: "Payment amount verification failed"
      });
    }

    // -------------------------
    // VERIFY PAYMENT
    // -------------------------

    const payment =
      await razorpay.payments.fetch(
        razorpay_payment_id
      );

    if (
      payment.order_id !== razorpay_order_id ||
      payment.status !== "captured"
    ) {
      return res.status(400).json({
        success: false,
        error: "Payment was not captured"
      });
    }

    // -------------------------
    // DOWNLOAD TOKEN
    // -------------------------

    const firstProductId =
      savedOrder.items[0];

    const product =
      catalog[firstProductId];

    if (!product || !product.file) {
      return res.status(400).json({
        success: false,
        error: "Download file not available"
      });
    }

    const token = crypto
      .randomBytes(32)
      .toString("hex");

    downloads.set(token, {
      file: product.file,
      expiresAt: Date.now() + 10 * 60 * 1000
    });

    // Remove used order
    orders.delete(razorpay_order_id);

    res.json({
      success: true,
      downloadUrl:
        "/api/download/" + token
    });

  } catch (e) {
    console.error(e);

    res.status(500).json({
      success: false,
      error: e.message
    });
  }
});

// -------------------------
// SECURE DOWNLOAD
// -------------------------
app.get("/api/download/:token", async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).send(
        "Supabase is not configured."
      );
    }

    const token = req.params.token;

    const data = downloads.get(token);

    if (!data) {
      return res.status(404).send(`
        <html>
          <body style="font-family:Arial;text-align:center;padding:50px">
            <h2>Download link expired or invalid.</h2>
            <p>Please contact REALNKEO support.</p>
          </body>
        </html>
      `);
    }

    if (Date.now() > data.expiresAt) {
      downloads.delete(token);

      return res.status(410).send(`
        <html>
          <body style="font-family:Arial;text-align:center;padding:50px">
            <h2>Download link expired.</h2>
            <p>Please contact REALNKEO support.</p>
          </body>
        </html>
      `);
    }

    // One-time REALNKEO token
    downloads.delete(token);

    // Create Supabase signed URL
    const { data: signed, error } =
      await supabase.storage
        .from("Wallpapers")
        .createSignedUrl(
          data.file,
          600,
          {
            download: true
          }
        );

    if (error || !signed?.signedUrl) {
      console.error(error);

      return res.status(500).send(`
        <h2>Unable to create download link.</h2>
        <p>Please contact REALNKEO support.</p>
      `);
    }

    // Send user to temporary Supabase download URL
    res.redirect(signed.signedUrl);

  } catch (e) {
    console.error(e);

    res.status(500).send(`
      <h2>Download error.</h2>
      <p>Please contact REALNKEO support.</p>
    `);
  }
});

// -------------------------
// STATIC WEBSITE
// -------------------------
app.use(express.static(__dirname));

// -------------------------
// START SERVER
// -------------------------
app.listen(
  process.env.PORT || 3000,
  () => {
    console.log("REALNKEO store running");
  }
);
