import '../css/popup.css';
import { parseMetaTags } from './utils';
import browser from 'webextension-polyfill';
import $ from "cash-dom";

class Coywolf {
  constructor(initialState) {
    this.state = { ...initialState };
    this.listeners = [];
    this.setState = this.setState.bind(this);
    this.subscribe = this.subscribe.bind(this);
  }

  subscribe(fn) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((listener) => listener !== fn);
    };
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach((listener) => listener({ ...this.state }));
  }
}

window.coywolf = new Coywolf({
  loading: true,
  error: null,
  data: null
});

async function getURL() {
  const activeTabs = await browser.tabs.query({
    currentWindow: true,
    active: true
  });
  return activeTabs[0].url;
}

async function main() {
  try {
    const url = await getURL();
    const metaTags = await parseMetaTags(url);
    coywolf.setState({
      loading: false,
      data: { metaTags }
    });
  } catch (error) {
    coywolf.setState({ error, loading: false });
  }
}

main();

coywolf.subscribe((state) => {
  console.log('State Change: ', state);

  if (state.loading) {
    $('#error, #preview').addClass('hidden');
    $('#loading').removeClass('hidden');
    return;
  }

  if (state.error) {
    $('#image, #preview').addClass('hidden');
    $('#error')
      .text(state.error.message || 'There was an unexpected error')
      .removeClass('hidden');
    return;
  }

  if (state.data && state.data.metaTags) {
    const title = state.data.metaTags['og:title'];
    const description = state.data.metaTags['og:description'];
    const imageSrc = state.data.metaTags['og:image'];

    $('#error, #loading').addClass('hidden');

    if (imageSrc) {
      $('#image').attr('src', imageSrc);
    } else {
      $('#image').addClass('hidden');
      $('#no-image').removeClass('hidden');
    }

    if (title) {
      $('#title').text(title);
    }

    if (description) {
      $('#description').text(description);
    }

    $('#preview').removeClass('hidden');

    return;
  }

  $('#image, #preview').addClass('hidden');
  $('#error')
    .text('There was an unexpected error. Please try again.')
    .removeClass('hidden');

});

$('#view-all').on('click', () => {
  const text = JSON.stringify(coywolf.state.data.metaTags, null, 2);
  $('#view-all-preview pre').text(text);
  $('#view-all-preview').removeClass('hidden');
});

$('#view-all-close').on('click', () => {
  $('#view-all-preview').addClass('hidden');
});