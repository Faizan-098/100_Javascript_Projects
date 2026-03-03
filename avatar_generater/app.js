// Avatar Data
const avatarSources = [
  {
    label: "Illustration",
    value: "illustration",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=",
  },
  {
    label: "Cartoon",
    value: "cartoon",
    url: "https://api.dicebear.com/7.x/adventurer/svg?seed=",
  },
  {
    label: "Sketchy",
    value: "sketchy",
    url: "https://api.dicebear.com/7.x/croodles/svg?seed=",
  },
  {
    label: "Robots",
    value: "robots",
    url: "https://api.dicebear.com/7.x/bottts/svg?seed=",
  },
  {
    label: "Art",
    value: "art",
    url: "https://api.dicebear.com/7.x/pixel-art/svg?seed=",
  },
  {
    label: "Men",
    value: "men",
    url: "https://randomuser.me/portraits/men/",
  },
  {
    label: "Women",
    value: "women",
    url: "https://randomuser.me/portraits/women/",
  },
];

// Target Elements
const changeAvatar = document.querySelector("#changeAvatar");
const downloadAvatar = document.querySelector("#downloadAvatar");
const copyAvatar = document.querySelector("#copyAvatar");
const avatar = document.querySelector("#avatar");
const avatarUrl = document.querySelector("#avatarUrl");
const avatarType = document.querySelector("#avatarType");

// Call On Load
displayAvatarType();

// Change Avatar
changeAvatar.addEventListener("click", generateAvatar);

// Change Avatar Type
avatarType.addEventListener("change", generateAvatar);

// Copy Avatar Url
copyAvatar.addEventListener("click", onCopy);

// Download Avatar Url
downloadAvatar.addEventListener("click", downLoad);

// Display Avatar Types
function displayAvatarType() {
  const optList = [];
  for (let i = 0; i < avatarSources.length; i++) {
    // Destructure Property
    const { label, value } = avatarSources[i];

    // Create Element
    const opt = document.createElement("option");
    opt.setAttribute("value", value);
    opt.innerText = label;

    // Push In Array
    optList.push(opt);
  }

  avatarType.append(...optList);

  // Generate AvatarF
  generateAvatar();
}

// Generate Avatar
function generateAvatar(e) {
  const randomNum = Math.floor(Math.random() * 99) + 1;
  let formateUrl = "";

  if (e?.type === "change") {
    const { url } = avatarSources.find((av) => av.value === e.target.value);
    if (e.target.value === "men" || e.target.value === "women") {
      formateUrl = `${url}${randomNum}.jpg`;
      avatarUrl.innerText = formateUrl;
    } else {
      formateUrl = `${url}${Date.now()}`;
      avatarUrl.innerText = formateUrl;
    }
    avatar.src = formateUrl;
    return;
  }

  const { url } = avatarSources.find((av) => av.value === avatarType.value);
  if (avatarType.value === "men" || avatarType.value === "women") {
    formateUrl = `${url}${randomNum}.jpg`;
    avatarUrl.innerText = formateUrl;
  } else {
    formateUrl = `${url}${Date.now()}`;
    avatarUrl.innerText = formateUrl;
  }
  avatar.src = formateUrl;
}

// Copy Avatar
function onCopy() {
  navigator.clipboard.writeText(avatar.src);

  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title: "Copied to clipboard!",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    background: "#111",
    color:"white"
  });
}

// Download Avatar
function downLoad() {
  const a = document.createElement("a");
  a.href = avatar.src;
  a.click();
  a.remove();
}
