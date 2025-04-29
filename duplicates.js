document.addEventListener("DOMContentLoaded", async () => {
    const duplicateTabsList = document.getElementById("duplicateTabsList");
    const deleteDuplicatesButton = document.getElementById("deleteDuplicates");
    const duplicateMessage = document.getElementById("duplicateMessage");
    const backButton = document.getElementById("backToMain");
  
    // Function to fetch and display duplicate tabs
    async function showDuplicateTabs() {
      duplicateTabsList.innerHTML = ""; // Clear the list
      duplicateMessage.classList.add("hidden"); // Hide message
      deleteDuplicatesButton.classList.add("hidden"); // Hide delete button initially
  
      // Get all tabs
      const tabs = await chrome.tabs.query({});
      const urls = new Set(); // To track unique URLs
      const duplicateTabs = tabs.filter((tab) => {
        if (urls.has(tab.url)) {
          return true; // This is a duplicate
        }
        urls.add(tab.url); // Add URL to the set
        return false;
      });
  
      // Display message or list duplicates
      if (duplicateTabs.length === 0) {
        duplicateMessage.textContent = "No duplicate tabs found!";
        duplicateMessage.classList.remove("hidden");
      } else {
        // Populate the duplicate tabs list
        duplicateTabs.forEach((tab) => {
          const listItem = document.createElement("li");
          listItem.textContent = `${tab.title || "Untitled Tab"} (${tab.url})`;
          duplicateTabsList.appendChild(listItem);
        });
  
        deleteDuplicatesButton.classList.remove("hidden"); // Show delete button
      }
  
      // Handle click for deleting duplicate tabs
      deleteDuplicatesButton.onclick = async () => {
        const duplicateTabIds = duplicateTabs.map((tab) => tab.id);
  
        try {
          // Delete tabs asynchronously
          await Promise.all(
            duplicateTabIds.map((tabId) => chrome.tabs.remove(tabId))
          );
  
          // Refresh duplicate tabs list after deletion
          showDuplicateTabs(); // Refresh the list dynamically
        } catch (error) {
          console.error("Error deleting duplicate tabs:", error);
        }
      };
    }
  
    // Initialize by showing duplicate tabs
    showDuplicateTabs();
  
    // Handle "Back to Main" button click
    backButton.addEventListener("click", () => {
      window.location.href = "popup.html"; // Navigate back to main page
    });
  });