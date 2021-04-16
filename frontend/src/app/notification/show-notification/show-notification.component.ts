import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-show-notification',
  templateUrl: './show-notification.component.html',
  styleUrls: ['./show-notification.component.css']
})
export class ShowNotificationComponent implements OnInit {

  NotificationList:any = [];

  constructor(private service:SharedService, private router:Router) { }

  ngOnInit(): void {
    this.refreshNotificationList();
  }

  refreshNotificationList(){
    this.service.getNotificaions().subscribe((data) => {
      this.NotificationList = data;
    })
  }

  closeNotif(id){
    this.NotificationList.splice(id,1);
  }

  qualifyCall(notification){
    console.log(notification)
    this.router.navigate(['/qualification'], {
      queryParams: {
        'id' : notification.NotificationId,
        'src': notification.NotificationSrcExt,
        'dst': notification.NotificationDestExt
      }
    });
  }

}
