import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

import { LoginService } from '../login.service';
import { AlertService } from '../../alert.service';
import { JwtHelper } from 'angular2-jwt';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  username: string;
  password: string;
  jwtHelper: JwtHelper = new JwtHelper();
  isLogging = false;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private alert: AlertService
  ) { }

  ngOnInit() {
    if (sessionStorage.getItem('token')) {
      this.router.navigate(['purchase/reorder-point']);
    }
  }

  enterLogin(event) {
    // enter login
    if (event.keyCode === 13) {
      this.doLogin();
    }
  }

  doLogin() {
    this.isLogging = true;
    this.loginService.doLogin(this.username, this.password)
      .then((res: any) => {

        const decodedToken = this.jwtHelper.decodeToken(res.token);
        const fullname = `${decodedToken.fullname}`;

        sessionStorage.setItem('token', res.token);
        sessionStorage.setItem('fullname', fullname);
        // hide spinner
        this.isLogging = false;
        // redirect to admin module
        this.router.navigate(['purchase/reorder-point']);
      })
      .catch((error) => {
        this.isLogging = false;
        //this.alert.error(JSON.stringify(error));
        this.alert.error('ชื่อผู้้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
      });
  }
}