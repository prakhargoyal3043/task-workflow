import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URLS } from '../shared/constants/api.constants';

@Injectable({ providedIn: 'root' })
export class DashboardService {

  constructor(private http: HttpClient) {}

  getAdminDashboard() {
    return this.http.get<any>(API_URLS.DASHBOARD.ADMIN);
  }
}
