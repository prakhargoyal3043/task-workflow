import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URLS } from '../../shared/constants/api.constants';

@Injectable({ providedIn: 'root' })
export class UserService {

  constructor(private http: HttpClient) {}

  getUsers(page = 0, size = 10) {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<any>(API_URLS.USERS.ALL, { params });
  }

  createUser(payload: any) {
    return this.http.post(API_URLS.USERS.REGISTER, payload, {
      responseType: 'text'
    });
  }

  makeManager(userId: number) {
  return this.http.put(
    API_URLS.USERS.MAKE_MANAGER(userId),
    ['MANAGER'],
    { responseType: 'text' }
  );
}

  demoteManager(userId: number) {
  return this.http.put(
    API_URLS.USERS.DEMOTE_MANAGER(userId),
    ['USER'],
    { responseType: 'text' }
  );
}

  deleteUser(userId: number) {
    return this.http.delete(API_URLS.USERS.DELETE(userId), {
      responseType: 'text'
    });
  }
}
