
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
  webview.setAttribute('allowpopups', '');
  viewContainer.appendChild(webview);

  const tabButton = document.createElement('button');
  tabButton.className = 'tab';
  tabButton.innerText = 'Loading...';
  tabButton.dataset.id = id;
  tabButton.onclick = () => switchTab(id);

  document.getElementById('tabs').appendChild(tabButton);

  tabs.push({ id, webview, tabButton });

  // 🔥 Update tab title when page loads
  webview.addEventListener('page-title-updated', (e) => {
    tabButton.innerText = e.title.substring(0, 20);
  });

  // 🔥 Update address bar when URL changes
  webview.addEventListener('did-navigate', (e) => {
    if (id === activeTabId) urlInput.value = e.url;
  });

  switchTab(id);
}

function switchTab(id) {
  tabs.forEach(tab => {
    const active = tab.id === id;
    tab.webview.style.display = active ? 'flex' : 'none';
    tab.tabButton.classList.toggle('active', active);
  });

  activeTabId = id;

  const activeWebview = getActiveWebview();
  if (activeWebview) {
    urlInput.value = activeWebview.getURL();
  }
}


function getActiveWebview() {
  return tabs.find(t => t.id === activeTabId)?.webview;
}
document.getElementById('new-tab').onclick = () => createTab();

urlInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('go').click();
  }
});

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
