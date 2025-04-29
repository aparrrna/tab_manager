document.addEventListener("DOMContentLoaded", async () => {
    const thresholdDropdown = document.getElementById("inactiveThreshold");
    const summarySection = document.getElementById("summary");
    const inactiveSummary = document.getElementById("inactiveSummary");
    const expandButton = document.getElementById("expandButton");
    const detailsSection = document.getElementById("details");
    const compressButton = document.getElementById("compressButton");
    const inactiveTabsList = document.getElementById("inactiveTabsList");
    const deleteInactiveButton = document.getElementById("deleteInactive");
    const backButton = document.getElementById("backToMain");
  
    // Fetch tabs based on inactivity threshold
    async function fetchInactiveTabs() {
      const tabs = await chrome.tabs.query({});
      const now = Date.now();
      const thresholdDays = parseInt(thresholdDropdown.value); // Get selected threshold
      const threshold = thresholdDays * 24 * 60 * 60 * 1000; // Convert days to milliseconds
  
      // Get tabs that have been inactive for longer than the threshold
      return tabs.filter(
        (tab) => tab.lastAccessed && now - tab.lastAccessed > threshold
      );
    }
  
    // Display the summary dynamically
    async function displaySummary() {
      const inactiveTabs = await fetchInactiveTabs();
  
      if (inactiveTabs.length === 0) {
        inactiveSummary.textContent = "No inactive tabs found.";
        expandButton.classList.add("hidden");
      } else {
        inactiveSummary.textContent = `${inactiveTabs.length} inactive tabs found.`;
        expandButton.classList.remove("hidden"); // Show Expand button
        deleteInactiveButton.classList.remove("hidden");
      }
  
      // Attach functionality to the Expand button
      expandButton.onclick = () => showDetails(inactiveTabs);
    }
  
    // Show the list of inactive tabs (Expand details)
    function showDetails(inactiveTabs) {
      summarySection.classList.add("hidden"); // Hide summary
      expandButton.classList.add("hidden"); //hide expand button
      deleteInactiveButton.classList.add("hidden");
      detailsSection.classList.remove("hidden"); // Show details section
      compressButton.classList.remove("hidden"); // Show Compress button
  
      inactiveTabsList.innerHTML = ""; // Clear list
      inactiveTabs.forEach((tab) => {
        const listItem = document.createElement("li");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = tab.id;
  
        const label = document.createElement("label");
        label.textContent = `${tab.title || "Untitled Tab"} (${tab.url})`;
  
        listItem.appendChild(checkbox);
        listItem.appendChild(label);
        inactiveTabsList.appendChild(listItem);
      });
  
      deleteInactiveButton.classList.remove("hidden"); // Show Delete button
    }
  
    // Hide the list again (Compress details)
    function compressDetails() {
      inactiveTabsList.innerHTML = "";
      summarySection.classList.remove("hidden"); // Show summary
      expandButton.classList.remove("hidden"); //show expand button
      detailsSection.classList.add("hidden"); // Hide details
      compressButton.classList.add("hidden"); // Hide Compress button
      deleteInactiveButton.classList.add("hidden"); // Hide Delete button
      
    }
  
    // Handle deletion of selected tabs
    deleteInactiveButton.onclick = async () => {
      const selectedCheckboxes = inactiveTabsList.querySelectorAll(
        "input[type='checkbox']:checked"
      );
      const selectedTabIds = Array.from(selectedCheckboxes).map((checkbox) =>
        parseInt(checkbox.value)
      );
  
      for (const tabId of selectedTabIds) {
        await chrome.tabs.remove(tabId); // Delete selected tabs
      }
  
      location.reload(); // Refresh page after deletion
    };
  
    // Handle dropdown selection change
    thresholdDropdown.onchange = () => {
      displaySummary(); // Refresh the summary based on the new threshold
    };
  
    // Attach functionality to the Compress button
    compressButton.onclick = compressDetails;
  
    // Handle Back to Main button
    backButton.onclick = () => {
      window.location.href = "popup.html"; // Navigate back to the main menu
    };
  
    // Initialize by displaying the summary
    displaySummary();
  });