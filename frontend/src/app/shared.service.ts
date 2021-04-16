import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  readonly APIUrl   = "http://localhost:8000/api";

  constructor(private http:HttpClient) { }

  getNotificaions():Observable<any[]>{
    return this.http.get<any[]>(this.APIUrl + '/notification/');
  }

  getFormularChoices():Observable<any[]>{
    return this.http.get<any[]>(this.APIUrl + '/choices')
  }

  getUnreadNotificationCount():Observable<any[]>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }),
      withCredentials: true
    };
    return this.http.get<any[]>(this.APIUrl + '/notification/count')
  }

  qualifyCall(data):Observable<any[]>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }),
      withCredentials: true
    };
    return this.http.post<any[]>(this.APIUrl + '/qualify/', data)
  }
  
}
