const wallpapers = [
  {
    id: 1,
    name: "Pink Coastal Dream",
    category: "mobile",
    tag: "HD • Mobile • Free",
    image: "IMG_3979.JPG",
    type: "free"
  },

  {
    id: 2,
    name: "Cyber Warrior",
    category: "gaming",
    tag: "4K • Gaming • Free",
    c1: "#bd7cff",
    c2: "#21103a",
    type: "free"
  },

  {
    id: 3,
    name: "Purple Dream",
    category: "mobile",
    tag: "4K • Mobile • Free",
    c1: "#e4a4ff",
    c2: "#32165b",
    type: "free"
  },

  {
    id: 4,
    name: "Anime Night",
    category: "anime",
    tag: "4K • Anime • Free",
    c1: "#7bd6ff",
    c2: "#101d3a",
    type: "free"
  },

  {
    id: 5,
    name: "Moon Forest",
    category: "nature",
    tag: "4K • Nature • Free",
    c1: "#8cffd0",
    c2: "#102f2a",
    type: "free"
  },

  {
    id: 6,
    name: "Neon Battle",
    category: "gaming",
    tag: "4K • Gaming • Free",
    c1: "#ff5bd8",
    c2: "#36102e",
    type: "free"
  },

  {
    id: 7,
    name: "Sakura Sky",
    category: "anime",
    tag: "4K • Anime • Free",
    c1: "#ffb5e6",
    c2: "#3d1738",
    type: "free"
  },

  {
    id: 8,
    name: "Cosmic Earth",
    category: "nature",
    tag: "4K • Nature • Free",
    c1: "#70a7ff",
    c2: "#111b3c",
    type: "free"
  },

  {
    id: 9,
    name: "Dark Gaming",
    category: "gaming",
    tag: "HD • Gaming • Free",
    c1: "#ff6b6b",
    c2: "#331314",
    type: "free"
  },

  {
    id: 10,
    name: "Purple Princess Premium",
    category: "anime",
    tag: "4K • Anime • Premium",
    image: "IMG_4285.JPG",
    type: "premium",
    price: 29
  }
];

let currentCategory = "all";

function renderWallpapers() {
  const container = document.getElementById("products");
  const searchInput = document.getElementById("search");
  const noResults = document.getElementById("noResults");

  const searchText = searchInput.value.trim().toLowerCase();

  let list = wallpapers;

  if (currentCategory !== "all") {
    list = list.filter(
      wallpaper => wallpaper.category === currentCategory
    );
  }

  if (searchText !== "") {
    list = list.filter(
      wallpaper =>
        wallpaper.name.toLowerCase().includes(searchText) ||
        wallpaper.category.toLowerCase().includes(searchText) ||
        wallpaper.tag.toLowerCase().includes(searchText)
    );
  }

  if (list.length === 0) {
    container.innerHTML = "";
    noResults.style.display = "block";
    return;
  }

  noResults.style.display = "none";

  container.innerHTML = list.map(wallpaper => {
    let visual;

    if (wallpaper.image) {
      visual = `
        <div
          class="image"
          style="
            background-image: url('${wallpaper.image}');
            background-size: cover;
            background-position: center;
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

    let actionButton;

    if (wallpaper.type === "premium") {
      actionButton = `
        <button
          class="download"
          onclick="premiumComingSoon()"
        >
          💎 Buy ₹${wallpaper.price}
        </button>
      `;
    } else if (wallpaper.image) {
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
    } else {
      actionButton = `
        <button
          class="download"
          onclick="comingSoon()"
        >
          Download Free
        </button>
      `;
    }

    const premiumBadge =
      wallpaper.type === "premium"
        ? `<div style="
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
          ">💎 PREMIUM</div>`
        : "";

    return `
      <article class="card" style="position:relative;">
        ${premiumBadge}

        ${visual}

        <div class="card-content">
          <h3>${wallpaper.name}</h3>

          <div class="meta">
            ${wallpaper.tag}
          </div>

          ${actionButton}
        </div>
      </article>
    `;
  }).join("");
}

function filterWallpapers(category) {
  currentCategory = category;

  document.getElementById("filter").value = category;

  renderWallpapers();
}

function searchWallpapers() {
  renderWallpapers();
}

function comingSoon() {
  alert(
    "This wallpaper is coming soon. More free wallpapers will be added soon!"
  );
}

function premiumComingSoon() {
  alert(
    "Premium purchase is coming soon. Payment will be available shortly."
  );
}

renderWallpapers();
