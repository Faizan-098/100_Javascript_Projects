// YOUTUBE THUMBNAIL API KEY
const API_KEYS = [
  {
    url: "http://img.youtube.com/vi/<insert-youtube-video-id-here>/maxresdefault.jpg",
    size: "Maximum Resolution Image (1280 x 720)",
  },
  {
    url: "http://img.youtube.com/vi/<insert-youtube-video-id-here>/sddefault.jpg",
    size: "Standard Definition Image (640 x 480)",
  },
  {
    url: "http://img.youtube.com/vi/<insert-youtube-video-id-here>/hqdefault.jpg",
    size: "High Quality Image (480 x 360)",
  },
  {
    url: "http://img.youtube.com/vi/<insert-youtube-video-id-here>/mqdefault.jpg",
    size: "Medium Quality Image (320 x 180)",
  },
  {
    url: "http://img.youtube.com/vi/<insert-youtube-video-id-here>/default.jpg",
    size: "Normal Image (120 x 90)",
  },
];

// DOM ELEMENTS
const videoUrlInput = document.getElementById("video-url");
const extractBtn = document.getElementById("extract-btn");
const thumbnailsContainer = document.getElementById("thumbnails-container");
const mainContainer = document.querySelector("main");

// ON LOAD
onLoad();
function onLoad() {
  if (thumbnailsContainer.innerHTML.trim() === "") {
    const placeholder = document.createElement("p");
    placeholder.textContent = "No thumbnails to display!";
    placeholder.classList.add(
      "text-white/90",
      "text-center",
      "mt-10",
      "text-3xl",
      "text-center",
      "font-bold",
      "tracking-wide",
    );
    mainContainer.appendChild(placeholder);
  }
}

// EVENT LISTENER
extractBtn.addEventListener("click", () => {
  const videoUrl = videoUrlInput.value.trim();
  if (videoUrl) {
    const videoId = extractVideoId(videoUrl);
    if (videoId) {
      displayThumbnails(videoId);
    } else {
      alert("Please enter a valid YouTube video URL.");
    }
  } else {
    alert("Please enter a YouTube video URL.");
  }
});

// FUNCTION TO EXTRACT VIDEO ID FROM URL
function extractVideoId(url) {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([^\s&]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// FUNCTION TO DISPLAY THUMBNAILS
function displayThumbnails(videoId) {
  mainContainer.querySelector("p")?.remove();
  thumbnailsContainer.innerHTML = "";
  const thumbnailList = [];
  API_KEYS.forEach((key) => {
    const { url, size } = key;
    const thumbnailUrl = url.replace("<insert-youtube-video-id-here>", videoId);

    // THUMBNAIL CARD
    const thumbnailElement = document.createElement("div");
    thumbnailElement.classList.add(
      "group",
      "bg-white/15",
      "backdrop-blur-xl",
      "rounded-xl",
      "overflow-hidden",
      "shadow-lg",
      "hover:shadow-2xl",
      "transition",
      "duration-300",
    );

    // IMAGE
    const imageElement = document.createElement("img");
    imageElement.src = thumbnailUrl;
    imageElement.classList.add(
      "w-full",
      "h-full",
      "object-cover",
      "hover:scale-110",
      "transition",
      "duration-500",
    );
    const imageContainer = document.createElement("div");
    imageContainer.classList.add("aspect-video", "overflow-hidden");
    imageContainer.appendChild(imageElement);

    // CONTENT
    const contentElement = document.createElement("div");
    contentElement.classList.add("p-4", "flex", "flex-col", "gap-3");

    // LABEL + SIZE
    const labelElement = document.createElement("div");
    labelElement.classList.add("flex", "justify-between", "items-center");
    const sizeElement = document.createElement("span");
    sizeElement.classList.add(
      "text-md",
      "text-white",
      "font-medium",
      "tracking-wide",
    );
    sizeElement.textContent = size;
    labelElement.appendChild(sizeElement);

    // DOWNLOAD BUTTON
    const downloadBtn = document.createElement("button");
    downloadBtn.classList.add(
      "flex",
      "items-center",
      "justify-center",
      "gap-2",
      "w-full",
      "py-2",
      "rounded-lg",
      "bg-black/85",
      "hover:bg-black",
      "text-white",
      "transition",
      "cursor-pointer",
    );
    downloadBtn.addEventListener("click", () => {
      window.open(thumbnailUrl, "_blank");
    });

    const downloadIcon = document.createElement("i");
    downloadIcon.classList.add("ri-download-line");
    downloadBtn.appendChild(downloadIcon);
    const downloadText = document.createTextNode("Download Thumbnail");
    downloadBtn.appendChild(downloadText);

    // APPEND LABEL AND DOWNLOAD BUTTON TO CONTENT
    contentElement.appendChild(labelElement);
    contentElement.appendChild(downloadBtn);

    // APPEND IMAGE AND CONTENT TO THUMBNAIL CARD
    thumbnailElement.appendChild(imageContainer);
    thumbnailElement.appendChild(contentElement);

    // ADD THUMBNAIL CARD TO LIST
    thumbnailList.push(thumbnailElement);
  });

  // APPEND THUMBNAIL CARDS TO CONTAINER
  thumbnailsContainer.append(...thumbnailList);
}
