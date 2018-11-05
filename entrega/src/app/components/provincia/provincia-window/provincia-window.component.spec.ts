import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvinciaWindowComponent } from './provincia-window.component';

describe('ProvinciaWindowComponent', () => {
  let component: ProvinciaWindowComponent;
  let fixture: ComponentFixture<ProvinciaWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvinciaWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvinciaWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
