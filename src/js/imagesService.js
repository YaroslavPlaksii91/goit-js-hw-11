import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '25677336-52df653f6807abbcb11bbd90f';

export default class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async getImages() {
    try {
      const searchParams = new URLSearchParams({
        key: API_KEY,
        q: this.searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page: this.page,
      });

      const response = await axios.get(`${BASE_URL}?${searchParams}`);
      this.incrementPage();

      return response.data;
    } catch (error) {
      console.log(error.message);
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
