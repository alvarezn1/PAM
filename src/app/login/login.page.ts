import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationSessionCase } from '../use-cases/navigation-session.use-case';  // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';

  constructor(
    private navigationSessionCase: NavigationSessionCase,  // Inyectamos el servicio
    private router: Router
  ) {}

  ngOnInit() {}

  async onLoginButtonPressed() {
    await this.navigationSessionCase.login(this.email, this.password);  // Llamamos al método login del servicio
  }

  onRegisterButtonPressed() {
    this.router.navigate(['/register']);
  }
}
