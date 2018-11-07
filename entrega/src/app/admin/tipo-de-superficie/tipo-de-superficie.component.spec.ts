import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoDeSuperficieComponent } from './tipo-de-superficie.component';

describe('TipoDeSuperficieComponent', () => {
  let component: TipoDeSuperficieComponent;
  let fixture: ComponentFixture<TipoDeSuperficieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoDeSuperficieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoDeSuperficieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
