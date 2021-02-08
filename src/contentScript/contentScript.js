import debounce from 'lodash/debounce';
import get from 'lodash/get';
import getRating from './api/getRating';



function Initialize() {
   
   main_func();
   
   window.addEventListener('scroll', debounce(main_func, 1000),{passive: true});
}

function main_func() {
   

 //if (document.querySelectorAll("span.mix-name").length > 0) {

  const wineListItems = document.querySelectorAll(
    "h6");
    
  wineListItems.forEach((item) => {
    //const isInView = checkVisible(item.parentNode, 100);
    const isInView = checkVisible(item.parentNode, 100);
    //console.log(item.parentNode, isInView);
    if (!item.parentNode.style.position && isInView) {
      appendRating(item);
    }
  });  

  
}


async function appendRating(element) {
  element.parentElement.style.position = 'relative';
  const wineName = element.innerText; 

  if (!wineName) {
    return;
  }

   let loadingElement;
  try {
    //const loadingElement = document.createElement('span');
    loadingElement = document.createElement('span');
    loadingElement.innerText = 'Loading score...';
    loadingElement.style.position = 'relative';
    loadingElement.style.bottom = "5px";
    loadingElement.style.right = "auto";
    element.parentElement.appendChild(loadingElement);
    const { score, numOfReviews, url } = await getRating(wineName);
    loadingElement.remove();

    const priceElement = document.createElement('a');
    priceElement.href = url;
    priceElement.innerText = `Score: ${score} (${numOfReviews} reviews)`;
    priceElement.style.position = 'relative';
    priceElement.style.bottom = "15px";
    priceElement.style.right = "auto";

    element.parentElement.appendChild(priceElement);
  } catch (e) {
   //console.log(e)

    loadingElement.innerText = 'Not found!';
    //loadingElement.remove();
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

//document.addEventListener('DOMContentLoaded', initializeScript);

document.addEventListener('DOMContentLoaded', Initialize);