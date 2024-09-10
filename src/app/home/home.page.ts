import { Component } from '@angular/core';
import { SessionManager } from '../../managers/SessionManager';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  userName: string;

  constructor(private sessionManager: SessionManager) {
    this.userName = this.sessionManager.getUserName();
  }
}
