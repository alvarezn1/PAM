import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { HttpClient } from '@angular/common/http';  // Importa HttpClient
@Injectable({
  providedIn: 'root',
})
export class ImageService {

  constructor(private http: HttpClient) { }

  // Método para obtener una imagen desde la cámara
async getImageFromCamera(): Promise<{ success: boolean, message: string, imageUrl?: string }> {
  try {
    // Usamos el servicio de la cámara para capturar una imagen
    const image = await Camera.getPhoto({
      quality: 90, // Calidad de la imagen, en un rango de 0 a 100
      allowEditing: false, // No permitir editar la imagen después de capturarla
      resultType: CameraResultType.DataUrl,  // Devuelve la imagen como una cadena en base64
      source: CameraSource.Camera,  // Usamos la cámara del dispositivo para capturar la imagen
    });

    // Extraemos la URL de la imagen obtenida (en formato base64)
    const imageUrl = image?.dataUrl; // Verificamos si `dataUrl` existe

    // Si la imagen fue obtenida correctamente, devolvemos un objeto con el éxito y la URL de la imagen.
    if (imageUrl) {
      return { success: true, message: 'Imagen obtenida con éxito', imageUrl };
    } else {
      // Si no se pudo obtener la imagen, devolvemos un mensaje de error.
      return { success: false, message: 'No se pudo obtener la imagen desde la cámara.' };
    }

  } catch (error) {
    // Si ocurre un error al intentar obtener la imagen desde la cámara, lo mostramos en la consola
    console.error('Error al obtener la imagen desde la cámara:', error);
    
    // Devolvemos un mensaje de error si ocurre algún problema.
    return { success: false, message: 'Error al obtener la imagen desde la cámara.' };
  }
}

// Método para obtener una imagen desde la galería
async getImageFromGallery(): Promise<{ success: boolean, message: string, imageUrl?: string }> {
  try {
    // Usamos el servicio de la cámara para obtener una imagen de la galería del dispositivo
    const image = await Camera.getPhoto({
      quality: 90, // Calidad de la imagen, en un rango de 0 a 100
      allowEditing: false, // No permitir editar la imagen después de seleccionarla
      resultType: CameraResultType.DataUrl,  // Devuelve la imagen como una cadena en base64
      source: CameraSource.Photos,  // Usamos la galería de fotos del dispositivo
    });

    // Extraemos la URL de la imagen obtenida (en formato base64)
    const imageUrl = image?.dataUrl; // Verificamos si `dataUrl` existe

    // Si la imagen fue obtenida correctamente, devolvemos un objeto con el éxito y la URL de la imagen.
    if (imageUrl) {
      return { success: true, message: 'Imagen obtenida con éxito', imageUrl };
    } else {
      // Si no se pudo obtener la imagen, devolvemos un mensaje de error.
      return { success: false, message: 'No se pudo obtener la imagen desde la galería.' };
    }

  } catch (error) {
    // Si ocurre un error al intentar obtener la imagen desde la galería, lo mostramos en la consola
    console.error('Error al obtener la imagen desde la galería:', error);
    
    // Devolvemos un mensaje de error si ocurre algún problema.
    return { success: false, message: 'Error al obtener la imagen desde la galería.' };
  }
}
}