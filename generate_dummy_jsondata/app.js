import { faker } from "https://cdn.skypack.dev/@faker-js/faker";

/**
 * Target Elements
 */
const displayJson = document.querySelector("#displayJson");
const selectElem = document.querySelector("#selectInp");
const numberElem = document.querySelector("#numberInp");
const rangElem = document.querySelector("#rangInp");
const generateBtn = document.querySelector("#generateBtn");
const downloadBtn = document.querySelector("#downloadBtn");
const copyBtn = document.querySelector("#copyBtn");
let jsonData = [];

/**
 * EventListners
 */
numberElem.addEventListener("change", setRangeValue);
rangElem.addEventListener("change", setNumberValue);
generateBtn.addEventListener("click", generateJsonData);
downloadBtn.addEventListener("click", downloadJsonData);
copyBtn.addEventListener("click", copyJsonData);

/**
 * Set Range Value
 */
function setRangeValue(e) {
  rangElem.value = e.target.value;
}

/**
 * Set Range Value
 */
function setNumberValue(e) {
  numberElem.value = e.target.value;
}

/**
 * Generate Json Data
 */
function generateJsonData() {
  jsonData = [];
  if (numberElem.value > 100 || numberElem.value < 1) {
    return alert("length must be between 1-100");
  }
  for (let i = 1; i <= numberElem.value; i++) {
    if (selectElem.value === "users") {
      jsonData.push(generateUserJsonData());
    } else if (selectElem.value === "jobs") {
      jsonData.push(generateJobJsonData());
    } else if (selectElem.value === "products") {
      jsonData.push(generateProductJsonData());
    } else if (selectElem.value === "posts") {
      jsonData.push(generatePostJsonData());
    } else if (selectElem.value === "notifications") {
      jsonData.push(generateNotificationJsonData());
    } else if (selectElem.value === "orders") {
      jsonData.push(generateOrderJsonData());
    } else if (selectElem.value === "comments") {
      jsonData.push(generateCommentJsonData());
    } else if (selectElem.value === "chats") {
      jsonData.push(generateChatJsonData());
    } else if (selectElem.value === "companies") {
      jsonData.push(generateCompanyJsonData());
    }
  }

  displayJsonData(jsonData);
}

generateJsonData();

/**
 * Display Json Data
 */
function displayJsonData(data) {
  const displayJson = document.querySelector("#displayJson");
  const itemsCount = document.querySelector("#itemsCount");
  const json = JSON.stringify(data, null, 2);

  displayJson.innerHTML = hljs.highlight(json, {
    language: "json",
  }).value;

  itemsCount.innerHTML = data.length;
}

/**
 * Generate User Json Data
 */
function generateUserJsonData() {
  return {
    id: Date.now(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    gender: faker.person.gender(),
    number: Number(faker.phone.number({ style: "international" })),
    city: faker.location.city(),
    state: faker.location.state(),
    country: faker.location.country(),
    latitude: faker.location.latitude({ max: 10 }),
    longitude: faker.location.longitude({ max: 10 }),
    address: faker.location.streetAddress({ useFullAddress: true }),
  };
}

/**
 * Generate Product Json Data
 */
function generateProductJsonData() {
  return {
    id: Date.now(),
    title: faker.commerce.productName(),
    price: faker.commerce.price(),
    description: faker.commerce.productDescription(),
    category: faker.commerce.department(),
    image: faker.image.url(),
    rating: faker.number.float({ min: 1, max: 5, precision: 0.1 }),
    stock: faker.number.int({ min: 0, max: 500 }),
  };
}

/**
 * Generate Company Json Data
 */
function generateCompanyJsonData() {
  return {
    id: Date.now(),
    name: faker.company.name(),
    industry: faker.company.buzzPhrase(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    website: faker.internet.url(),
    address: faker.location.streetAddress(),
  };
}

/**
 * Generate Job Json Data
 */
function generateJobJsonData() {
  return {
    id: Date.now(),
    title: faker.person.jobTitle(),
    type: faker.helpers.arrayElement(["Full-Time", "Part-Time", "Remote"]),
    salary: faker.number.int({ min: 20000, max: 200000 }),
    company: faker.company.name(),
    location: faker.location.city(),
    description: faker.lorem.paragraph(),
  };
}

/**
 * Generate Blog/Post Json Data
 */
function generatePostJsonData() {
  return {
    id: Date.now(),
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(2),
    author: faker.person.fullName(),
    createdAt: faker.date.recent(),
    likes: faker.number.int({ min: 0, max: 1000 }),
  };
}

/**
 * Generate Comment Json Data
 */
function generateCommentJsonData() {
  return {
    id: Date.now(),
    username: faker.internet.username(),
    comment: faker.lorem.sentence(),
    createdAt: faker.date.recent(),
  };
}

/**
 * Generate Order Json Data
 */
function generateOrderJsonData() {
  return {
    id: Date.now(),
    user: faker.person.fullName(),
    product: faker.commerce.productName(),
    quantity: faker.number.int({ min: 1, max: 5 }),
    totalPrice: faker.commerce.price(),
    status: faker.helpers.arrayElement(["Pending", "Shipped", "Delivered"]),
    date: faker.date.recent(),
  };
}

/**
 * Generate Chat Message Json Data
 */
function generateChatJsonData() {
  return {
    id: Date.now(),
    sender: faker.internet.username(),
    message: faker.lorem.sentence(),
    time: faker.date.recent(),
    isRead: faker.datatype.boolean(),
  };
}

/**
 * Generate Notification Json Data
 */

function generateNotificationJsonData() {
  return {
    id: Date.now(),
    title: faker.lorem.words(3),
    message: faker.lorem.sentence(),
    type: faker.helpers.arrayElement(["info", "success", "warning", "error"]),
    isRead: faker.datatype.boolean(),
    createdAt: faker.date.recent(),
  };
}

/**
 * Display Current Date
 */
function displayCurrentDate() {
  const displayDate = document.querySelector("#displayDate");
  const curDate = new Date().toLocaleTimeString();
  displayDate.innerHTML = curDate;
}

setInterval(() => displayCurrentDate(), 1000);

/**
 * Download Json Data
 */
function downloadJsonData() {
  const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
    type: "application/json",
  });
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = "JsonData.json";
  a.click();

  URL.revokeObjectURL(url);
}

/**
 * Copy Json Data
 */
function copyJsonData() {
  navigator.clipboard.writeText(JSON.stringify(jsonData));
}
