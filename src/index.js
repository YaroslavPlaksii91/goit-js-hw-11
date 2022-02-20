import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import photoCardsTempl from './templates/photoCards.hbs';
import ImagesApiService from './js/imagesService';

const imagesApiService = new ImagesApiService();
const formRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');
let galleryLightBox;

const observerTarget = document.querySelector('.intersection-observer');
const observerOptions = {
  rootMargin: '150px',
};
const observer = new IntersectionObserver(onScroll, observerOptions);
observer.observe(observerTarget);

formRef.addEventListener('submit', onFormSubmit);

async function onFormSubmit(evt) {
  try {
    evt.preventDefault();

    imagesApiService.searchQuery = evt.currentTarget.elements.searchQuery.value.trim();
    imagesApiService.resetPage();
    if (imagesApiService.searchQuery === '') return;

    const images = await imagesApiService.getImages();
    const { hits, totalHits } = images;

    if (hits.length !== 0) {
      Notify.success(`Hooray! We found ${totalHits} images.`);
    }

    renderMarkup(hits);
  } catch (error) {
    console.log(error.message);
  }
}

async function onScroll(entries) {
  entries.forEach(async entry => {
    try {
      if (entry.isIntersecting && imagesApiService.searchQuery !== '') {
        const images = await imagesApiService.getImages();
        const { hits, totalHits } = images;
        const maxPage = totalHits / 40;

        galleryRef.insertAdjacentHTML('beforeend', photoCardsTempl(hits));
        galleryLightBox.refresh();
        smoothScroll();

        if (imagesApiService.page - 1 > maxPage) {
          Notify.info("We're sorry, but you've reached the end of search results.");
        }
      }
    } catch (error) {
      console.log(error.message);
    }
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

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
