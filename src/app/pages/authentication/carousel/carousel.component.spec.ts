import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselComponent } from './carousel.component';
import { MaterialModule } from '../../shared/modules/material.module';

describe('CarouselComponent', () => {
  let component: CarouselComponent;
  let fixture: ComponentFixture<CarouselComponent>;

  const testimonials = [
    {
      imageUrl: 'assets/images/saba.png',
      title: 'Saba',
      from: 'John',
      position: 'Chief Technology Officer',
      content: 'Sapper helps us alot with respect to collecting data from different sources' +
        'we have loge different digital assets and strong into single place and' +
        'creating dashboards on it. It is really best thing available in market'
    },
    {
      imageUrl: 'assets/images/sfdc.jpg',
      title: 'Sfdc',
      from: 'Anna Aston',
      position: 'Solutions Architect - IT Business Application',
      content: 'It has a really good user interface, hence easy to use for most of my ETL work.' +
        'Inbuilt connectors for almost all of the cloud services.' +
        'It is easily scalable and robust in the performance.'
    },
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarouselComponent ],
      imports: [MaterialModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarouselComponent);
    component = fixture.componentInstance;
    component.slides = [
      {
        imageUrl: 'assets/images/saba.png',
        title: 'Saba',
        from: 'John',
        position: 'Chief Technology Officer',
        content: 'Sapper helps us alot with respect to collecting data from different sources' +
          'we have loge different digital assets and strong into single place and' +
          'creating dashboards on it. It is really best thing available in market'
      },
      {
        imageUrl: 'assets/images/sfdc.jpg',
        title: 'Sfdc',
        from: 'Anna Aston',
        position: 'Solutions Architect - IT Business Application',
        content: 'It has a really good user interface, hence easy to use for most of my ETL work.' +
          'Inbuilt connectors for almost all of the cloud services.' +
          'It is easily scalable and robust in the performance.'
      },
    ];
    fixture.detectChanges();
    component.slides = testimonials;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onPreviousClick()', () => {
    component.currentSlide = 0;
    expect(component.currentSlide).toBe(0);
    component.onPreviousClick();
    expect(component.slides.length).toBe(2);
    expect(component.currentSlide).toBe(1);

    component.currentSlide = 3;
    expect(component.currentSlide).toBe(3);
    component.onPreviousClick();
    expect(component.currentSlide).toBe(2);
  });

  it('should call onNextClick()', () => {
    component.currentSlide = 0;
    component.onNextClick();
    expect(component.slides.length).toBe(2);
    expect(component.currentSlide).toBe(1);

    component.currentSlide = 1;
    component.onNextClick();
    expect(component.slides.length).toBe(2);
    expect(component.currentSlide).toBe(0);
  });
});
