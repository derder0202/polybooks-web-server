document.addEventListener("DOMContentLoaded", function () {
  const toastMessage = getCookie("toastMessage");

  if (toastMessage) {
    showToastMessage(toastMessage);
    document.cookie = "toastMessage=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
});

function getCookie(name) {
  const value = "; " + document.cookie;
  const parts = value.split("; " + name + "=");
  if (parts.length === 2) return parts.pop().split(";").shift();
}

function showToastMessage(message) {
  const toast = document.getElementById("toast");
  const toastMessage = toast.querySelector(".toast__message");
  toastMessage.textContent = message;
  toast.classList.add("show");

  setTimeout(function () {
    toast.classList.remove("show");
  }, 3000);
}
