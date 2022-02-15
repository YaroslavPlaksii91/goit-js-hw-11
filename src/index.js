import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import photoCardsTempl from './templates/photoCards.hbs';
import ImagesApiService from './js/imagesService';

const formRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const imagesApiService = new ImagesApiService();
let galleryLightBox;

formRef.addEventListener('submit', onFormSubmit);
loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

function onFormSubmit(evt) {
  evt.preventDefault();

  imagesApiService.searchQuery = evt.currentTarget.elements.searchQuery.value;
  imagesApiService.resetPage();
  imagesApiService.getImages().then(({ totalHits, hits }) => {
    if (hits.length !== 0) {
      Notify.success(`Hooray! We found ${totalHits} images.`);
    }

    renderMarkup(hits);
    loadMoreBtn.style.display = 'block';
  });
}

function renderMarkup(images) {
  if (images.length === 0) {
    galleryRef.innerHTML = '';
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    return;
  }

  galleryRef.innerHTML = photoCardsTempl(images);

  galleryLightBox = new SimpleLightbox('.gallery a', {
    captionDelay: 250,
  });
}

function onLoadMoreBtnClick() {
  imagesApiService.getImages().then(({ hits }) => {
    galleryRef.insertAdjacentHTML('beforeend', photoCardsTempl(hits));
    galleryLightBox.refresh();
    smoothScroll();
  });
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
