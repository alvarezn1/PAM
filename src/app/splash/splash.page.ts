import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/managers/StorageService';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {
  progressValue = 0;

  constructor(private router: Router, private storageService: StorageService) {}

  ngOnInit() {
    this.startProgressBar();
    setTimeout(() => {
      this.checkSession();
    }, 2000); // Ajuste del tiempo para que la barra termine primero
  }

  ionViewWillEnter() {
    this.progressValue = 0;  // Reiniciar la barra de progreso cada vez que se entra a la vista
    this.startProgressBar();
  }

  startProgressBar() {
    const duration = 2000; // Duración del splash en milisegundos (2 segundos)
    const interval = 100;  // Intervalo de actualización (100 ms)
    const increment = interval / duration;

    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += increment;
      this.progressValue = Math.min(currentProgress, 1); // Asegúrate de que el valor no supere 1

      if (currentProgress >= 1) {
        clearInterval(progressInterval);
      }
    }, interval);
  }

  async checkSession() {
    const user = await this.storageService.get('user');
    if (user) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
