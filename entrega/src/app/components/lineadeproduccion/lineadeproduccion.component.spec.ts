import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineadeproduccionComponent } from './lineadeproduccion.component';

describe('LineadeproduccionComponent', () => {
  let component: LineadeproduccionComponent;
  let fixture: ComponentFixture<LineadeproduccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineadeproduccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineadeproduccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
