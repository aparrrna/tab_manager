document.addEventListener("DOMContentLoaded", async () => {
    const summarySection = document.getElementById("summary");
    const summary = document.getElementById("inactiveSummary");
    const expandButton = document.getElementById("expandButton");
    const detailsSection = document.getElementById("details");
    const compressButton = document.getElementById("compressButton");
    const tabsList = document.getElementById("inactiveTabsList");
    const deleteInactiveButton = document.getElementById("deleteInactive");
    const backButton = document.getElementById("backToMain");

    async function fetchAllTabs() {
        const tabs = await chrome.tabs.query({});
        return tabs;
    }

    async function displaySummary() {
        const tabs = await fetchAllTabs();

        summary.textContent = `${tabs.length} tabs found.`;
        expandButton.classList.remove('hidden');
        deleteInactiveButton.classList.remove("hidden");

        expandButton.onclick = () => showDetails(tabs);
    }

    function showDetails(tabs) {
        summarySection.classList.add('hidden');
        expandButton.classList.add('hidden');
        deleteInactiveButton.classList.add('hidden');
        detailsSection.classList.remove('hidden');
        compressButton.classList.remove("hidden");

        tabsList.innerHTML = '';
        tabs.forEach((tab) => {
            const listItem = document.createElement("li");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = tab.id;

            const label = document.createElement("label");
            label.textContent = `${tab.title || "Untitled Tab"} (${tab.url})`;

            listItem.appendChild(checkbox);
            listItem.appendChild(label);
            tabsList.appendChild(listItem);
        });

        deleteInactiveButton.classList.remove("hidden");
    }

    function compressDetails() {
        tabsList.innerHTML = "";
        summarySection.classList.remove("hidden");
        expandButton.classList.remove("hidden");
        detailsSection.classList.add("hidden");
        compressButton.classList.add("hidden");
        deleteInactiveButton.classList.add("hidden");
    }

    deleteInactiveButton.onclick = async() => {
        const selectedCheckboxes = tabsList.querySelectorAll(
            "input[type='checkbox']:checked"
        );
        const selectedTabIds = Array.from(selectedCheckboxes).map((checkbox) =>
        parseInt(checkbox.value)
    );

    for (const tabId of selectedTabIds) {
        await chrome.tabs.remove(tabId);
    }
    location.reload();
    };

    compressButton.onclick = compressDetails;

    backButton.onclick = () => {
        window.location.href = "popup.html";
    };

    displaySummary();
});