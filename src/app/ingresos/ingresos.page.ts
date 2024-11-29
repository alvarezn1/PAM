import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorAlertCase } from '../use-cases/error-alert.use-case';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { first } from 'rxjs/operators';
import { ExpenseManagementCase } from '../use-cases/expense-management.use-case';
import { GeolocationService } from '../../managers/geolocation-service'; // Ajusta la ruta según la ubicación del servicio
import { ImageService } from '../../managers/image-service';

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
  geolocalizacion: string = ''; // Variable para mostrar la dirección o coordenadas
  latitud: number | null = null; // Latitud para almacenar
  longitud: number | null = null; // Longitud para almacenar
  isLoading: boolean = false; // Estado de carga para geolocalización
  imageUrl: string | undefined;  // Aquí guardamos la URL de la imagen seleccionada

  constructor(
    private expenseManagementCase: ExpenseManagementCase,
    private router: Router,
    private errorAlertCase: ErrorAlertCase,
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private geolocationService: GeolocationService,
    private imageService: ImageService
  ) {
  }

  ngOnInit() {
    // Lógica al inicializar el componente
  }
   // Método para seleccionar foto
 async selectPhoto() {
  const result = await this.imageService.getImageFromCamera(); // Llama a tu servicio para obtener la imagen
  if (result.success) {
    this.imageUrl = result.imageUrl;  // URL de la imagen seleccionada
    
    // Si deseas hacer algo con la imagen, como convertirla a Base64, ya lo has hecho en el servicio.
    console.log('Imagen seleccionada:', this.imageUrl);

    // Asegúrate de que la imagen se sube correctamente al servidor o se guarda donde corresponda.
    // La imagen está almacenada en imageUrl, puedes guardarla con otros datos de gasto si es necesario.
  } else {
    console.error(result.message); // Maneja el error si no se pudo obtener la imagen
  }
}
  async addIncome() {
    if (!this.latitud || !this.longitud) {
      await this.errorAlertCase.showErrorAlert('Debes obtener la geolocalización antes de enviar el formulario.', 'Error');
      return; // No permite añadir el gasto sin geolocalización
    }
  // Combina latitud y longitud en una cadena con el formato "latitud,longitud"
    const geolocationString = `${this.latitud}, ${this.longitud}`;

  // Función para añadir un ingreso y actualizar el monto inicial
    const incomeData = {
      Monto_Ingresado: this.Monto_Ingresado, // Cambié Monto_Gastado a Monto_Ingresado
      categoria: this.categoria,
      fecha: this.fecha,
      comentario: this.comentario,
      Comentario_ubicacion: this.Comentario_ubicacion,
      geolocation: geolocationString,// Guarda la geolocalización como cadena
      imageUrl: this.imageUrl, // Agrega la URL de la imagen
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
    this.geolocalizacion = '';
    this.latitud = null;
    this.longitud = null;
    this.imageUrl ='';
  }

  async getGeolocation() {
    try {
      this.isLoading = true;
      const { latitude, longitude } = await this.geolocationService.getCurrentLocation();
      this.geolocalizacion = `Lat: ${latitude}, Lon: ${longitude}`; // Aquí puedes modificar la forma en que se muestra la geolocalización
  
      // Asigna la latitud y longitud a las variables
      this.latitud = latitude;
      this.longitud = longitude;
  
    } catch (error) {
      console.error(error);
      this.geolocalizacion = 'No se pudo obtener la ubicación.';
      this.Comentario_ubicacion = 'No disponible'; // Valor por defecto si falla la geolocalización
    } finally {
      this.isLoading = false;
    }
  }
  

  goHome() {
    this.router.navigate(['/home']);
  }

  formValid() {
    // Validar si todos los campos son válidos
    return (
    this.Monto_Ingresado > 0 &&
     this.categoria.match(/^[A-Za-z]+$/) && 
     this.fecha && this.isValidDate(this.fecha) && 
     this.isValidDate(this.fecha) &&
     this.Comentario_ubicacion.trim() !== '' &&
     this.comentario.trim() !== '' && // Validación de comentario
     this.latitud && // Validación de la latitud
     this.longitud &&
     this.categoria.match(/^[A-Za-z\s]+$/) 
   );
  }

  isValidDate(date: string): boolean {
    // Verificar que la fecha sea válida
    return !isNaN(new Date(date).getTime());
  }
}
