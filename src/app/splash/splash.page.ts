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

  async ngOnInit() {
    await this.startProgressBar();
    this.checkSession();
  }
  
  async ionViewWillEnter() {
    this.progressValue = 0; // Reiniciar la barra de progreso cada vez que se entra a la vista
    await this.startProgressBar();
  }
  
  async startProgressBar() {
    const duration = 2000; // Duración del splash en milisegundos (2 segundos)
    const interval = 100;  // Intervalo de actualización (100 ms)
    const increment = interval / duration;
  
    let currentProgress = 0;
    
    while (currentProgress < 1) {
      currentProgress += increment;
      this.progressValue = Math.min(currentProgress, 1); // Asegúrate de que el valor no supere 1
  
      await new Promise(resolve => setTimeout(resolve, interval));
    }
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
