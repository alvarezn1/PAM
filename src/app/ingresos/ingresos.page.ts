import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorAlertCase } from '../use-cases/error-alert.use-case';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { first } from 'rxjs/operators';
import { ExpenseManagementCase } from '../use-cases/expense-management.use-case';
@Component({
  selector: 'app-ingresos', // Cambié el selector de 'gastos' a 'ingresos'
  templateUrl: './ingresos.page.html', // Cambié la ruta de la plantilla a ingresos.page.html
  styleUrls: ['./ingresos.page.scss'],
})
export class IngresosPage implements OnInit { // Cambié el nombre de la clase a IngresosPage
  Monto_Ingresado: number = 0; // Cambié Monto_Gastado a Monto_Ingresado
  categoria: string = '';
  fecha: string = '';
  comentario: string = '';
  Comentario_ubicacion: string = ''; // Aquí sigue siendo la propiedad de ubicación
  foto: File | null;

  constructor(
    private expenseManagementCase: ExpenseManagementCase,
    private router: Router,
    private errorAlertCase: ErrorAlertCase,
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase
  ) {
    this.foto = null;
  }

  ngOnInit() {
    // Lógica al inicializar el componente
  }

  // Función para añadir un ingreso y actualizar el monto inicial
  async addIncome() { // Cambié el nombre de la función a addIncome
    const incomeData = {
      Monto_Ingresado: this.Monto_Ingresado, // Cambié Monto_Gastado a Monto_Ingresado
      categoria: this.categoria,
      fecha: this.fecha,
      comentario: this.comentario,
      Comentario_ubicacion: this.Comentario_ubicacion,
    };

    try {
      // Obtener el monto inicial actual del usuario
      const user = await this.afAuth.user.pipe(first()).toPromise();
      if (user) {
        const snapshot = await this.db.database.ref(`usuarios/${user.uid}/montoInicial`).once('value');
        let montoInicial = snapshot.val() || 0;

        // Sumar el monto ingresado al monto inicial
        montoInicial += this.Monto_Ingresado; // En lugar de restar, sumamos el monto ingresado

        // Actualizar el monto inicial en la base de datos y en localStorage
        await this.db.database.ref(`usuarios/${user.uid}/montoInicial`).set(montoInicial);
        localStorage.setItem('initialAmount', montoInicial.toString());
        
        // Llamar a la función de gestión de ingresos
        await this.expenseManagementCase.addIncome(incomeData); // Llamé a la función de IncomeManagementCase
        await this.errorAlertCase.showErrorAlert('Ingreso añadido con éxito','Exito');
        this.resetForm();
        this.router.navigate(['/home']);
      } else {
        await this.errorAlertCase.showErrorAlert('Usuario no autenticado.');
      }
    } catch (error) {
      console.error('Error al añadir el ingreso:', error); // Modifiqué el mensaje de error
      await this.errorAlertCase.showErrorAlert('Error al añadir el ingreso. Inténtalo de nuevo más tarde.');
    }
  }

  resetForm() {
    this.Monto_Ingresado = 0; // Cambié Monto_Gastado a Monto_Ingresado
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
    this.router.navigate(['/home']);
  }

  formValid() {
    // Validar si todos los campos son válidos
    return this.Monto_Ingresado > 0 && this.categoria.match(/^[A-Za-z]+$/) && this.fecha && this.isValidDate(this.fecha) && this.Comentario_ubicacion.trim() !== '';
  }

  isValidDate(date: string): boolean {
    // Verificar que la fecha sea válida
    return !isNaN(new Date(date).getTime());
  }
}
