import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorAlertCase } from '../use-cases/error-alert.use-case';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { first } from 'rxjs/operators';
import { ExpenseManagementCase } from '../use-cases/expense-management.use-case';
import { GeolocationService } from '../../managers/geolocation-service'; // Ajusta la ruta según la ubicación del servicio
import { ImageService } from '../../managers/image-service';
import { ActionSheetController } from '@ionic/angular';
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
    private imageService: ImageService, 
    private actionSheetController: ActionSheetController
  ) {
  }

  ngOnInit() {
    // Lógica al inicializar el componente
  }
  
// Método que se ejecuta cuando el usuario presiona sobre la imagen de perfil.
async onProfileImagePressed() {
  console.log("Abriendo ActionSheet..."); // Muestra un mensaje en la consola indicando que se abrirá el ActionSheet.
  
  // Creamos el ActionSheet con las opciones disponibles.
  const actionSheet = await this.actionSheetController.create({
    header: 'Selecciona una opción', // Título del ActionSheet.
    
    // Botones que aparecerán en el ActionSheet.
    buttons: [
      {
        text: 'Cámara', // Texto que aparecerá en el botón de la cámara.
        icon: 'camera', // Icono que se mostrará en el botón.
        handler: async () => {
          console.log("Opción cámara seleccionada"); // Muestra un mensaje en la consola cuando se selecciona la opción cámara.
          // Llama al servicio para obtener una imagen desde la cámara y maneja el resultado.
          const uploadResult = await this.imageService.getImageFromCamera();
          this.handleImageUploadResult(uploadResult); // Llama al método para manejar el resultado de la carga de imagen.
        }
      },
      {
        text: 'Galeria', // Texto que aparecerá en el botón de galería.
        icon: 'image', // Icono que se mostrará en el botón.
        handler: async () => {
          console.log("Opción galería seleccionada"); // Muestra un mensaje en la consola cuando se selecciona la opción galería.
          // Llama al servicio para obtener una imagen desde la galería y maneja el resultado.
          const uploadResult = await this.imageService.getImageFromGallery();
          this.handleImageUploadResult(uploadResult); // Llama al método para manejar el resultado de la carga de imagen.
        },
      },
      {
        text: 'Cancelar', // Texto que aparecerá en el botón de cancelar.
        icon: 'close', // Icono de cierre para el botón cancelar.
        role: 'cancel', // Establece el rol de este botón como "cancelar", lo que lo hace especial para cerrar el ActionSheet.
        handler: () => { 
          console.log("Opción cancelar seleccionada"); // Muestra un mensaje en la consola cuando se selecciona la opción cancelar.
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
    this.Monto_Ingresado = 0; 
    this.categoria = '';
    this.fecha = '';
    this.comentario = '';
    this.geolocalizacion = '';
    this.latitud = null;
    this.longitud = null;
    this.imageUrl ='';
  }

// Método asincrónico para obtener la geolocalización del dispositivo.
async getGeolocation() {
  try {
    this.isLoading = true; // Indicamos que la carga está en proceso.
    
    // Llamamos al servicio de geolocalización para obtener la latitud y longitud actuales.
    const { latitude, longitude } = await this.geolocationService.getCurrentLocation();
    
    // Asignamos la geolocalización en formato de texto a la variable 'geolocalizacion'.
    this.geolocalizacion = `Lat: ${latitude}, Lon: ${longitude}`; // Aquí puedes modificar la forma en que se muestra la geolocalización
    
    // Asignamos las coordenadas a las variables latitud y longitud.
    this.latitud = latitude;
    this.longitud = longitude;

  } catch (error) {
    console.error(error); // Muestra un error en la consola si algo sale mal al obtener la geolocalización.
    
    // Mensaje en caso de error al obtener la ubicación.
    this.geolocalizacion = 'No se pudo obtener la ubicación.';
    
    // Establece un valor por defecto para el comentario de la ubicación si falla la geolocalización.
    this.Comentario_ubicacion = 'No disponible'; 
  } finally {
    // Indicamos que el proceso de carga ha terminado.
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
      this.categoria.match(/^[A-Za-z\s]+$/) &&  // Permitir letras y espacios en categoría
      this.fecha && this.isValidDate(this.fecha) &&
      this.Comentario_ubicacion.trim() !== '' &&
      this.comentario.trim() !== '' && // Validación de comentario
      this.latitud !== null &&  // Validación explícita de latitud y longitud
      this.longitud !== null
    );
  }
  
  isValidDate(date: string): boolean {
    // Verificar que la fecha sea válida
    return !isNaN(new Date(date).getTime());
  }
}  