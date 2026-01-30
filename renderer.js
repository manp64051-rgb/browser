
let tabs = [];
let activeTabId = null;
let tabIdCounter = 0;

const viewContainer = document.getElementById('view-container');
const tabsBar = document.getElementById('tabs-bar');
const urlInput = document.getElementById('url');

function createTab(url = "https://google.com") {
  const id = ++tabIdCounter;

  const webview = document.createElement('webview');
  webview.src = url;
  webview.style.display = 'none';
  webview.dataset.id = id;

  viewContainer.appendChild(webview);

  const tabButton = document.createElement('button');
  tabButton.innerText = 'New Tab';
  tabButton.dataset.id = id;
  tabButton.onclick = () => switchTab(id);

  tabsBar.appendChild(tabButton);

  tabs.push({ id, webview, tabButton });
  switchTab(id);
}

function switchTab(id) {
  tabs.forEach(tab => {
    tab.webview.style.display = tab.id === id ? 'flex' : 'none';
    tab.tabButton.classList.toggle('active', tab.id === id);
  });
  activeTabId = id;
}

function getActiveWebview() {
  return tabs.find(t => t.id === activeTabId)?.webview;
}
document.getElementById('new-tab').onclick = () => createTab();

document.getElementById('go').onclick = () => {
  const webview = getActiveWebview();
  if (!webview) return;

  let url = urlInput.value.trim();
  if (!url.startsWith('http')) url = 'https://' + url;

  webview.loadURL(url);
};

document.getElementById('back').onclick = () => {
  const w = getActiveWebview();
  if (w && w.canGoBack()) w.goBack();
};

document.getElementById('forward').onclick = () => {
  const w = getActiveWebview();
  if (w && w.canGoForward()) w.goForward();
};

document.getElementById('reload').onclick = () => {
  const w = getActiveWebview();
  if (w) w.reload();
};
createTab("https://google.com");
