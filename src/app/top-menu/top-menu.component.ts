import { Component, OnInit } from '@angular/core';

import { AuthInfo } from '../shared/security/auth-info';
import { AuthService } from '../shared/security/auth.service';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.css']
})
export class TopMenuComponent implements OnInit {
  authInfo: AuthInfo;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.authInfo$.subscribe(authInfo => this.authInfo = authInfo);
  }

  logout() {
    this.authService.logout();
  }
}
