import browser from 'webextension-polyfill';
import { parseMetaTags } from './utils';

try {
  browser.runtime.onInstalled.addListener(() => {
    console.log('Service Worker Initialized');

    browser.runtime.onMessage.addListener(async (message, sender) => {
      const { action, data } = message;

      console.log('Background message: ', data, sender);

      if (!action) {
        return;
      }

      if (action === 'GET_META_TAGS') {
        try {
          const metaTags = await parseMetaTags(data.url);
          return {
            action: 'GET_META_TAGS_SUCCESS',
            data: { metaTags }
          }
        } catch (error) {
          console.error(error);
        }
      }
    });
  });
} catch (error) {
  console.log(error);
}

