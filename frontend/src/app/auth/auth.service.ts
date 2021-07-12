import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private IsAuthenticated = false;
  private token: string;
  private authStatusListener = new Subject<boolean>();
  constructor(private http: HttpClient) {}

  getToken() {
    return this.token;
  }
  getAuthStatusListener () {
    return this.authStatusListener.asObservable();
  }
  getIsAuth () {
    return this.IsAuthenticated;
  }
  creatUser(email: string, password: string) {
    const authData: AuthData = {
      email,
      password,
    };
    this.http
      .post('http://localhost:3000/api/user/signup', authData)
      .subscribe((response) => {
        console.log(response);
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email,
      password,
    };
    this.http
      .post<{ token: string }>('http://localhost:3000/api/user/login', authData)
      .subscribe((response) => {
        const token = response.token;
        this.token = token;
        if (token) {
          this.IsAuthenticated = true;
          this.authStatusListener.next(true);
        }
      });
  }
}