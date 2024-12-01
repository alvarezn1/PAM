import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Test',
  webDir: 'www',
  plugins: {
    Camera: {
      ios: {
        cameraDevice: 'rear', // o 'front' dependiendo de la cámara que quieras usar
        saveToGallery: true,  // Guardar la foto en la galería de iOS
      },
      android: {
        quality: 90, // Definir la calidad de la foto en Android (opcional)
        saveToGallery: true, // Guardar la foto en la galería de Android
      }
    },
    // Otras configuraciones de plugins si es necesario
  }
};

export default config;
