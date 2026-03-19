// TARGET ELEMENTS
const uploadBtn = document.querySelector("#uploadBtn");
const cardContainer = document.querySelector("#cardContainer");
const error = document.querySelector("#error");
const spinner = document.querySelector("#spinner");

// HELPER VARAIBLES
let userFiles = JSON.parse(localStorage.getItem("files")) || [];

// UPLOAD IMAGE
uploadBtn.addEventListener("change", uploadImage);

// UPLOAD IMAGE
function uploadImage(e) {
  const file = e.target.files[0];
  const sizeInMbs = (file.size / (1024 * 1024)).toFixed(2);

  //   VALIDATE
  if (sizeInMbs > 5) {
    return alert("File size must be 5 or less");
  }

  if (!file.type.startsWith("image/")) {
    return alert("Please upload an image file");
  }

  spinner.classList.remove("hidden");

  // CONVERT FILE INTO BASE64
  const reader = new FileReader();
  reader.onload = function () {
    const base64Image = reader.result;

    userFiles.unshift({
      id: Date.now(),
      file: base64Image,
      filename: file.name,
      fileSize: file.size,
    });

    // SAVE IN DB
    localStorage.setItem("files", JSON.stringify(userFiles));

    //   DISPLAY CARDS
    displayCards();

    spinner.classList.add("hidden");
  };

  reader.readAsDataURL(file);
}

// DISPLAY CARDS
function displayCards() {
  const cards = [];
  cardContainer.innerHTML = "";
  if (userFiles.length === 0) {
    console.log("dd");
    console.log(userFiles);

    error.innerHTML = `<h1 class="text-center text-white text-4xl font-bold">You Have Not Files Yet !</h1>`;
    return;
  }
  error.innerHTML = ``;

  for (const { id, file, filename, fileSize } of userFiles) {
    // CREATE CARD
    const card = document.createElement("div");
    card.className = "card bg-base-100 shadow-sm";

    // figure
    const figure = document.createElement("figure");
    figure.className = "overflow-hidden max-h-[200px]";

    // image
    const img = document.createElement("img");
    img.className = "hover:scale-110 w-full  transform duration-300";
    img.src = file;
    img.alt = filename;

    figure.appendChild(img);

    // card body
    const cardBody = document.createElement("div");
    cardBody.className = "card p-3";

    // title
    const title = document.createElement("h2");
    title.className = "card-title font-bold text-gray-700 text-lg";
    title.textContent = filename;

    // size
    const size = document.createElement("p");
    size.className = "text-gray-500 font-medium tracking-wide";
    size.textContent = (fileSize / (1024 * 1024)).toFixed(2) + "Mbs";

    // actions
    const actions = document.createElement("div");
    actions.className = "card-actions justify-end";

    // download button
    const downloadBtn = document.createElement("button");
    downloadBtn.className = "btn bg-green-500";
    downloadBtn.addEventListener("click", () => downloadFile(filename, file));

    const downloadIcon = document.createElement("i");
    downloadIcon.className = "ri-download-line text-white text-lg";

    downloadBtn.appendChild(downloadIcon);

    // delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn bg-red-500";
    deleteBtn.addEventListener("click", () => deleteFile(id));

    const deleteIcon = document.createElement("i");
    deleteIcon.className = "ri-delete-bin-6-line text-lg text-white";

    deleteBtn.appendChild(deleteIcon);

    // append buttons
    actions.appendChild(downloadBtn);
    actions.appendChild(deleteBtn);

    // append body elements
    cardBody.appendChild(title);
    cardBody.appendChild(size);
    cardBody.appendChild(actions);

    // append error elements
    card.appendChild(figure);
    card.appendChild(cardBody);

    // append to cards
    cards.push(card);
  }

  cardContainer.append(...cards);
}
displayCards();

// DELETE FILE FROM STORAGE
function deleteFile(id) {
  const images = JSON.parse(localStorage.getItem("files")) || [];
  userFiles = images.filter((file) => {
    return Number(file.id) !== Number(id);
  });

  localStorage.setItem("files", JSON.stringify(userFiles));

  //   DISPLAY CARDS
  displayCards();
}

// DOWNLOAD FILE
function downloadFile(filename, file) {
  const a = document.createElement("a");
  a.href = file;
  a.download = filename;

  a.click();
  a.remove();
}
