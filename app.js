
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
    tag: "4K • Anime • Free",
    image: "IMG_4557.jpeg",
    type: "free"
  },
  {
    id: 7,
    name: "Winter Lavender Princess",
    category: "fantasy",
    tag: "4K • Fantasy • Free",
    image: "IMG_4558.jpeg",
    type: "free"
  },
  {
    id: 8,
    name: "Purple Snow Queen",
    category: "anime",
    tag: "4K • Anime • Free",
    image: "IMG_4560.jpeg",
    type: "free"
  },
  {
    id: 9,
    name: "Golden Snow Queen",
    category: "fantasy",
    tag: "4K • Fantasy • Free",
    image: "IMG_4559.jpeg",
    type: "free"
  },
  {
    id: 10,
    name: "Pink Winter Warrior",
    category: "anime",
    tag: "4K • Warrior • Free",
    image: "IMG_4561.jpeg",
    type: "free"
  },
  {
    id: 11,
    name: "Blindfold Coffee Angel",
    category: "fantasy",
    tag: "4K • Fantasy • Free",
    image: "IMG_4552.jpeg",
    type: "free"
  },
  {
    id: 12,
    name: "Pink Fantasy Coffee Girl",
    category: "anime",
    tag: "4K • Anime • Free",
    image: "IMG_4554.jpeg",
    type: "free"
  },
  {
    id: 13,
    name: "Blue Feather Goddess",
    category: "fantasy",
    tag: "4K • Fantasy • Free",
    image: "IMG_4553.jpeg",
    type: "free"
  },
  {
    id: 14,
    name: "Dark Feather Queen",
    category: "fantasy",
    tag: "4K • Fantasy • Free",
    image: "IMG_4555.jpeg",
    type: "free"
  },
  {
    id: 15,
    name: "Lavender Coffee Princess",
    category: "anime",
    tag: "4K • Anime • Free",
    image: "IMG_4556.jpeg",
    type: "free"
  },
  {
    id: 16,
    name: "Lavender Flower Princess",
    category: "fantasy",
    tag: "4K • Fantasy • Free",
    image: "IMG_4500.jpeg",
    type: "free"
  },
  {
    id: 17,
    name: "Pink Sunset Flower",
    category: "anime",
    tag: "4K • Anime • Free",
    image: "IMG_4508.jpeg",
    type: "free"
  },
  {
    id: 18,
    name: "Golden Sunset Flower",
    category: "fantasy",
    tag: "4K • Fantasy • Free",
    image: "IMG_4510.jpeg",
    type: "free"
  },
  {
    id: 19,
    name: "Dark Flower Queen",
    category: "fantasy",
    tag: "4K • Fantasy • Free",
    image: "IMG_4512.jpeg",
    type: "free"
  },
  {
    id: 20,
    name: "Sunset Meadow Queen",
    category: "fantasy",
    tag: "4K • Fantasy • Free",
    image: "IMG_4520.jpeg",
    type: "free"
  },
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
// RENDER WALLPAPERS
// ==================================================

function renderWallpapers() {
  const container = document.getElementById("products");
  const searchInput = document.getElementById("search");
  const noResults = document.getElementById("noResults");

  // Prevent errors if the expected HTML elements are missing.
  if (!container || !searchInput || !noResults) {
    console.error(
      "REALNKEO: Missing products, search, or noResults element in index.html."
    );
    return;
  }

  const searchText = searchInput.value.trim().toLowerCase();

  let list = wallpapers;

  // CATEGORY FILTER
  if (currentCategory !== "all") {
    list = list.filter(
      wallpaper => wallpaper.category === currentCategory
    );
  }

  // SEARCH FILTER
  if (searchText !== "") {
    list = list.filter(
      wallpaper =>
        wallpaper.name.toLowerCase().includes(searchText) ||
        wallpaper.category.toLowerCase().includes(searchText) ||
        wallpaper.tag.toLowerCase().includes(searchText)
    );
  }

  // NO RESULTS
  if (list.length === 0) {
    container.innerHTML = "";
    noResults.style.display = "block";
    return;
  }

  noResults.style.display = "none";

  // CREATE WALLPAPER CARDS
  container.innerHTML = list.map(wallpaper => {
    let visual;

    // IMAGE
    if (wallpaper.image) {
      visual = `
        <div
          class="image"
          style="
            background-image: url('${wallpaper.image}');
            background-size: cover;
            background-position: center;
          "
          role="img"
          aria-label="${wallpaper.name}"
        ></div>
      `;
    } else {
      visual = `
        <div class="image">
          <div
            class="image-placeholder"
            style="
              --c1:${wallpaper.c1 || "#8b5cf6"};
              --c2:${wallpaper.c2 || "#ec4899"};
            "
          >
            ${wallpaper.name}
          </div>
        </div>
      `;
    }

    // FREE DOWNLOAD BUTTON
    let actionButton;

    if (wallpaper.image) {
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
          aria-label="Download ${wallpaper.name} for free"
        >
          Download Free
        </a>
      `;
    } else {
      actionButton = `
        <button
          class="download"
          type="button"
          onclick="comingSoon()"
        >
          Download Free
        </button>
      `;
    }

    // CARD
    return `
      <article class="card" style="position:relative;">
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

// ==================================================
// CATEGORY FILTER
// ==================================================

function filterWallpapers(category) {
  currentCategory = category;

  const filter = document.getElementById("filter");

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
// START WEBSITE
// ==================================================

renderWallpapers();
