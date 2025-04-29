let whitelist = [];

async function getInactiveTabs(timeout) {
    const tabs = await chrome.tabs.query({});
    const now = Date.now();
    return tabs.filter((tab) => {
        return tab.lastAccessed && now - tab.lastAccessed > timeout && !whitelist.includes(tab.id);
    });
}

async function getDuplicateTabs() {
    const tabs = await chrome.tabs.query({});
    const urls = new Set();
    const duplicates = [];
    tabs.forEach((tab) => {
        if (urls.has(tab.url) && !whitelist.includes(tab.id)) {
            duplicates.push(tab);
        } else {
            urls.add(tab.url);
        }
    });
    return duplicates;
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === "startCleanup") {
        const timeout = message.timeout;
        const duplicateTabs = await getDuplicateTabs();
        duplicateTabs.forEach((tab) => {
            chrome.tabs.remove(tab.id);
        });

        const inactiveTabs = await getInactiveTabs(timeout);

        sendResponse({
            duplicatesClosed: duplicateTabs.length,
            inactiveTabs: inactiveTabs.map(({id, title, url}) => ({id, title, url})),
        });
    }
    return true;
});