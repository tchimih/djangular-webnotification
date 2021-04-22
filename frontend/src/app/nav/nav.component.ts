import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/shared.service';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar,MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

  title = 'frontend';

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  
  unreadNotifCount:any = [];
  oldUnreadNotifCount:any = [];
  URL = 'ws://localhost:8000/stocks';
  socket:WebSocket;


  ngOnInit(): void {
    this.getUnreadNotificationCount();
    this.setsock();
  }

  constructor(private breakpointObserver: BreakpointObserver, 
              private router:Router,
              private service:SharedService,
              private _snackBar: MatSnackBar) {
                this.unreadNotifCount = "0";
              }

  openSnackBarSucess(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top'

    });
  }
  
  setsock() {
    console.log('starting socket connection ...');
    this.socket = new WebSocket(this.URL + '/stocks/');

    this.socket.onopen = () => {
      console.log('WebSockets connection created.');
      this.start1();
    };

    this.socket.onmessage = (event) => {
      //  var data = JSON.parse(event.data);
      if (event.data.length < 3) {
        this.oldUnreadNotifCount = this.unreadNotifCount;
        this.unreadNotifCount = event.data;
        if (this.unreadNotifCount > this.oldUnreadNotifCount){
          this.openSnackBarSucess("🔔 Nouvelle notification !", "Consulter")
        }
      }
      console.log("data from socket:" + event.data);
      this.title = event.data;
    };

    if (this.socket.readyState == WebSocket.OPEN) {
      this.socket.onopen(null);
    }
  }

  start1(){
    this.socket.send('start');
  }

  stop1() {
    this.socket.send('stop');
  }

  isLoggedIn(){
    if (localStorage.getItem('token')) {
      return true;
    }
    return false;
  }

  logout(){
    this.stop1();
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  getUnreadNotificationCount(){
    this.service.getUnreadNotificationCount().subscribe((data) => {
      this.unreadNotifCount = data;
    })
  }

}
