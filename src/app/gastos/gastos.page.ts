import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gastos',
  templateUrl: 'gastos.page.html',
  styleUrls: ['gastos.page.scss'],
})
export class GastosPage {

  constructor(private router: Router) {}

  addExpense() {
    // Aquí puedes añadir la lógica para guardar el gasto
    // Luego redirige al home
    this.router.navigate(['/home']); // Cambia '/home' por la ruta correcta
  }
}
