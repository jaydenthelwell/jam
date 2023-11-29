document.addEventListener("DOMContentLoaded", function() {
  var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  console.log("Screen width")
  if (screenWidth > 768) {
      var popup = document.getElementById("mobilePopup");
      popup.style.display = "block";
  }
});
