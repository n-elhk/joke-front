import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleJokeComponent } from './single-joke.component';

describe('SingleJokeComponent', () => {
  let component: SingleJokeComponent;
  let fixture: ComponentFixture<SingleJokeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SingleJokeComponent]
    });
    fixture = TestBed.createComponent(SingleJokeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
