chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");

  chrome.action.onClicked.addListener(function () {
    chrome.tabs.create({ url: "index.html" });
  });

  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));
});
