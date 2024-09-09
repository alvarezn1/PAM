import { Component, OnInit } from '@angular/core';
import { User } from "../models/user.models";
import { SessionManager } from 'src/managers/SessionManager';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  user = {} as User;

  constructor(private sessionManager: SessionManager) {}

  ngOnInit() {}

  async register() {
    await this.sessionManager.register(this.user); // Llama al método de registro del SessionManager
  }

 
}
