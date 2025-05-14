import axios from 'axios';
import 'izitoast/dist/css/iziToast.min.css';
import iziToast from 'izitoast';

const inputEl = document.querySelector('#input');
const searchBtn = document.querySelector('#search-btn');
const formEl = document.querySelector('#form');
const listEl = document.querySelector('#list');
const modal = document.querySelector('#imageModal');
const modalImg = document.querySelector('#modalImage');
const closeButton = document.querySelector('.close-button');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

axios.defaults.baseURL = 'https://pixabay.com';

let pageSetter = 1;
let currentSearchQuery = '';

async function fetchUsers(e, isNextPage = false, isPrevPage = false) {
    try {
        e.preventDefault();

        listEl.innerHTML = '';

        if (!isNextPage && !isPrevPage) {
            const searchQuery = inputEl.value;

            if (!searchQuery) {
                iziToast.error({
                    title: 'Error',
                    message: 'Please enter a search query',
                    position: 'topRight',
                });
                return;
            }

            currentSearchQuery = searchQuery;
            pageSetter = 1;
            inputEl.value = '';
        } else {
            if (isNextPage) {
                pageSetter += 1;
            } else if (isPrevPage && pageSetter > 1) {
                pageSetter -= 1;
            }
        }

        searchBtn.disabled = true;
        listEl.innerHTML = 'LOADING...';

        nextBtn.textContent = `To page ${pageSetter + 1}`;
        nextBtn.classList.remove('hidden');

        if (pageSetter > 1) {
            prevBtn.textContent = `To page ${pageSetter - 1}`;
            prevBtn.classList.remove('hidden');
        } else {
            prevBtn.classList.add('hidden');
        }

        const {
            data: { hits },
        } = await axios.get('/api/', {
            params: {
                key: '50136722-5844e52b964210bda2ded8792',
                q: currentSearchQuery,
                image_type: 'photo',
                orientation: 'horizontal',
                safesearch: true,
                per_page: 15,
                page: pageSetter,
            },
        });

        searchBtn.disabled = false;
        listEl.innerHTML = '';
        console.log(hits);

        if (hits.length === 0) {
            iziToast.error({
                title: 'Error',
                message:
                    'Sorry, there are no images matching your search query. Please try again!',
                position: 'topRight',
            });
            return;
        }

        iziToast.success({
            title: 'Success!',
            message: 'We have found you some beautiful pictures!',
            position: 'topRight',
        });

        hits.forEach((item) => {
            const liItem = document.createElement('li');

            const imgEl = document.createElement('img');
            imgEl.classList.add('card-image');
            imgEl.src = item.webformatURL;
            imgEl.alt = item.tags;

            imgEl.addEventListener('click', () => {
                modalImg.src = item.largeImageURL;
                modalImg.alt = item.tags;
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            });

            const statsContainer = document.createElement('div');
            statsContainer.classList.add('card-stats');

            const likesEl = document.createElement('p');
            likesEl.classList.add('card-text');
            likesEl.textContent = `Likes: ${item.likes}`;

            const viewsEl = document.createElement('p');
            viewsEl.classList.add('card-text');
            viewsEl.textContent = `Views: ${item.views}`;

            const commentsEl = document.createElement('p');
            commentsEl.classList.add('card-text');
            commentsEl.textContent = `Comments: ${item.comments}`;

            const downloadsEl = document.createElement('p');
            downloadsEl.classList.add('card-text');
            downloadsEl.textContent = `Downloads: ${item.downloads}`;

            statsContainer.append(likesEl, viewsEl, commentsEl, downloadsEl);
            liItem.append(imgEl, statsContainer);
            listEl.insertAdjacentElement('afterbegin', liItem);
        });
    } catch (err) {
        console.error(err.message);
        iziToast.error({
            title: 'Error',
            message: `Something went wrong! Please try again later. ${err.message}`,
            position: 'topRight',
        });
    }
}

formEl.addEventListener('submit', async (e) => {
    await fetchUsers(e);
});

closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

nextBtn.addEventListener('click', async (e) => {
    await fetchUsers(e, true, false);
});

prevBtn.addEventListener('click', async (e) => {
    await fetchUsers(e, false, true);
});
