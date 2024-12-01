import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExpenseManagementCase } from '../use-cases/expense-management.use-case';
import { ErrorAlertCase } from '../use-cases/error-alert.use-case';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GeolocationService } from '../../managers/geolocation-service'; // Ajusta la ruta según la ubicación del servicio
import { ImageService } from '../../managers/image-service';
import { ActionSheetController } from '@ionic/angular';

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
  Comentario_ubicacion: string = ''; // Propiedad para la ubicación
  geolocalizacion: string = ''; // Variable para mostrar la dirección o coordenadas
  latitud: number | null = null; // Latitud para almacenar
  longitud: number | null = null; // Longitud para almacenar
  isLoading: boolean = false; // Estado de carga para geolocalización
  imageUrl: string | undefined = '';  // Aquí guardamos la URL de la imagen seleccionada

  constructor(
    private expenseManagementCase: ExpenseManagementCase,
    private router: Router,
    private errorAlertCase: ErrorAlertCase,
    private afAuth: AngularFireAuth,
    private geolocationService: GeolocationService,
    private imageService: ImageService,
    private actionSheetController: ActionSheetController
  ) {}

  ngOnInit() {
    // Aquí puedes agregar lógica si es necesario cuando el componente se inicializa
  }

  async onProfileImagePressed() {
    console.log("Abriendo ActionSheet...");
    const actionSheet = await this.actionSheetController.create({
      header: 'Selecciona una opción',
      buttons: [
        {
          text: 'Cámara',
          icon: 'camera',
          handler: async () => {
            console.log("Opción cámara seleccionada");
            const uploadResult = await this.imageService.getImageFromCamera();
            this.handleImageUploadResult(uploadResult);
          }
        },
        {
          text: 'Imágenes',
          icon: 'image',
          handler: async () => {
            console.log("Opción galería seleccionada");
            const uploadResult = await this.imageService.getImageFromGallery();
            this.handleImageUploadResult(uploadResult);
          },
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
          handler: () => { console.log("Opción cancelar seleccionada"); }
        }
      ]
    });
    await actionSheet.present();
  }
  

  // Maneja el resultado de la carga de la imagen
  handleImageUploadResult(result: any) {
    if (result.success) {
      this.imageUrl = result.imageUrl;  // Aquí se guarda la URL de la imagen seleccionada
      console.log('Imagen seleccionada:', this.imageUrl);
    } else {
      console.error('Error al seleccionar la imagen:', result.message);
      // Si lo deseas, puedes mostrar un mensaje de error al usuario con un alert
    }
  }

  // Función para añadir el gasto
  async addExpense() {
    if (!this.latitud || !this.longitud) {
      await this.errorAlertCase.showErrorAlert('Debes obtener la geolocalización antes de enviar el formulario.', 'Error');
      return; // No permite añadir el gasto sin geolocalización
    }

    // Combina latitud y longitud en una cadena con el formato "latitud,longitud"
    const geolocationString = `${this.latitud}, ${this.longitud}`;

    // Aquí agregamos la propiedad imageUrl al objeto expenseData
    const expenseData = {
      Monto_Gastado: this.Monto_Gastado,
      categoria: this.categoria,
      fecha: this.fecha,
      comentario: this.comentario,
      Comentario_ubicacion: this.Comentario_ubicacion || this.geolocalizacion, // Usa ubicación si está disponible
      geolocation: geolocationString, // Guarda la geolocalización como cadena
      imageUrl: this.imageUrl, // Agrega la URL de la imagen
    };

    try {
      await this.expenseManagementCase.addExpense(expenseData);
      await this.errorAlertCase.showErrorAlert('Gasto añadido con éxito', 'Éxito');
      this.resetForm();
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error al añadir el gasto:', error);
      await this.errorAlertCase.showErrorAlert('Error al añadir el gasto. Inténtalo de nuevo más tarde.');
    }
  }

  // Función para reiniciar el formulario
  resetForm() {
    this.Monto_Gastado = 0;
    this.categoria = '';
    this.fecha = '';
    this.comentario = '';
    this.Comentario_ubicacion = '';
    this.geolocalizacion = '';
    this.latitud = null;
    this.longitud = null;
    this.imageUrl = ''; // Asegúrate de reiniciar la imagen también
  }

  // Método para obtener la geolocalización
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

  // Función para navegar al inicio
  goHome() {
    this.router.navigate(['/home']);
  }

  // Función para validar el formulario antes de enviarlo
  formValid() {
    return (
      this.Monto_Gastado > 0 &&
      this.categoria.match(/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/)&&
      this.fecha &&
      this.isValidDate(this.fecha) &&
      this.Comentario_ubicacion.trim() !== '' && // Validación de la ubicación
      this.comentario.trim() !== '' && // Validación de comentario
      this.latitud && // Validación de la latitud
      this.longitud &&
      this.categoria.match(/^[A-Za-z\s]+$/)  // Permite letras y espacios
    );
  }

  // Función para validar la fecha
  isValidDate(date: string): boolean {
    return !isNaN(new Date(date).getTime());
  }
}
