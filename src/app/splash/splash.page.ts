import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router' 

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {
  progressValue = 0;
  constructor(private router: Router) { }

  ngOnInit() {
    this.startProgressBar();
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 3000); // Navegar a /login después de 20 segundos
  }
  startProgressBar() {
    const duration = 3000; // Duración del splash en milisegundos (20 segundos)
    const interval = 100;   // Intervalo de actualización (100 ms)
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
}