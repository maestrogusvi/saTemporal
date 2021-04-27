import { Component, Input } from '@angular/core';
import { ISlide } from '../login/login.interface';

@Component({
  selector: 'sapper-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent {
  @Input() slides: ISlide[];
  currentSlide = 0;

  constructor() {}

  /**
   * to navigate to previous slide
   */
  onPreviousClick() {
    const previous = this.currentSlide - 1;
    this.currentSlide = previous < 0 ? this.slides.length - 1 : previous;
  }

  /**
   * to navigate to next slide
   */
  onNextClick() {
    const next = this.currentSlide + 1;
    this.currentSlide = next === this.slides.length ? 0 : next;
  }
}
