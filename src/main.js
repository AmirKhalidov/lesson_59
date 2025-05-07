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

axios.defaults.baseURL = 'https://pixabay.com';

formEl.addEventListener('submit', (e) => {
    e.preventDefault();

    listEl.innerHTML = '';

    if (!inputEl.value) return;

    axios
        .get('/api/', {
            params: {
                key: '50136722-5844e52b964210bda2ded8792',
                q: inputEl.value,
                image_type: 'photo',
                orientation: 'horizontal',
                safesearch: true,
            },
        })
        .then((data) => {
            if (data.data.hits.length === 0) {
                iziToast.error({
                    title: 'Error',
                    message:
                        'Sorry, there are no images matching your search query. Please try again!',
                    position: 'topRight',
                });
                return;
            }

            console.log(data);
            console.log(data.data.hits);
            const neededData = data.data.hits;

            iziToast.success({
                title: 'Success!',
                message: 'We have found you some beautiful pictures!',
                position: 'topRight',
            });

            neededData.forEach((item) => {
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

                statsContainer.append(
                    likesEl,
                    viewsEl,
                    commentsEl,
                    downloadsEl
                );
                liItem.append(imgEl, statsContainer);
                listEl.insertAdjacentElement('afterbegin', liItem);
            });
        })
        .catch((err) => {
            console.error(err.message);
            iziToast.error({
                title: 'Error',
                message: 'Something went wrong! Please try again later.',
                position: 'topRight',
            });
        });
    inputEl.value = '';
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
