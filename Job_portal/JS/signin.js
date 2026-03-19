const isLoggedIn = JSON.parse(localStorage.getItem("isLoggedinUser"));

if (isLoggedIn) {
  window.location.href = "./pages/dashboard.html";
}

const signinForm = document.getElementById("signinForm");
signinForm.addEventListener("submit", (e) => {
  e.preventDefault();
  userSignin();
});

function userSignin() {
  //   TARGET ELEMENTS
  const email = document.querySelector("#email");
  const password = document.querySelector("#password");

  // VALIDATION
  if (!email.value || !password.value) {
    return alert("All fields are required!");
  }

  // CHECK EMAIL EXISTS OR NOT
  const users = JSON.parse(localStorage.getItem("users")) || [];
  let isExists = true;
  let user = null;
  for (user of users) {
    if (user.email == email.value) {
      user = user;
      isExists = true;
      break;
    }
    isExists = false;
  }

  if (!isExists) {
    return alert("Dont have an account, please create your account!");
  }

  if (password.value !== user.password) {
    return alert("Incorrect password!");
  }

  // LOGGEDIN USER
  localStorage.setItem("loggedinUser", JSON.stringify(user));

  // DIVERT TO DASHBOARD
  window.location.href = "./pages/dashboard.html";
}
