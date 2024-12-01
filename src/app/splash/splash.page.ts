import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/managers/StorageService';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit, OnDestroy {
  progressValue = 0;
  private intervalId: any;

  constructor(private router: Router, private storageService: StorageService) {}

  ngOnInit() {
    this.initializeSplash();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId); // Limpia el intervalo al destruir el componente
    }
  }

  async ionViewWillEnter() {
    this.progressValue = 0;
    await this.startProgressBar();
  }

  async initializeSplash() {
    this.startAutoRefresh(); // Inicia el refresh automático
    await this.startProgressBar();
  }

  async startProgressBar() {
    const duration = 2000;
    const interval = 30;
    const increment = interval / duration;

    while (this.progressValue < 1) {
      this.progressValue = Math.min(this.progressValue + increment, 1);
      await new Promise(resolve => setTimeout(resolve, interval));
    }

    clearInterval(this.intervalId); // Detiene el refresh cuando la barra alcanza el 100%
    await this.checkSession(); // Verifica la sesión al finalizar el progreso
  }

  async checkSession() {
    const user = await this.storageService.get('user');
    if (user) {
      this.router.navigate(['/home']); // Redirige a Home si hay un usuario
    } else {
      this.router.navigate(['/login']); // Redirige a Login si no hay usuario
    }
  }

  startAutoRefresh() {
    this.intervalId = setInterval(async () => {
      console.log('Verificando sesión...'); // Log para verificar que funciona
      await this.checkSession(); // Verifica la sesión cada 500 ms
    }, 500); // Intervalo de 500 ms
  }
}
