const isLoggedIn = JSON.parse(localStorage.getItem("isLoggedinUser"));
if(isLoggedIn){
   window.location.href='./dashboard.html'
}

const signupForm = document.getElementById("signupForm");
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  userSignup();
});

// USER SIGNUP
function userSignup() {
  //  TARGET ELEMENTS
  const firstName = document.querySelector("#firstName");
  const lastName = document.querySelector("#lastName");
  const userName = document.querySelector("#userName");
  const email = document.querySelector("#email");
  const password = document.querySelector("#password");
  const confirmPassword = document.querySelector("#confirmPassword");

  // VALIDATION
  if (
    !firstName.value ||
    !lastName.value ||
    !userName.value ||
    !email.value ||
    !password.value ||
    !confirmPassword.value
  ) {
    return alert("All fields are required!");
  }

  // CHECK EMAIL EXISTS OR NOT
  const users = JSON.parse(localStorage.getItem("users")) || [];
  let isExist = false;
  if (users.length > 0) {
    for (const user of users) {
      if (user.email === email.value) {
        isExist = true;
        console.log(user.email, email);

        alert("Email is already exits!");
      }
    }
  }

  if (isExist) {
    return;
  }

  // CHECK PASSWORD LENGTH
  if (password.value.length < 8) {
    return alert("Password length must be 8 or greater!");
  }

  // CHECK PASSWORD AND CONFIRM PASSWORD
  if (password.value !== confirmPassword.value) {
    return alert("Password and confirm do not match!");
  }

  // CREATE USER
  const user = new User(
    firstName.value,
    lastName.value,
    userName.value,
    email.value,
    password.value,
  );

  users.push(user);

  // SAVE IN DB
  localStorage.setItem("users", JSON.stringify(users));

  // DIVERT TO SIGNIN
    window.location.href = "../signin.html";
}

// CREATE USER
function User(firstName, lastName, userName, email, password) {
  this.firstName = firstName;
  this.lastName = lastName;
  this.userName = userName;
  this.email = email;
  this.password = password;
}
