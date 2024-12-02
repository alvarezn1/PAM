import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor() {}

  /**
   * Obtiene la ubicación actual del dispositivo.
   * @returns Una Promesa que resuelve con un objeto { latitude, longitude }.
   */
// Método asincrónico para obtener la ubicación actual del dispositivo.
async getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
  try {
    // Intentamos obtener la ubicación del dispositivo utilizando el servicio de geolocalización.
    const position = await Geolocation.getCurrentPosition();
    
    // Extraemos las coordenadas (latitud y longitud) de la posición obtenida.
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // Devolvemos un objeto con las coordenadas obtenidas.
    return { latitude, longitude }; // Devolvemos las coordenadas de latitud y longitud.

  } catch (error) {
    // Si ocurre un error al obtener la ubicación, mostramos el error en la consola.
    console.error('Error obteniendo la ubicación:', error);
    
    // Lanzamos un nuevo error con un mensaje informativo para el usuario.
    throw new Error('No se pudo obtener la ubicación. Por favor, asegúrate de que los servicios de ubicación están activados.');
  }
}
}