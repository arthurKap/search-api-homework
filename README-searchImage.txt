import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const lightbox = new SimpleLightbox(".gallery a");

const searchForm = document.getElementById("search-form");
const gallery = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector(".load-more");
let currentPage = 1;

const apiKey = "YOUR_API_KEY";
const baseUrl = "https://pixabay.com/api/";
const perPage = 40;
let searchQuery = "";

searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    currentPage = 1;
    gallery.innerHTML = "";
    loadMoreBtn.style.display = "none";
    searchQuery = e.target.searchQuery.value.trim();
    await searchImages();
});

loadMoreBtn.addEventListener("click", async () => {
    currentPage++;
    await searchImages();
});

const searchImages = async () => {
    const url = `${baseUrl}?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=${perPage}`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.hits.length === 0) {
            if (currentPage === 1) {
                gallery.innerHTML = "Sorry, there are no images matching your search query. Please try again.";
            } else {
                loadMoreBtn.style.display = "none";
                // Show end of results message
            }
        } else {
            data.hits.forEach((image) => {
                const card = document.createElement("div");
                card.className = "photo-card";
                card.innerHTML = `
                    <a href="${image.largeImageURL}" data-lightbox="image">
                        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
                    </a>
                    <div class="info">
                        <p class="info-item"><b>Likes:</b> ${image.likes}</p>
                        <p class="info-item"><b>Views:</b> ${image.views}</p>
                        <p class "info-item"><b>Comments:</b> ${image.comments}</p>
                        <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
                    `;
                gallery.appendChild(card);
            });
            loadMoreBtn.style.display = "block";
            const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();
            window.scrollBy({
                top: cardHeight * 2,
                behavior: "smooth",
            });
        }
    } catch (error) {
        console.error(error);
    }
};
