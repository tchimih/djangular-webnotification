import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared.service';
import { MatSnackBar,MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-qualification',
  templateUrl: './qualification.component.html',
  styleUrls: ['./qualification.component.css']
})
export class QualificationComponent implements OnInit {

  constructor(private service:SharedService, private router:Router,private route: ActivatedRoute, private sharedService:SharedService,private _snackBar: MatSnackBar) { }

  formGroup: FormGroup;
  NotificationList:any = [];
  ChoicesList:any = [];
  id = null;
  src = null; 
  dst = null;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  ngOnInit(): void {
    this.getNotificationList();
    this.getChoices();
    this.route.queryParams.subscribe(params => {
      this.id = params.id;
      this.src = params.src;
      this.dst = params.dst;
    });
    this.initForm();
  }

  initForm(){
    this.formGroup = new FormGroup({
      notificationId: new FormControl('', [Validators.required]),
      qualificationType: new FormControl('', [Validators.required]),
      qualificationSubType: new FormControl('', [Validators.required]),
      qualificationComment: new FormControl(''),
    })
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

  isParamSet(){
    if (this.id && this.src && this.dst){
      return true;
    }
    return false;
  }

  getNotificationList(){
    this.service.getNotificaions().subscribe((data) => {
      this.NotificationList = data;
    })
  }

  getChoices(){
    this.service.getFormularChoices().subscribe((data) => {
      this.ChoicesList = data;
    })
  }

  qualifyCall(){
    if (this.formGroup.valid){
      this.sharedService.qualifyCall(this.formGroup.value).subscribe((data) => {
        this.openSnackBarSucess("Qualification envoyée avec succès 👍", "Fermer");
        this.formGroup.reset();
        this.router.navigate(['/notification'])
      }, (err) => {
        this.openSnackBarError("Erreur lors lors du traitement, merci de réessayer plus tard 😞", "Fermer");
      })
    }
  }



}
