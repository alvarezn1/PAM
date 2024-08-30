import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { isEmpty } from 'rxjs';
import { SessionManager } from 'src/managers/SessionManager';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(private router: Router, private sessionManager: SessionManager) {
   }
   user: string = '';
   email: string = '';
   password: string = '';
   password2: string = '';
   

  ngOnInit() {
   
  }
  onRegistrarseButtonPressed() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!this.user || !this.email || !this.password || !this.password2){
      alert('Por favor, complete todos los campos');
    }else{
      if(!emailPattern.test(this.email)){
        alert('Por favor, ingrese un correo electronico valido')
      }else{
        if(this.password == this.password2){
          this.router.navigate(['/login'])
         }else{
           alert('Las contraseñas no coinciden');
         }

      }
      
    }
    }
  }




