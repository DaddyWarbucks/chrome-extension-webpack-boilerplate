import "../css/popup.css";
import browser from "webextension-polyfill";

// Imported so they make it to the build for
// browser icon usage in manifest
import '../img/icon-128.png';
import '../img/icon-34.png';

async function getURL() {
  const activeTabs = await browser.tabs.query({
    currentWindow: true,
    active: true
  });
  return activeTabs[0].url;
}

async function getMetaTags(url) {
  const { data } = await browser.runtime.sendMessage({
    action: 'GET_META_TAGS',
    data: { url }
  });
  return data.metaTags
}


// browser.runtime.onMessage.addListener(async (message, sender) => {
//   const { action, data, ...rest } = message;
//   if (action === 'GET_HTML_SUCCESS') {
//     // console.log({ action, data });
//   }
// });

async function main() {
  const url = await getURL();
  const metaTags = await getMetaTags(url);
  console.log({ metaTags, url });
}

main();