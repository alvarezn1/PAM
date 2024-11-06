import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExpenseManagementCase } from '../use-cases/expense-management.use-case';
import { ErrorAlertCase } from '../use-cases/error-alert.use-case';
@Component({
  selector: 'app-gastos',
  templateUrl: './gastos.page.html',
  styleUrls: ['./gastos.page.scss'],
})
export class GastosPage implements OnInit {
  cantidad: number = 0;
  categoria: string = "";
  fecha: string = "";
  comentario: string = "";
  foto: File | null;

  constructor(
    private expenseManagementCase: ExpenseManagementCase,
    private router: Router,
    private errorAlertCase: ErrorAlertCase
  ) {
    this.foto = null;
  }

  ngOnInit() {
    // Lógica al inicializar el componente
  }

  async addExpense() {
    const expenseData = {
      cantidad: this.cantidad,
      categoria: this.categoria,
      fecha: this.fecha,
      comentario: this.comentario,
    };
  
    try {
      await this.expenseManagementCase.addExpense(expenseData);
      await this.errorAlertCase.showAlert('Gasto añadido con éxito');
      this.resetForm();
      this.router.navigate(['/home']);
    } catch (error) {
      await this.errorAlertCase.showAlert('Error al añadir el gasto. Inténtalo de nuevo más tarde.');
    }
  }
  
  resetForm() {
    this.cantidad = 0;
    this.categoria = '';
    this.fecha = '';
    this.comentario = '';
    this.foto = null;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.foto = file;
  }
}
