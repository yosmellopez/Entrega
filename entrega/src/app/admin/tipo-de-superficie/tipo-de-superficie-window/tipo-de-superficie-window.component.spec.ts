import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoDeSuperficieWindowComponent } from './tipo-de-superficie-window.component';

describe('TipoDeSuperficieWindowComponent', () => {
  let component: TipoDeSuperficieWindowComponent;
  let fixture: ComponentFixture<TipoDeSuperficieWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoDeSuperficieWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoDeSuperficieWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
