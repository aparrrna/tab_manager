document.addEventListener("DOMContentLoaded", () => {
  const inactiveButton = document.getElementById("inactiveTabsButton");
  const duplicateButton = document.getElementById("duplicateTabsButton");
  const displayButton = document.getElementById("displayAllTabsButton");

  inactiveButton.addEventListener("click", () => {
    window.location.href = "inactives.html"; // Navigate to inactive tabs page
  });

  duplicateButton.addEventListener("click", () => {
    window.location.href = "duplicates.html"; // Navigate to duplicate tabs page
  });

  displayButton.addEventListener("click", () => {
    window.location.href = "displayall.html";
  });
});