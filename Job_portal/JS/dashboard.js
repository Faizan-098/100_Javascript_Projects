let user = JSON.parse(localStorage.getItem("loggedinUser"));
let users = JSON.parse(localStorage.getItem("users"));
if (!user) {
  window.location.href = "../signin.html";
}

// TARGET ELEMENTS
const editBtn = document.querySelector("#editBtn");
const logoutBtn = document.querySelector("#logoutBtn");
const updateBTn = document.querySelector("#updateProfile");
console.log(updateBTn);

function displayProfile() {
  const name = document.querySelector("#name");
  const description = document.querySelector("#description");
  const email = document.querySelector("#email");
  const username = document.querySelector("#username");

  name.innerText = `${user.firstName} ${user.lastName}`;
  description.innerText = user?.description || " No description yet!";
  email.innerText = user.email;
  username.innerText = user.userName;
}

displayProfile();

// EVENT LISTENERS
logoutBtn.addEventListener("click", logout);
editBtn.addEventListener("click", editProfile);
updateBTn.addEventListener("click", updateProfile);

// LOGOUT
function logout() {
  localStorage.removeItem("loggedinUser");
  window.location.href = "../signin.html";
}

// EDIT
function editProfile() {
  //  TARGET ELEMENTS
  const firstName = document.querySelector("#firstName");
  const lastName = document.querySelector("#lastName");
  const userName = document.querySelector("#userName");
  const userEmail = document.querySelector("#userEmail");
  const userDescription = document.querySelector("#userDescription");

  // SET USER DATA
  firstName.value = user.firstName;
  lastName.value = user.lastName;
  userEmail.value = user.email;
  userName.value = user.userName;
  userDescription.value = user.description || "Type your bio!";
}

function updateProfile() {
  //  TARGET ELEMENTS
  const firstName = document.querySelector("#firstName");
  const lastName = document.querySelector("#lastName");
  const userName = document.querySelector("#userName");
  const userEmail = document.querySelector("#userEmail");
  const userDescription = document.querySelector("#userDescription");

  // VALIDATE
  if (
    !firstName.value ||
    !lastName.value ||
    !userName.value ||
    !userEmail.value
  ) {
    return alert("All fields are required except bio!");
  }

  // UPDATE LOGGEDIN USER PROFILE
  user.firstName = firstName.value;
  user.lastName = lastName.value;
  user.email = userEmail.value;
  user.userName = userName.value;
  user.description = userDescription.value;

  // SAVE IN DB
  localStorage.setItem("loggedinUser", JSON.stringify(user));

  // FIND USER BY EMAIL AND UPDATE
  let findUser = null;

  for (const user of users) {
    if (user.email === userEmail.value) {
      findUser = user;
      break;
    }
  }

  if (!findUser) {
    return alert("User is not found!");
  }

  findUser.firstName = firstName.value;
  findUser.lastName = lastName.value;
  findUser.email = userEmail.value;
  findUser.userName = userName.value;
  findUser.description = userDescription.value;

  //SAVE IN DB
  localStorage.setItem("users", JSON.stringify(users));

  // DISPLAY PROFILE
  displayProfile();
}
