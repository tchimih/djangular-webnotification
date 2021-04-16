import { Component, OnInit } from '@angular/core';
import { MatSnackBar,MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from 'src/app/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formGroup: FormGroup;
  error:Boolean;
  sucess:Boolean;
  message:string;
  action:string;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private authService:AuthServiceService, private router:Router, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.initForm();
    this.error=false;
    this.sucess=false;
  }

  openSnackBarError(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: ['red-snackbar','login-snackbar'],

    });
  }

  openSnackBarSucess(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'

    });
  }

  loginProcess(){
    if (this.formGroup.valid){
      this.authService.login(this.formGroup.value).subscribe(res => {
        if (res.access) {
          localStorage.setItem('token', res.access);
          this.sucess=true;
          this.message = "Bienvenue dans l'application 😃";
          this.action = "OK";
          this.openSnackBarSucess(this.message, this.action);
          this.router.navigate(['/notification'])
        }
      }, (err) => {
        this.error = true;
        this.message = "Authentification échouée !";
        console.log(err);
        this.action = "Fermer";
        this.openSnackBarError(this.message, this.action);
      })
    }
  }

  isAuthError(){
    return this.error;
  }

  initForm(){
    this.formGroup = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    })
  }
}
