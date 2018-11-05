import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoDeUsoComponent } from './tipo-de-uso.component';

describe('TipoDeUsoComponent', () => {
  let component: TipoDeUsoComponent;
  let fixture: ComponentFixture<TipoDeUsoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoDeUsoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoDeUsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
