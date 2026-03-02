// import { Notify } from 'notiflix/build/notiflix-notify-aio';

const gradientContainer = document.querySelector(".gradient-grid");
const generateBtn = document.querySelector("#generateBtn");
const gradientLength = document.querySelector("#gradientLength");
const gradientType = document.querySelector("#gradientType");
const copyBtn = document.querySelector("#copyBtn");

let gradientCardItemList = [];

// Generate Hex Color Code
function generateHexCode() {
  const rgb = 255 * 255 * 255; //6575757567

  const randomDecimal = Math.random() * rgb;
  const removeDecimal = Math.floor(randomDecimal);
  const hexCode = removeDecimal.toString(16);
  const hexColorCode = `#${hexCode.padStart(6, "0")}`;
  return hexColorCode;
}

// Generate Gradient And Display
function generateGredient(num) {
  // Clear Gradient Container
  gradientContainer.innerHTML = "";
  gradientCardItemList = [];
  for (let i = 1; i <= num; i++) {
    // Format Gradient Color
    const color1 = generateHexCode();
    const color2 = generateHexCode();
    // const color3 = generateHexCode();
    const degree = Math.floor(Math.random() * 360);
    let gradient;
    let gradientProperty;
    if (gradientType.value === "radial") {
      gradient = `radial-gradient(circle , ${color1}, ${color2})`;
      gradientProperty = `'background : ${gradient}'`;
    } else if (gradientType.value === "linear") {
      gradient = `linear-gradient(${degree}deg,${color1},${color2})`;
      gradientProperty = `'background : ${gradient}'`;
    } else {
      gradient = `conic-gradient(from ${degree}deg,${color1},${color2})`;
      gradientProperty = `'background : ${gradient}'`;
    }

    // Create Card Element
    const card = document.createElement("div");
    card.setAttribute("class", "gradient-card");
    card.style.background = gradient;

    const btn = document.createElement("button");
    btn.setAttribute("class", "copy-btn");
    btn.innerText = "Copy";
    btn.setAttribute("onclick", `onCopy(${gradientProperty})`);

    card.appendChild(btn);

    // Push Card Element In Array
    gradientCardItemList.push(card);
  }

  // Display
  gradientContainer.append(...gradientCardItemList);
}

generateGredient(12);

// Tragger Function When Call it
generateBtn.addEventListener("click", function () {
  if (gradientLength.value < 4) {
    return alert("Length must be 4 or greater!");
  }
  generateGredient(gradientLength.value);
});

// Copy CSS Property
function onCopy(property) {
  navigator.clipboard.writeText(property);

  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title: "Copied to clipboard!",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    background: "#111",
    color: "#fff",
  });
}
