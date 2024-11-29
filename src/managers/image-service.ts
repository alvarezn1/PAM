import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { HttpClient } from '@angular/common/http';  // Importa HttpClient
@Injectable({
  providedIn: 'root',
})
export class ImageService {

  constructor(private http: HttpClient) { }

  // Obtener imagen desde la cámara
  async getImageFromCamera(): Promise<{ success: boolean, message: string, imageUrl?: string }> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,  // Devuelve base64
        source: CameraSource.Camera,  // Usa la cámara
      });

      const imageUrl = image?.dataUrl; // Asegurarse de que `dataUrl` existe

      if (imageUrl) {
        return { success: true, message: 'Imagen obtenida con éxito', imageUrl };
      } else {
        return { success: false, message: 'No se pudo obtener la imagen desde la cámara.' };
      }

    } catch (error) {
      console.error('Error al obtener la imagen desde la cámara:', error);
      return { success: false, message: 'Error al obtener la imagen desde la cámara.' };
    }
  }

  // Obtener imagen desde la galería
  async getImageFromGallery(): Promise<{ success: boolean, message: string, imageUrl?: string }> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,  // Devuelve base64
        source: CameraSource.Photos,  // Usa la galería
      });

      const imageUrl = image?.dataUrl; // Asegurarse de que `dataUrl` existe

      if (imageUrl) {
        return { success: true, message: 'Imagen obtenida con éxito', imageUrl };
      } else {
        return { success: false, message: 'No se pudo obtener la imagen desde la galería.' };
      }

    } catch (error) {
      console.error('Error al obtener la imagen desde la galería:', error);
      return { success: false, message: 'Error al obtener la imagen desde la galería.' };
    }
  }

}
