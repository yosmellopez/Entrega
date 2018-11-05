import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsejoPopularComponent } from './consejo-popular.component';

describe('ConsejoPopularComponent', () => {
  let component: ConsejoPopularComponent;
  let fixture: ComponentFixture<ConsejoPopularComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsejoPopularComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsejoPopularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
