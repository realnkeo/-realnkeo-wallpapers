const wallpapers = [
  {
    id: 1,
    name: "Water Fire Goddess",
    category: "anime",
    tag: "4K • Anime • Free",
    image: "IMG_4547.jpeg",
    type: "free"
  },

  {
    id: 2,
    name: "Flame Blossom Goddess",
    category: "anime",
    tag: "4K • Fantasy • Free",
    image: "IMG_4549.jpeg",
    type: "free"
  },

  {
    id: 3,
    name: "Dark Water Fire Demon",
    category: "fantasy",
    tag: "4K • Fantasy • Free",
    image: "IMG_4551.jpeg",
    type: "free"
  },

  {
    id: 4,
    name: "Water Fire Angel",
    category: "fantasy",
    tag: "4K • Fantasy • Free",
    image: "IMG_4544.jpeg",
    type: "free"
  },

  {
    id: 5,
    name: "Water Fire Warrior",
    category: "anime",
    tag: "4K • Warrior • Free",
    image: "IMG_4545.jpeg",
    type: "free"
  },

  {
    id: 6,
    name: "Pink Snow Princess",
    category: "anime",
    tag: "4K • Anime • Premium",
    image: "IMG_4557.jpeg",
    type: "premium",
    price: 29
  },

  {
    id: 7,
    name: "Winter Lavender Princess",
    category: "fantasy",
    tag: "4K • Fantasy • Premium",
    image: "IMG_4558.jpeg",
    type: "premium",
    price: 29
  },

  {
    id: 8,
    name: "Purple Snow Queen",
    category: "anime",
    tag: "4K • Anime • Premium",
    image: "IMG_4560.jpeg",
    type: "premium",
    price: 29
  },

  {
    id: 9,
    name: "Golden Snow Queen",
    category: "fantasy",
    tag: "4K • Fantasy • Premium",
    image: "IMG_4559.jpeg",
    type: "premium",
    price: 29
  },

  {
    id: 10,
    name: "Pink Winter Warrior",
    category: "anime",
    tag: "4K • Warrior • Premium",
    image: "IMG_4561.jpeg",
    type: "premium",
    price: 29
  },

  {
    id: 11,
    name: "Blindfold Coffee Angel",
    category: "fantasy",
    tag: "4K • Fantasy • Premium",
    image: "IMG_4552.jpeg",
    type: "premium",
    price: 29
  },

  {
    id: 12,
    name: "Pink Fantasy Coffee Girl",
    category: "anime",
    tag: "4K • Anime • Premium",
    image: "IMG_4554.jpeg",
    type: "premium",
    price: 29
  },

  {
    id: 13,
    name: "Blue Feather Goddess",
    category: "fantasy",
    tag: "4K • Fantasy • Premium",
    image: "IMG_4553.jpeg",
    type: "premium",
    price: 29
  },

  {
    id: 14,
    name: "Dark Feather Queen",
    category: "fantasy",
    tag: "4K • Fantasy • Premium",
    image: "IMG_4555.jpeg",
    type: "premium",
    price: 29
  },

  {
    id: 15,
    name: "Lavender Coffee Princess",
    category: "anime",
    tag: "4K • Anime • Premium",
    image: "IMG_4556.jpeg",
    type: "premium",
    price: 29
  },

  {
    id: 16,
    name: "Lavender Flower Princess",
    category: "fantasy",
    tag: "4K • Fantasy • Premium",
    image: "IMG_4500.jpeg",
    type: "premium",
    price: 29
  },

  {
    id: 17,
    name: "Pink Sunset Flower",
    category: "anime",
    tag: "4K • Anime • Premium",
    image: "IMG_4508.jpeg",
    type: "premium",
    price: 29
  },

  {
    id: 18,
    name: "Golden Sunset Flower",
    category: "fantasy",
    tag: "4K • Fantasy • Premium",
    image: "IMG_4510.jpeg",
    type: "premium",
    price: 29
  },

  {
    id: 19,
    name: "Dark Flower Queen",
    category: "fantasy",
    tag: "4K • Fantasy • Premium",
    image: "IMG_4512.jpeg",
    type: "premium",
    price: 29
  },

  {
    id: 20,
    name: "Sunset Meadow Queen",
    category: "fantasy",
    tag: "4K • Fantasy • Premium",
    image: "IMG_4520.jpeg",
    type: "premium",
    price: 29
  },

  // ==================================================
  // NEW 5 FREE NURSE WALLPAPERS
  // ==================================================

  {
    id: 21,
    name: "Pink Nurse Angel",
    category: "anime",
    tag: "4K • Anime • Free",
    image: "IMG_4621.jpeg",
    type: "free"
  },

  {
    id: 22,
    name: "Rose Nurse Princess",
    category: "anime",
    tag: "4K • Anime • Free",
    image: "IMG_4623.jpeg",
    type: "free"
  },

  {
    id: 23,
    name: "Blindfold Nurse",
    category: "fantasy",
    tag: "4K • Fantasy • Free",
    image: "IMG_4624.jpeg",
    type: "free"
  },

  {
    id: 24,
    name: "White Hair Nurse",
    category: "anime",
    tag: "4K • Anime • Free",
    image: "IMG_4625.jpeg",
    type: "free"
  },

  {
    id: 25,
    name: "Purple Nurse Queen",
    category: "fantasy",
    tag: "4K • Fantasy • Free",
    image: "IMG_4626.jpeg",
    type: "free"
  }
];

let currentCategory = "all";


// ==================================================
// LOAD RAZORPAY CHECKOUT
// ==================================================

function loadRazorpay() {
  return new Promise((resolve, reject) => {

    if (window.Razorpay) {
      resolve();
      return;
    }

    const script = document.createElement("script");

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => resolve();

    script.onerror = () => {
      reject(
        new Error(
          "Unable to load Razorpay Checkout."
        )
      );
    };

    document.head.appendChild(script);
  });
}


// ==================================================
// RENDER WALLPAPERS
// ==================================================

function renderWallpapers() {

  const container =
    document.getElementById("products");

  const searchInput =
    document.getElementById("search");

  const noResults =
    document.getElementById("noResults");

  const searchText =
    searchInput.value.trim().toLowerCase();

  let list = wallpapers;


  // CATEGORY FILTER
  if (currentCategory !== "all") {

    list = list.filter(
      wallpaper =>
        wallpaper.category === currentCategory
    );
  }


  // SEARCH FILTER
  if (searchText !== "") {

    list = list.filter(
      wallpaper =>
        wallpaper.name
          .toLowerCase()
          .includes(searchText) ||

        wallpaper.category
          .toLowerCase()
          .includes(searchText) ||

        wallpaper.tag
          .toLowerCase()
          .includes(searchText)
    );
  }


  // NO RESULTS
  if (list.length === 0) {

    container.innerHTML = "";

    noResults.style.display = "block";

    return;
  }


  noResults.style.display = "none";


  // CREATE CARDS
  container.innerHTML =
    list.map(wallpaper => {

      let visual;


      // IMAGE
      if (wallpaper.image) {

        visual = `
          <div
            class="image"
            style="
              background-image:url('${wallpaper.image}');
              background-size:cover;
              background-position:center;
            "
          ></div>
        `;

      } else {

        visual = `
          <div class="image">

            <div
              class="image-placeholder"
              style="
                --c1:${wallpaper.c1};
                --c2:${wallpaper.c2};
              "
            >
              ${wallpaper.name}
            </div>

          </div>
        `;
      }


      // ACTION BUTTON
      let actionButton;


      // PREMIUM
      if (wallpaper.type === "premium") {

        actionButton = `
          <button
            class="download"
            onclick="buyPremium(${wallpaper.id})"
          >
            💎 Buy ₹${wallpaper.price}
          </button>
        `;

      }


      // FREE WITH IMAGE
      else if (wallpaper.image) {

        actionButton = `
          <a
            href="${wallpaper.image}"
            download
            class="download"
            style="
              display:block;
              text-align:center;
              text-decoration:none;
            "
          >
            Download Free
          </a>
        `;

      }


      // FREE WITHOUT IMAGE
      else {

        actionButton = `
          <button
            class="download"
            onclick="comingSoon()"
          >
            Download Free
          </button>
        `;
      }


      // PREMIUM BADGE
      const premiumBadge =
        wallpaper.type === "premium"
          ? `
            <div
              style="
                position:absolute;
                top:12px;
                right:12px;
                background:#8b5cf6;
                color:white;
                padding:6px 10px;
                border-radius:20px;
                font-size:12px;
                font-weight:700;
                z-index:2;
              "
            >
              💎 PREMIUM
            </div>
          `
          : "";


      // CARD
      return `
        <article
          class="card"
          style="position:relative;"
        >

          ${premiumBadge}

          ${visual}

          <div class="card-content">

            <h3>
              ${wallpaper.name}
            </h3>

            <div class="meta">
              ${wallpaper.tag}
            </div>

            ${actionButton}

          </div>

        </article>
      `;

    }).join("");
}


// ==================================================
// CATEGORY FILTER
// ==================================================

function filterWallpapers(category) {

  currentCategory = category;

  const filter =
    document.getElementById("filter");

  if (filter) {
    filter.value = category;
  }

  renderWallpapers();
}


// ==================================================
// SEARCH
// ==================================================

function searchWallpapers() {
  renderWallpapers();
}


// ==================================================
// FREE DOWNLOAD FALLBACK
// ==================================================

function comingSoon() {

  alert(
    "This wallpaper is coming soon. More free wallpapers will be added soon!"
  );
}


// ==================================================
// PREMIUM PURCHASE
// ==================================================

async function buyPremium(productId) {

  const product =
    wallpapers.find(
      wallpaper =>
        wallpaper.id === productId
    );


  if (
    !product ||
    product.type !== "premium"
  ) {

    alert(
      "Premium product not found."
    );

    return;
  }


  try {

    // LOAD RAZORPAY
    await loadRazorpay();


    // CREATE ORDER
    const response =
      await fetch(
        "/api/create-order",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            items: [productId]
          })
        }
      );


    const data =
      await response.json();


    if (
      !response.ok ||
      !data.id ||
      !data.key
    ) {

      throw new Error(
        data.error ||
        "Unable to create payment order."
      );
    }


    // RAZORPAY OPTIONS
    const options = {

      key: data.key,

      amount: data.amount,

      currency: data.currency,

      name: "REALNKEO",

      description:
        product.name,

      order_id: data.id,


      theme: {
        color: "#8b5cf6"
      },


      // PAYMENT SUCCESS
      handler:
        async function(paymentResponse) {

          try {

            const verifyResponse =
              await fetch(
                "/api/verify-payment",
                {

                  method: "POST",

                  headers: {
                    "Content-Type":
                      "application/json"
                  },

                  body: JSON.stringify({

                    razorpay_order_id:
                      paymentResponse
                        .razorpay_order_id,

                    razorpay_payment_id:
                      paymentResponse
                        .razorpay_payment_id,

                    razorpay_signature:
                      paymentResponse
                        .razorpay_signature

                  })

                }
              );


            const verifyData =
              await verifyResponse.json();


            if (
              !verifyResponse.ok ||
              !verifyData.success
            ) {

              throw new Error(
                verifyData.error ||
                "Payment verification failed."
              );
            }


            alert(
              "🎉 Payment successful!\n\nYour premium wallpaper download will start now."
            );


            window.location.href =
              verifyData.downloadUrl;


          } catch (error) {

            console.error(
              "Payment verification error:",
              error
            );


            alert(
              "Payment was received, but the download could not be created.\n\nPlease contact REALNKEO support."
            );
          }

        },


      // CHECKOUT CLOSED
      modal: {

        ondismiss: function() {

          console.log(
            "Razorpay checkout closed."
          );

        }

      }

    };


    // OPEN RAZORPAY
    const razorpay =
      new window.Razorpay(options);


    // PAYMENT FAILED
    razorpay.on(
      "payment.failed",
      function(response) {

        console.error(
          "Razorpay payment failed:",
          response.error
        );


        alert(
          "Payment failed.\n\nPlease try again."
        );

      }
    );


    razorpay.open();


  } catch (error) {

    console.error(
      "Premium purchase error:",
      error
    );


    alert(
      error.message ||
      "Unable to start payment. Please try again."
    );
  }
}


// ==================================================
// START WEBSITE
// ==================================================

renderWallpapers();
