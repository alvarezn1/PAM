import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VistaIngresosPage } from './vista-ingresos.page';

describe('VistaIngresosPage', () => {
  let component: VistaIngresosPage;
  let fixture: ComponentFixture<VistaIngresosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VistaIngresosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
