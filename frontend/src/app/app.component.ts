import { Component } from '@angular/core';
import { SwPush } from "@angular/service-worker";
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
  private readonly publicKey = 'BOY8QaItgQU4dcsEm7EfR3bYKAHwzzF_vTG_Waj464SkOxFrSy4g4T7I1suW1swy3AhcSjKZBw6R3JzEcrLXVBg';
  

  constructor(private swpush: SwPush, private http:HttpClient) { }

  ngOnInit() {
    this.pushSubscription();

    this.swpush.notificationClicks.subscribe(({action, notification}) => {
      window.open(notification.data.url);
    })
    this.swpush.messages.subscribe((message) => {
      console.log(message);
    })
  }

  pushSubscription() {
    if (!this.swpush.isEnabled) {
      console.log('Notification is not enabled');
      return;
    }
    
    this.swpush.requestSubscription({
      serverPublicKey: this.publicKey,
    })
      .then((sub) => {
        console.log(JSON.stringify(sub));
        const browser = navigator.userAgent.match(/(firefox|msie|chrome|safari|trident)/ig)[0].toLowerCase();
        const data = {
          status_type: 'subscribe',
          subscription: sub.toJSON(),
          browser: browser,
        };

        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type':  'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }),
          withCredentials: true
        };

        this.http.post<any>('http://localhost:8000/webpush/save_information',JSON.stringify(data), httpOptions)
        .subscribe((res) => {
          console.log(res);
        });
      })
      .catch((err) => {
        console.log
      })
  }
}
