import iziToast from 'izitoast';
import SimpleLightbox from 'simplelightbox';

import 'izitoast/dist/css/iziToast.min.css';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.form');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');

function showLoader() {
  loader.classList.remove('hidden');
}

function hideLoader() {
  loader.classList.add('hidden');
}

form.addEventListener('submit', onFormSubmit);

function onFormSubmit(e) {
  e.preventDefault();
  gallery.innerHTML = '';
  const q = e.target.elements.input.value;
  const key = '42276910-5dbc0617c597b0712888fd711';

  if (q === '') {
    return iziToast.error({
      message:
        'Sorry, there are no images matching your search query. Please try again!',
      position: 'topRight',
    });
  } else {
    showLoader();
    findPhotos(key, q)
      .then(data => {
        createMarkup(data);
        hideLoader();
      })
      .catch(error => {
        console.error('Error fetching photos:', error);
        hideLoader();
      })
      .finally(() => form.reset());
  }
}

function findPhotos(key, q) {
  const BASE_URL = 'https://pixabay.com';
  const END_POINT = '/api/';
  const PARAMS = `?key=${key}&q=${q}&image_type=photo&orientation=horizontal&safesearch=true`;
  const url = BASE_URL + END_POINT + PARAMS;

  return fetch(url).then(res => res.json());
}

function createMarkup(data) {
  if (data.hits.length === 0) {
    iziToast.error({
      message:
        'Sorry, there are no images matching your search query. Please try again!',
      position: 'topRight',
    });
    return;
  }

  const markup = data.hits
    .map(data => {
      return `<li class="gallery-item">
             <a class="gallery-link" href="${data.webformatURL}">
            <img class="gallery-image" src="${data.largeImageURL}" alt="${data.tags}" />
            </a>
            <p><b>Likes: </b>${data.likes}</p>
            <p><b>Views: </b>${data.views}</p>
            <p><b>Comments: </b>${data.comments}</p> 
            <p><b>Downloads: </b>${data.downloads}</p>
        </li>`;
    })
    .join('');

  gallery.insertAdjacentHTML('afterbegin', markup);
  const lightbox = new SimpleLightbox('.gallery a', options);
  lightbox.refresh();
}

const options = {
  captions: true,
  captionType: 'attr',
  captionSelector: 'img',
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
};