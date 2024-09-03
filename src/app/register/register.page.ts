import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { isEmpty } from 'rxjs';
import { SessionManager } from 'src/managers/SessionManager';
import { User } from "../models/user.models";
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  user = {} as User;

  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private afAuth: AngularFireAuth,
    private navCtrl: NavController
  ) {}
   
   
  

  ngOnInit() {

  }
  async register(user: User){
    if(this.formValidation()){
      let loader = await this.loadingCtrl.create({message:"Espere por favor"})
      await loader.present();

      try{
        await this.afAuth.createUserWithEmailAndPassword(user.email,user.password).then(data =>{
          console.log(data);

          this.navCtrl.navigateRoot("login")
        })

      }catch (error:any){
        error.message = "Error al registrarse";
        let errormessage = error.message || error.getLocalizedMessage();

        this.showToast(errormessage)
      }
      await loader.dismiss();
    }
  }
  formValidation(){
    if(!this.user.email){
      this.showToast("Ingrese un email");
      return false;
    }
    if(!this.user.password){
      this.showToast("Ingrese una contraseña");
      return false;
  }
  return true;

  
  }
  showToast(message: string){
    this.toastCtrl.create({
      message: message,
      duration: 4000
    }).then(toastData => toastData.present());
  }
  }




