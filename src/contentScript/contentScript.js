import debounce from 'lodash/debounce';
import get from 'lodash/get';
import getRating from './api/getRating';

function initializeScript() {
  const shouldInititialize = window.location.pathname.includes(
    '/products/wine'
  );

  if (!shouldInititialize) {
    return;
  }

  appendRatings();

  // can't use MutationObserver unfortunately :(
  window.addEventListener('scroll', debounce(appendRatings, 1000));
}

function appendRatings() {
  const wineListItems = document.querySelectorAll(
    'div.prodDesc > a.tastersnote'
  );

  wineListItems.forEach((item) => {
    const isInView = checkVisible(item.parentNode, 100);
    console.log(item.parentNode, isInView);
    if (!item.parentNode.style.position && isInView) {
      appendRating(item);
    }
  });
}

async function appendRating(element) {
  element.parentElement.style.position = 'relative';
  const wineName = get(element.querySelector('span'), 'innerText');

  if (!wineName) {
    return;
  }

  try {
    const loadingElement = document.createElement('span');
    loadingElement.innerText = 'Loading score...';
    loadingElement.style.position = 'absolute';
    loadingElement.style.bottom = '20px';
    loadingElement.style.right = '130px';
    element.parentElement.appendChild(loadingElement);
    const { score, numOfReviews, url } = await getRating(wineName);
    loadingElement.remove();

    const priceElement = document.createElement('a');
    priceElement.href = url;
    priceElement.innerText = `Score: ${score} (${numOfReviews} reviews)`;
    priceElement.style.position = 'absolute';
    priceElement.style.bottom = '20px';
    priceElement.style.right = '130px';

    element.parentElement.appendChild(priceElement);
  } catch (e) {
    console.error(`${wineName} is not found on Vivino`);
  }
}

function checkVisible(elm, threshold, mode) {
  threshold = threshold || 0;
  mode = mode || 'visible';

  var rect = elm.getBoundingClientRect();
  var viewHeight = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight
  );
  var above = rect.bottom - threshold < 0;
  var below = rect.top - viewHeight + threshold >= 0;

  return mode === 'above' ? above : mode === 'below' ? below : !above && !below;
}

document.addEventListener('DOMContentLoaded', initializeScript);
