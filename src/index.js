import API from './js/search-api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  widthRatio: 0.8,
  showCounter: false,
});

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.gallery.style.display = 'none';
refs.loadMoreBtn.style.display = 'none';
let currentPage = 1;
let searchQuery = '';

refs.form.addEventListener('submit', handleFormSubmit);
refs.loadMoreBtn.addEventListener('click', handleLoadMore);

async function handleFormSubmit(e) {
  e.preventDefault();
  currentPage = 1;
  refs.gallery.innerHTML = '';
  searchQuery = e.target.searchQuery.value.trim();
  await searchImages();
}

async function handleLoadMore() {
  currentPage++;
  await searchImages();
}

async function searchImages() {
  if (searchQuery.length === 0) {
    Notiflix.Notify.failure('Please enter your request');
  } else {
    try {
      const response = await API.getImageData(searchQuery, currentPage);
      const dataItems = await response.data.hits;
      handleSearchResults(dataItems);
      if (dataImage.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        Notiflix.Notify.info(`Hurray! We found ${dataImage.length} images`);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

function handleSearchResults(dataItems) {
  if (dataItems.length === 0) {
    handleNoResults();
  } else {
    appendImagesToGallery(dataItems);
    showLoadMoreButton();
    scrollWindow();
  }
}

function handleNoResults() {
  if (currentPage === 1) {
    refs.gallery.innerHTML = '';
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    refs.loadMoreBtn.style.display = 'none';
  }
}

function appendImagesToGallery(dataItems) {
  dataItems.forEach(image => {
    const card = createImageCard(image);
    refs.gallery.appendChild(card);
  });
}

function createImageCard(image) {
  refs.gallery.style.display = 'flex';
  const card = document.createElement('div');
  card.classList.add('photo-card');
  card.innerHTML = `<a href="${image.largeImageURL}" data-lightbox="image">
                    <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
                </a>
                <div class="info">
                    <p class="info-item"><b>Likes:</b> ${image.likes}</p>
                    <p class="info-item"><b>Views:</b> ${image.views}</p>
                    <p class"info-item"><b>Comments:</b> ${image.comments}</p>
                    <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>`;
  const galleryLinks = card.querySelectorAll('a');
  galleryLinks.forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
    });
  });
  return card;
}

function showLoadMoreButton() {
  refs.loadMoreBtn.style.display = 'block';
}

function scrollWindow() {
  const { height: cardHeight } =
    refs.gallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
  currentPage++;
  lightbox.refresh();
}
