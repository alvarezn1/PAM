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

  // Método que se ejecuta cuando el usuario presiona sobre la imagen de perfil.
async onProfileImagePressed() {
  console.log("Abriendo ActionSheet..."); // Muestra un mensaje en la consola indicando que se abrirá el ActionSheet.
  
  // Creamos el ActionSheet con las opciones disponibles.
  const actionSheet = await this.actionSheetController.create({
    header: 'Selecciona una opción', // Título que se muestra en la parte superior del ActionSheet.
    
    // Definimos los botones que aparecerán en el ActionSheet.
    buttons: [
      {
        text: 'Cámara', // Texto del botón para la opción de cámara.
        icon: 'camera', // Icono que se mostrará en el botón de cámara.
        handler: async () => {
          console.log("Opción cámara seleccionada"); // Mensaje en la consola cuando se selecciona la opción cámara.
          // Llama al servicio para obtener una imagen desde la cámara y maneja el resultado.
          const uploadResult = await this.imageService.getImageFromCamera();
          this.handleImageUploadResult(uploadResult); // Llama al método para manejar el resultado de la imagen tomada.
        }
      },
      {
        text: 'Imágenes', // Texto del botón para la opción de galería.
        icon: 'image', // Icono que se mostrará en el botón de galería.
        handler: async () => {
          console.log("Opción galería seleccionada"); // Mensaje en la consola cuando se selecciona la opción de galería.
          // Llama al servicio para obtener una imagen desde la galería y maneja el resultado.
          const uploadResult = await this.imageService.getImageFromGallery();
          this.handleImageUploadResult(uploadResult); // Llama al método para manejar el resultado de la imagen seleccionada.
        },
      },
      {
        text: 'Cancelar', // Texto del botón de cancelar.
        icon: 'close', // Icono de cierre para el botón de cancelar.
        role: 'cancel', // Define este botón como de rol "cancelar", para que funcione como un cierre del ActionSheet.
        handler: () => { 
          console.log("Opción cancelar seleccionada"); // Mensaje en la consola cuando se selecciona la opción cancelar.
        }
      }
    ]
  });

  await actionSheet.present(); // Presenta el ActionSheet en la interfaz de usuario.
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

// Método asincrónico para obtener la geolocalización del dispositivo.
async getGeolocation() {
  try {
    // Indicamos que el proceso de obtención de la ubicación está en progreso.
    this.isLoading = true;
    
    // Llamamos al servicio de geolocalización para obtener las coordenadas actuales del dispositivo.
    const { latitude, longitude } = await this.geolocationService.getCurrentLocation();
    
    // Asignamos las coordenadas en formato de texto a la variable 'geolocalizacion' para mostrarla.
    this.geolocalizacion = `Lat: ${latitude}, Lon: ${longitude}`; // Aquí puedes modificar la forma en que se muestra la geolocalización.
  
    // Asignamos las coordenadas obtenidas (latitud y longitud) a las variables correspondientes.
    this.latitud = latitude;
    this.longitud = longitude;

  } catch (error) {
    // Si ocurre un error al obtener la geolocalización, lo mostramos en la consola.
    console.error(error);
    
    // En caso de error, asignamos un mensaje predeterminado a la variable 'geolocalizacion'.
    this.geolocalizacion = 'No se pudo obtener la ubicación.';
    
    // Asignamos un valor por defecto a 'Comentario_ubicacion' en caso de fallo.
    this.Comentario_ubicacion = 'No disponible'; 
  } finally {
    // Independientemente de si se obtuvo o no la ubicación, indicamos que la carga ha terminado.
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
