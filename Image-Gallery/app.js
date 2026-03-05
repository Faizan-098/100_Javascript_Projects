const toggle = document.getElementById("themeToggle");
const search = document.getElementById("search");
const app = document.getElementById("app");
const loadBtn = document.getElementById("loadBtn");
let dark = true;

toggle.addEventListener("click", () => {
  dark = !dark;

  if (!dark) {
    app.classList.remove(
      "bg-[linear-gradient(145deg,#207347,#1e2032)]",
      "text-white",
    );
    app.classList.add("bg-white", "text-gray-800");
    toggle.innerHTML = `<i class="ri-sun-line"></i>`;
    search.classList.add("border-gray-100");
    search.classList.remove("border-white/20");
  } else {
    app.classList.remove("bg-white", "text-gray-800");
    app.classList.add(
      "bg-[linear-gradient(145deg,#207347,#1e2032)]",
      "text-white",
    );
    toggle.innerHTML = `<i class="ri-moon-line"></i>`;
    search.classList.remove("border-gray-100");
    search.classList.add("border-white/20");
  }
});

// ====== Main Logic ======

// API KEY
const API_KEY = "FJnlW9DznTP3DqTuZPs3XK0XeJ8Iz4a90J7UqvVj3wcA9oOymVO0Q5BX";
const options = {
  method: "GET",
  headers: {
    Authorization: API_KEY,
  },
};

// Helping Variable
let photoResourse = [];
let page = 1;
let query = "nature";

// Calling
onLoad();

// On Load Function
function onLoad() {
  fetchPhotos();
}

// Fetching Photos from Pexels API
async function fetchPhotos() {
  try {
    NProgress.start();
    loadBtn.disabled = true;
    loadBtn.innerHTML = `<i class="ri-loader-2-fill animate-spin"></i> Loading...`;
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${query}&per_page=12&page=${page}`,
      options,
    );
    const { photos } = await response.json();
    photoResourse = [...photoResourse, ...photos];

    if (!photoResourse.length) {
      photosContainer.innerHTML = `<h1 class="text-2xl font-bold text-center mt-10">No Photos Found</h1>`;
      loadBtn.style.display = "none";
      return;
    }

    displayPhotos();
  } catch (error) {
    console.log("error =>>>", error);
  } finally {
    NProgress.done();
    loadBtn.disabled = false;
    loadBtn.innerHTML = `Load More`;
  }
}

// Displaying Photos
function displayPhotos() {
  const photosContainer = document.getElementById("photosContainer");
  photosContainer.innerHTML = "";
  const gallaryCards = [];
  for (let i = 0; i < photoResourse.length; i++) {
    const { alt, src } = photoResourse[i];

    // Create Card Component
    const card = document.createElement("div");
    card.classList.add(
      "group",
      "relative",
      "rounded-2xl",
      "overflow-hidden",
      "shadow-x2l",
      "hover:shadow-2xl",
      "transition",
      "duration-500",
    );

    const img = document.createElement("img");
    img.classList.add(
      "w-full",
      "h-60",
      "object-cover",
      "transition",
      "duration-500",
      "group-hover:scale-110",
    );
    img.src = src.medium;
    img.alt = alt;
    const overlay = document.createElement("div");
    overlay.classList.add(
      "absolute",
      "inset-0",
      "bg-black/40",
      "opacity-0",
      "group-hover:opacity-100",
      "transition",
      "duration-500",
      "flex",
      "items-start",
      "justify-end",
      "p-3",
    );
    const button = document.createElement("button");
    button.addEventListener("click", () => {
      window.open(src.original, "_blank");
    });

    button.classList.add(
      "px-5",
      "py-3",
      "bg-emerald-500",
      "rounded-3xl",
      "hover:bg-emerald-600",
      "transition",
      "shadow-lg",
      "duration-300",
      "flex",
      "items-center",
      "gap-1",
      "cursor-pointer",
      "text-sm",
      "text-white",
    );
    button.innerHTML = `<i class="ri-download-line"></i> Download`;
    overlay.appendChild(button);

    card.appendChild(img);
    card.appendChild(overlay);
    gallaryCards.push(card);
  }

  // Append Cards In Container
  photosContainer.append(...gallaryCards);
}

// Load More Photos
loadBtn.addEventListener("click", () => {
  page++;
  fetchPhotos();
});

// Search Photos
search.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    if (!search.value.trim()) return;
    query = search.value;
    photoResourse = [];
    page = 1;
    fetchPhotos();
  }
});

// NProgress Configuration
NProgress.configure({
  showSpinner: false, // hides small spinner
  trickleSpeed: 100,
});
