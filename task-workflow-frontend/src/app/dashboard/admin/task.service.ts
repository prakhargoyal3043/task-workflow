import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URLS } from '../../shared/constants/api.constants';

@Injectable({ providedIn: 'root' })
export class TaskService {

  constructor(private http: HttpClient) {}

  createTask(data: any) {
    return this.http.post(API_URLS.TASKS.CREATE, data);
  }
}
