import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { API_URLS } from '../../shared/constants/api.constants';
import { AuthService } from '../../auth/auth.service';
import { TaskApprovalComponent } from './task-approval/task-approval.component';
import { TaskCreateComponent } from './task-create/task-create.component';
import { ChangeDetectorRef } from '@angular/core';
import { NotificationPopupComponent } from '../../shared/components/notification-popup/notification-popup.component';
import { ConfirmationPopupComponent } from '../../shared/components/confirmation-popup/confirmation-popup.component';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule, TaskApprovalComponent, TaskCreateComponent, NotificationPopupComponent, ConfirmationPopupComponent],
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.scss']
})
export class ManagerDashboardComponent implements OnInit {

  @ViewChild(TaskApprovalComponent) taskApprovalComponent!: TaskApprovalComponent;

  dashboard: any = {};
  currentUser: any = null;
  showCreateTask = false;
  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'info' | 'warning' | 'error' = 'success';
  showLogoutConfirmation = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
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
    this.http.get(API_URLS.DASHBOARD.MANAGER)
      .subscribe({
        next: (res) => {
          this.dashboard = res;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading dashboard:', err);
          this.cdr.detectChanges();
        }
      });
  }

  openCreateTask() {
    this.showCreateTask = true;
  }

  handleModalClose(event: 'task-created' | 'cancel') {
    this.showCreateTask = false;

    if (event === 'task-created') {
      this.showNotificationPopup('Task created successfully', 'success');
      this.loadDashboard();
      // Refresh task approval table
      if (this.taskApprovalComponent) {
        this.taskApprovalComponent.loadTasks();
      }
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

  onTaskUpdated(){
    this.loadDashboard();
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
}
