const elForm = document.querySelector(".form");
const elUsernameInput = document.querySelector(".username-input");
const elPasswordInput = document.querySelector(".password-input");

elForm.addEventListener("submit", function (evt) {
  evt.preventDefault();

  const usernameInputValue = elUsernameInput.value;
  const passwordInputValue = elPasswordInput.value;

  fetch("https://reqres.in/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: usernameInputValue,
      password: passwordInputValue,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data?.token) {
        window.localStorage.setItem("token", data.token);

        window.location.replace("index.html");
      } else {
        alert("Email yoki parol noto'g'ri!");
      }
    });
});
