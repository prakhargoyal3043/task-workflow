import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URLS } from '../shared/constants/api.constants';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private http: HttpClient) {}

  login(data: any) {
  return this.http.post(API_URLS.AUTH.LOGIN, data, {
    responseType: 'text'
  });
}

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getRole(): string {
  const token = localStorage.getItem('token');
  if (!token) return '';

  const payload = JSON.parse(atob(token.split('.')[1]));
  console.log('JWT payload:', payload);

  // Case 1: single role
  if (payload.role) {
    return payload.role;
  }

  // Case 2: roles array
  if (payload.roles && payload.roles.length > 0) {
    return payload.roles[0];
  }

  // Case 3: Spring Security authorities
  if (payload.authorities && payload.authorities.length > 0) {
    return payload.authorities[0].replace('ROLE_', '');
  }

  return '';
}


  logout() {
    localStorage.clear();
  }
}
