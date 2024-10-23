import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VistaGastosPage } from './vista-gastos.page';

describe('VistaGastosPage', () => {
  let component: VistaGastosPage;
  let fixture: ComponentFixture<VistaGastosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VistaGastosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
