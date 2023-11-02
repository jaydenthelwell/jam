document.addEventListener("DOMContentLoaded", () => {
  const chat = document.getElementById("chat");

  chat.addEventListener("click", () => {
    chat.classList.remove("d-none");
  });
});
