import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExpenseManagementCase } from '../use-cases/expense-management.use-case';
import { ErrorAlertCase } from '../use-cases/error-alert.use-case';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-gastos',
  templateUrl: './gastos.page.html',
  styleUrls: ['./gastos.page.scss'],
})
export class GastosPage implements OnInit {
  Monto_Gastado: number = 0;
  categoria: string = '';
  fecha: string = '';
  comentario: string = '';
  Comentario_ubicacion: string = ''; // Aquí declaramos la propiedad de ubicación
  foto: File | null;

  constructor(
    private expenseManagementCase: ExpenseManagementCase,
    private router: Router,
    private errorAlertCase: ErrorAlertCase,
    private afAuth: AngularFireAuth
  ) {
    this.foto = null;
  }

  ngOnInit() {
    // Lógica al inicializar el componente
  }

  // Función para añadir un gasto y actualizar el monto inicial
  async addExpense() {
    const expenseData = {
      Monto_Gastado: this.Monto_Gastado,
      categoria: this.categoria,
      fecha: this.fecha,
      comentario: this.comentario,
      Comentario_ubicacion: this.Comentario_ubicacion,
    };

    try {
      // Llamar a la función de gestión de gastos
      await this.expenseManagementCase.addExpense(expenseData);
      await this.errorAlertCase.showErrorAlert('Gasto añadido con éxito', 'Exito');
      this.resetForm();
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error al añadir el gasto:', error);
      await this.errorAlertCase.showErrorAlert('Error al añadir el gasto. Inténtalo de nuevo más tarde.');
    }
  }

  resetForm() {
    this.Monto_Gastado = 0;
    this.categoria = '';
    this.fecha = '';
    this.comentario = '';
    this.foto = null;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.foto = file;
  }

  goHome() {
    this.router.navigate(['/home']); // Cambia la ruta según tu configuración
  }

  formValid() {
    // Validar si todos los campos son válidos
    return this.Monto_Gastado > 0 && this.categoria.match(/^[A-Za-z]+$/) && this.fecha && this.isValidDate(this.fecha) && this.Comentario_ubicacion.trim() !== '';
  }

  isValidDate(date: string): boolean {
    // Verificar que la fecha sea válida
    return !isNaN(new Date(date).getTime());
  }
}
