// Run this code after the HTML page has loaded.
document.addEventListener("DOMContentLoaded", () => {
  console.log("Welcome to Saltyre Rock!");

  const mapOpenButton = document.querySelector("#map-open");
  const mapDialog = document.querySelector("#map-dialog");
  const mapCloseButton = document.querySelector(".map-dialog-close");

  if (!mapOpenButton || !mapDialog || !mapCloseButton) return;

  mapOpenButton.addEventListener("click", () => {
    mapDialog.showModal();
    mapCloseButton.focus();
  });

  mapCloseButton.addEventListener("click", () => {
    mapDialog.close();
  });

  mapDialog.addEventListener("click", (event) => {
    if (event.target === mapDialog) mapDialog.close();
  });
});
