import axios from 'axios';
import Notiflix from 'notiflix';

const url = 'https://pixabay.com/api/';
const key = '40529387-9fd793e2de2b7cd1483169ef8';

async function getImageData(query, page) {
  try {
    const resp = await axios.get(
      `${url}?key=${key}&q=${query}&image_type=photo&per_page=40&page=${page}&orientation=horizontal&safesearch=true`
    );
    return resp;
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure('ERROR');
  }
}

export default { getImageData };
