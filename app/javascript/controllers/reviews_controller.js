import { Controller } from "@hotwired/stimulus"
// import Swiper from "swiper"
import Swiper from "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs";

// import "swiper/css"

// Connects to data-controller="reviews"
export default class extends Controller {
  connect() {
    this.swiper = new Swiper(this.element.querySelector('.swiper'), {
      loop: true,
      spaceBetween: 24,
      slidesPerView: 1,
      pagination: {
        el: this.element.querySelector('.swiper-pagination'),
        clickable: true,
      },
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
    })
  }

  disconnect() {
    if (this.swiper) {
      this.swiper.destroy()
    }
  }
}
