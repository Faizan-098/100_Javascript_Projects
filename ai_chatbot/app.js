// TARGET ELEMENTS
const chatInput = document.querySelector("#chatInput");
const chatBtn = document.querySelector("#chatBtn");
const emojiBtn = document.querySelector("#emojiBtn");
const pickerContainer = document.getElementById("picker-container");
const chatContainer = document.querySelector("#chatContainer");
const chatHistory = document.querySelector("#chatHistory");
const sidebar = document.querySelector("#sidebar");
const createChatBtn = document.querySelector("#createChatBtn");
const allChats = JSON.parse(localStorage.getItem("all-chats")) || [];
let activeChat = JSON.parse(localStorage.getItem("activeChat")) || "";

// Display chats & histories
displayActiveChat(activeChat);
displayChatHistory();

// 1. Set up your configuration
const API_KEY = "AIzaSyB9F1wfom5aKnP_hrBsnl6cAQUh6wdryPo";
const url =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

// Create the async function to make the call
async function generateChatResponse(userMessage) {
  const userComponent = getUserUI(userMessage);
  const chatComponent = getChatUI("Typing...");

  // Append user component
  chatContainer.appendChild(userComponent);
  chatContainer.appendChild(chatComponent);

  // Define the payload
  const payload = {
    contents: [
      {
        parts: [{ text: `Answer must be in short : ${userMessage}` }],
      },
    ],
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": API_KEY,
      },
      body: JSON.stringify(payload),
    });

    // Check if the request was successful
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, details: ${errorText}`,
      );
    }

    // 4. Parse and use the response
    let data = await response.json();

    // Extract just the generated text
    if (data.candidates && data.candidates.length > 0) {
      const chatMessage = data.candidates[0].content.parts[0].text;
      const newChatComponent = getChatUI(chatMessage);
      chatContainer.appendChild(newChatComponent);

      // Save in db
      const message = {
        user: userMessage,
        model: chatMessage,
      };

      // Find current chat and push message
      const findCurrentChat = allChats.find(
        (chat) => chat.id === activeChat.id,
      );
      if (findCurrentChat.messages.length === 0) {
        findCurrentChat.title = generateTitle(chatMessage);
      }
      findCurrentChat.messages.push(message);

      activeChat = findCurrentChat;

      localStorage.setItem("activeChat", JSON.stringify(activeChat));
      localStorage.setItem("all-chats", JSON.stringify(allChats));

      displayChatHistory(activeChat);
    }
  } catch (error) {
    console.log(`Fetch error ${error}`);
  } finally {
    chatComponent.remove();
    chatInput.disabled = false;
  }
}

// ADD EVENTLISTNERS
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    getUserInput();
  }
});

emojiBtn.addEventListener("click", displayEmoji);

chatBtn.addEventListener("click", getUserInput);

createChatBtn.addEventListener("click", createNewChat);

// GET USER INPUT
function getUserInput() {
  if (!chatInput.value.trim()) {
    return alert("Type valid input!");
  }

  // GENERATE RESPONSE
  generateChatResponse(chatInput.value.trim());

  // Empty field
  chatInput.value = "";
  chatInput.disabled = true;
}

// GET CHAT UI
function getChatUI(modelMessage) {
  // Main container
  const messageWrapper = document.createElement("div");
  messageWrapper.className = "flex items-start gap-4 max-w-4xl mx-auto";

  // Icon container
  const iconBox = document.createElement("div");
  iconBox.className =
    "flex-shrink-0 h-9 w-9 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center shadow-sm";

  // Icon
  const icon = document.createElement("i");
  icon.className = "ri-openai-fill text-purple-400 text-xl";

  // Append icon
  iconBox.appendChild(icon);

  // Message container
  const messageContainer = document.createElement("div");
  messageContainer.className = "flex-1 space-y-2 mt-1";

  // Text wrapper
  const textWrapper = document.createElement("div");
  textWrapper.className = "text-gray-200 text-sm sm:text-base leading-relaxed";

  // Paragraph
  const messageText = document.createElement("p");
  messageText.textContent = modelMessage;

  // Append structure
  textWrapper.appendChild(messageText);
  messageContainer.appendChild(textWrapper);

  messageWrapper.appendChild(iconBox);
  messageWrapper.appendChild(messageContainer);
  return messageWrapper;
}

// GET USER UI
function getUserUI(userMessage) {
  // main wrapper
  const wrapper = document.createElement("div");
  wrapper.className =
    "flex items-start gap-4 max-w-4xl mx-auto flex-row-reverse";

  // avatar
  const avatar = document.createElement("div");
  avatar.className =
    "flex-shrink-0 h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md";

  avatar.textContent = "SE";

  // message container
  const messageContainer = document.createElement("div");
  messageContainer.className = "flex-1 space-y-2 flex flex-col items-end mt-1";

  // message bubble
  const bubble = document.createElement("div");
  bubble.className =
    "bg-gray-800/80 border border-gray-700 text-gray-100 px-5 py-3.5 rounded-2xl rounded-tr-sm text-sm sm:text-base max-w-[85%] shadow-sm";

  // paragraph
  const messageText = document.createElement("p");
  messageText.textContent = userMessage;

  // append structure
  bubble.appendChild(messageText);
  messageContainer.appendChild(bubble);

  wrapper.appendChild(avatar);
  wrapper.appendChild(messageContainer);

  return wrapper;
}

// GET ALL CHATS
function displayActiveChat(activeUserChat) {
  console.log(activeUserChat);

  if (activeChat && activeUserChat.messages.length > 0) {
    chatContainer.innerHTML = "";
    const { messages } = activeUserChat;

    for (const chat of messages) {
      const userMessage = getUserUI(chat.user);
      const chatMessage = getChatUI(chat.model);
      chatContainer.appendChild(userMessage);
      chatContainer.appendChild(chatMessage);
    }
  } else {
    chatContainer.innerHTML = `<h1 class=" text-2xl md:text-4xl font-bold tracking-wide text-white text-center">Welcome To AI Chat Assistant</h1>`;
  }
}

// DISPLAY EMOJI BOX
function displayEmoji() {
  pickerContainer.innerHTML = "";
  const pickerOptions = {
    // Fetch emoji data from the CDN
    data: async () => {
      const response = await fetch(
        "https://cdn.jsdelivr.net/npm/@emoji-mart/data",
      );
      return response.json();
    },
    // Callback function when an emoji is selected
    onEmojiSelect: (emoji) => {
      console.log(emoji); // Log the emoji object to the console
      document.getElementById("chatInput").value += emoji.native;
    },
  };

  // Create a new picker instance
  const picker = new EmojiMart.Picker(pickerOptions);

  // Append the picker to the container in the DOM
  pickerContainer.appendChild(picker);
}

// CLOSE EMOJI BOX
window.addEventListener("click", (e) => {
  if (e.target.id !== "emojiBtn" && e.target.tagName != "EM-EMOJI-PICKER") {
    pickerContainer.innerHTML = "";
  }
});

// CLOSE ASIDE BAR
function closeAsidebar() {
  sidebar.classList.remove("translate-x-[0px]");
  sidebar.classList.add("-translate-x-[300px]");
}

// OPEN SIDE BAR
function openSidebar() {
  console.log("dd");
  sidebar.classList.add("translate-x-[0px]");
  sidebar.classList.remove("-translate-x-[300px]");
}

// CREATE NEW CHAT
function createNewChat() {
  // const chat = new CreatChat()
  const date = new Date().toLocaleDateString();
  const chat = new CreatChat(Date.now(), "", date);
  allChats.push(chat);
  activeChat = chat;
  console.log(allChats, activeChat);
  displayActiveChat(activeChat);

  localStorage.setItem("all-chats", JSON.stringify(allChats));
  localStorage.setItem("activeChat", JSON.stringify(activeChat));
}

// CHAT BLUEPRINT
function CreatChat(id, title, createdAt) {
  this.id = id;
  this.title = title;
  this.createdAt = createdAt;
  this.messages = [];
}

// GENERATE TITLE
function generateTitle(chatMessage) {
  return chatMessage.split(" ").length > 5
    ? chatMessage.split(" ").slice(0, 5).join(" ")
    : chatMessage;
}

// DISPLAY HISTORY
function displayChatHistory() {
  chatHistory.innerHTML = "";

  for (const chat of allChats) {
    // 1. Create the main button container
    const button = document.createElement("button");
    button.className = `w-full cursor-pointer flex items-center gap-3 px-3 py-3 ${activeChat.id === chat.id ? "bg-gray-800/60" : "hover:bg-gray-800/60"}  text-gray-200 rounded-lg group text-left transition-all hover:bg-gray-800`;

    // 2. Create the Icon (Remix Icon)
    const icon = document.createElement("i");
    icon.className =
      "ri-message-3-line text-purple-400 group-hover:scale-110 transition-transform";

    // 3. Create the Title Span
    const span = document.createElement("span");
    span.className = "text-sm truncate font-medium flex-1";
    span.textContent = chat.title || "New Chat";

    // 4. Assemble the pieces
    button.appendChild(icon);
    button.appendChild(span);

    // Add eventlistner
    button.addEventListener("click", () => {
      activeChat = chat;
      displayActiveChat(chat);
      displayChatHistory();
      localStorage.setItem("activeChat", JSON.stringify(activeChat));
    });

    chatHistory.appendChild(button);
  }
}
