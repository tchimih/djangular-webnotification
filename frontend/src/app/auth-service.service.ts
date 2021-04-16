import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  readonly APIUrl   = "http://localhost:8000/api";

  constructor(private http:HttpClient, public jwtHelper: JwtHelperService) { }

  login(data):Observable<any>{
    return this.http.post(this.APIUrl + '/login/', data);
  }

  public isAuthenticated(): boolean {    
    const token = localStorage.getItem('token');  
    // true or false
    return !this.jwtHelper.isTokenExpired(token);
  }
}
