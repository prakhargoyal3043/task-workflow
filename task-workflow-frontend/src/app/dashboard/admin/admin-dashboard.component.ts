import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { API_URLS } from '../../shared/constants/api.constants';
import { UserCreateComponent } from './users/user-create.component';
import { TaskCreateComponent } from './task/task-create.component';
import { UserListComponent } from './users/user-list.component';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { NotificationPopupComponent } from '../../shared/components/notification-popup/notification-popup.component';
import { ConfirmationPopupComponent } from '../../shared/components/confirmation-popup/confirmation-popup.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, UserCreateComponent, TaskCreateComponent, UserListComponent, NotificationPopupComponent, ConfirmationPopupComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  @ViewChild(UserListComponent) userListComponent!: UserListComponent;

  dashboard: any = null;
  currentUser: any = null;

  showCreateUser = false;
  showCreateTask = false;
  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'info' | 'warning' | 'error' = 'success';
  showLogoutConfirmation = false;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadDashboard();
    this.loadCurrentUser();
  }

  loadCurrentUser() {
    this.http.get<any>(API_URLS.USERS.ME).subscribe({
      next: (user) => {
        this.currentUser = user;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading current user:', err);
      }
    });
  }

  loadDashboard() {
    this.http.get<any>(API_URLS.DASHBOARD.ADMIN).subscribe({
      next: (res) => {
        this.dashboard = res;
        this.cdr.detectChanges();     // ✅ FORCE UI UPDATE
      },
      error: (err) => {
        console.error('Error loading dashboard:', err);
        this.cdr.detectChanges();
      }
    });
  }

  logout() {
    this.showLogoutConfirmation = true;
  }

  confirmLogout() {
    this.showLogoutConfirmation = false;
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  cancelLogout() {
    this.showLogoutConfirmation = false;
  }

  openCreateUser() {
    this.showCreateUser = true;
  }

  openCreateTask() {
    this.showCreateTask = true;
  }

  handleModalClose(event: 'user-created' | 'task-created' | 'cancel') {
    this.showCreateUser = false;
    this.showCreateTask = false;

    if (event === 'user-created') {
      this.showNotificationPopup('User created successfully', 'success');
      this.loadDashboard();
      // Refresh user list
      if (this.userListComponent) {
        this.userListComponent.loadUsers();
      }
    }

    if (event === 'task-created') {
      this.showNotificationPopup('Task created successfully', 'success');
      this.loadDashboard();
    }
  }

  showNotificationPopup(message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;
  }

  closeNotification() {
    this.showNotification = false;
  }
}
