import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionManager } from 'src/managers/SessionManager';
import { User } from "../models/user.models";
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user = {} as User;

  constructor(private sessionManager: SessionManager) {} 

  



    

  ngOnInit() {
  }

  async login(){
    await this.sessionManager.performLogin(this.user)
  }
 
  
 
  }





 

  



