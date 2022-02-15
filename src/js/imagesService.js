import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '25677336-52df653f6807abbcb11bbd90f';

export default class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  getImages() {
    const searchParams = new URLSearchParams({
      key: API_KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      page: this.page,
    });

    return axios.get(`${BASE_URL}?${searchParams}`).then(({ data }) => {
      this.incrementPage();
      return data;
    });
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
