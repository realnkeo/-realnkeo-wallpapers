const wallpapers = [

  {
    id: 1,
    name: "Pink Coastal Dream",
    category: "mobile",
    tag: "HD • Mobile",
    image: "IMG_3979.JPG"
  },

  {
    id: 2,
    name: "Cyber Warrior",
    category: "gaming",
    tag: "4K • Gaming",
    c1: "#bd7cff",
    c2: "#21103a"
  },

  {
    id: 3,
    name: "Purple Dream",
    category: "mobile",
    tag: "4K • Mobile",
    c1: "#e4a4ff",
    c2: "#32165b"
  },

  {
    id: 4,
    name: "Anime Night",
    category: "anime",
    tag: "4K • Anime",
    c1: "#7bd6ff",
    c2: "#101d3a"
  },

  {
    id: 5,
    name: "Moon Forest",
    category: "nature",
    tag: "4K • Nature",
    c1: "#8cffd0",
    c2: "#102f2a"
  },

  {
    id: 6,
    name: "Neon Battle",
    category: "gaming",
    tag: "4K • Gaming",
    c1: "#ff5bd8",
    c2: "#36102e"
  },

  {
    id: 7,
    name: "Sakura Sky",
    category: "anime",
    tag: "4K • Anime",
    c1: "#ffb5e6",
    c2: "#3d1738"
  },

  {
    id: 8,
    name: "Cosmic Earth",
    category: "nature",
    tag: "4K • Nature",
    c1: "#70a7ff",
    c2: "#111b3c"
  },

  {
    id: 9,
    name: "Dark Gaming",
    category: "gaming",
    tag: "HD • Gaming",
    c1: "#ff6b6b",
    c2: "#331314"
  }

];


function renderWallpapers(category = "all") {

  const container = document.getElementById("products");

  const list =
    category === "all"
      ? wallpapers
      : wallpapers.filter(
          wallpaper => wallpaper.category === category
        );


  container.innerHTML = list.map(wallpaper => {

    let visual = "";

    if (wallpaper.image) {

      visual = `
        <div
          class="image"
          style="
            background-image:url('${wallpaper.image}');
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


    const downloadButton = wallpaper.image

      ? `
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
      `

      : `
        <button
          class="download"
          onclick="comingSoon()"
        >
          Download Free
        </button>
      `;


    return `

      <article class="card">

        ${visual}

        <div class="card-content">

          <h3>
            ${wallpaper.name}
          </h3>

          <div class="meta">
            ${wallpaper.tag}
          </div>

          ${downloadButton}

        </div>

      </article>

    `;

  }).join("");

}


function filterWallpapers(category) {

  document.getElementById("filter").value = category;

  renderWallpapers(category);

}


function comingSoon() {

  alert(
    "This wallpaper is coming soon. More free wallpapers will be added soon!"
  );

}


renderWallpapers();
