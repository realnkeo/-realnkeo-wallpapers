const express = require("express");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();

app.use(express.json());

// ==================================================
// PREMIUM PRODUCTS
// ==================================================

const catalog = {
  10: {
    name: "Purple Princess Premium",
    price: 29,
    file: "IMG_4285.JPG"
  }
};

// ==================================================
// RAZORPAY
// ==================================================

const razorpay =
  process.env.RAZORPAY_KEY_ID &&
  process.env.RAZORPAY_KEY_SECRET
    ? new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
      })
    : null;

// ==================================================
// SUPABASE
// ==================================================

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

// ==================================================
// TEMPORARY STORAGE
// ==================================================

const orders = new Map();
const downloads = new Map();

// ==================================================
// CREATE RAZORPAY ORDER
// ==================================================

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
        error: "Invalid premium product"
      });
    }

    const amount =
      products.reduce(
        (sum, product) => sum + product.price,
        0
      ) * 100;

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

    return res.json({
      id: order.id,
      amount: order.amount,
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.error("Create order error:", error);

    return res.status(500).json({
      error: "Unable to create payment order"
    });
  }
});

// ==================================================
// VERIFY PAYMENT
// ==================================================

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

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        error: "Missing payment details"
      });
    }

    const savedOrder = orders.get(
      razorpay_order_id
    );

    if (!savedOrder) {
      return res.status(400).json({
        success: false,
        error: "Order not found or expired"
      });
    }

    // ----------------------------------------------
    // VERIFY RAZORPAY SIGNATURE
    // ----------------------------------------------

    const body =
      razorpay_order_id +
      "|" +
      razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(body)
      .digest("hex");

    const expectedBuffer =
      Buffer.from(expectedSignature);

    const receivedBuffer =
      Buffer.from(razorpay_signature);

    if (
      expectedBuffer.length !==
        receivedBuffer.length ||
      !crypto.timingSafeEqual(
        expectedBuffer,
        receivedBuffer
      )
    ) {
      return res.status(400).json({
        success: false,
        error: "Invalid payment signature"
      });
    }

    // ----------------------------------------------
    // VERIFY ORDER
    // ----------------------------------------------

    const razorpayOrder =
      await razorpay.orders.fetch(
        razorpay_order_id
      );

    if (
      razorpayOrder.amount !==
        savedOrder.amount ||
      razorpayOrder.currency !== "INR"
    ) {
      return res.status(400).json({
        success: false,
        error: "Payment amount verification failed"
      });
    }

    // ----------------------------------------------
    // VERIFY PAYMENT
    // ----------------------------------------------

    const payment =
      await razorpay.payments.fetch(
        razorpay_payment_id
      );

    if (
      payment.order_id !==
        razorpay_order_id ||
      payment.status !== "captured"
    ) {
      return res.status(400).json({
        success: false,
        error: "Payment was not captured"
      });
    }

    // ----------------------------------------------
    // GET PREMIUM PRODUCT
    // ----------------------------------------------

    const productId =
      savedOrder.items[0];

    const product =
      catalog[productId];

    if (!product || !product.file) {
      return res.status(400).json({
        success: false,
        error: "Premium file not available"
      });
    }

    // ----------------------------------------------
    // CREATE ONE-TIME DOWNLOAD TOKEN
    // ----------------------------------------------

    const token = crypto
      .randomBytes(32)
      .toString("hex");

    downloads.set(token, {
      file: product.file,
      expiresAt:
        Date.now() + 10 * 60 * 1000
    });

    // Remove order after successful payment
    orders.delete(razorpay_order_id);

    return res.json({
      success: true,
      downloadUrl:
        "/api/download/" + token
    });

  } catch (error) {
    console.error(
      "Verify payment error:",
      error
    );

    return res.status(500).json({
      success: false,
      error: "Payment verification failed"
    });
  }
});

// ==================================================
// SECURE DOWNLOAD
// ==================================================

app.get(
  "/api/download/:token",
  async (req, res) => {
    try {
      if (!supabase) {
        return res
          .status(503)
          .send("Supabase is not configured.");
      }

      const token =
        req.params.token;

      const download =
        downloads.get(token);

      if (!download) {
        return res.status(404).send(`
          <html>
            <body style="
              font-family:Arial;
              text-align:center;
              padding:50px
            ">
              <h2>
                Download link expired or invalid.
              </h2>
              <p>
                Please contact REALNKEO support.
              </p>
            </body>
          </html>
        `);
      }

      // --------------------------------------------
      // CHECK EXPIRY
      // --------------------------------------------

      if (
        Date.now() >
        download.expiresAt
      ) {
        downloads.delete(token);

        return res.status(410).send(`
          <html>
            <body style="
              font-family:Arial;
              text-align:center;
              padding:50px
            ">
              <h2>
                Download link expired.
              </h2>
              <p>
                Please contact REALNKEO support.
              </p>
            </body>
          </html>
        `);
      }

      // --------------------------------------------
      // CREATE TEMPORARY SUPABASE URL
      // --------------------------------------------

      const {
        data: signed,
        error
      } = await supabase.storage
        .from("Wallpapers")
        .createSignedUrl(
          download.file,
          600,
          {
            download: true
          }
        );

      if (
        error ||
        !signed ||
        !signed.signedUrl
      ) {
        console.error(
          "Supabase download error:",
          error
        );

        return res.status(500).send(`
          <html>
            <body style="
              font-family:Arial;
              text-align:center;
              padding:50px
            ">
              <h2>
                Unable to create download link.
              </h2>
              <p>
                Please try again.
              </p>
            </body>
          </html>
        `);
      }

      // One-time token
      downloads.delete(token);

      // Redirect to temporary signed URL
      return res.redirect(
        signed.signedUrl
      );

    } catch (error) {
      console.error(
        "Download error:",
        error
      );

      return res.status(500).send(`
        <html>
          <body style="
            font-family:Arial;
            text-align:center;
            padding:50px
          ">
            <h2>
              Download error.
            </h2>
            <p>
              Please try again.
            </p>
          </body>
        </html>
      `);
    }
  }
);

// ==================================================
// STATIC WEBSITE
// ==================================================

app.use(
  express.static(__dirname)
);

// ==================================================
// START SERVER
// ==================================================

app.listen(
  process.env.PORT || 3000,
  () => {
    console.log(
      "REALNKEO store running"
    );
  }
);
