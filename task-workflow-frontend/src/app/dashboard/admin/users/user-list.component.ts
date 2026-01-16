import { Component, EventEmitter, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { API_URLS } from '../../../shared/constants/api.constants';
import { NotificationPopupComponent } from '../../../shared/components/notification-popup/notification-popup.component';
import { ConfirmationPopupComponent } from '../../../shared/components/confirmation-popup/confirmation-popup.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, NotificationPopupComponent, ConfirmationPopupComponent],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  users: any[] = [];

  @Output() changed = new EventEmitter<void>();

  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'info' | 'warning' | 'error' = 'success';
  showConfirmation = false;
  confirmationMessage = '';
  confirmationTitle = '';
  confirmationType: 'danger' | 'warning' | 'info' = 'warning';
  confirmText = 'Confirm';
  pendingAction: 'promote' | 'demote' | 'delete' | null = null;
  pendingUserId: number | null = null;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.http.get<any>(API_URLS.USERS.ALL)
      .subscribe({
        next: (res) => {
          // Create a new array reference to ensure change detection
          this.users = [...(res.content || [])];
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading users:', err);
          this.users = [];
          this.cdr.detectChanges();
        }
      });
  }

  promote(id: number) {
    this.pendingAction = 'promote';
    this.pendingUserId = id;
    this.confirmationTitle = 'Promote User';
    this.confirmationMessage = 'Are you sure you want to promote this user to MANAGER? They will have additional permissions.';
    this.confirmationType = 'warning';
    this.confirmText = 'Promote';
    this.showConfirmation = true;
  }

  demote(id: number) {
    this.pendingAction = 'demote';
    this.pendingUserId = id;
    this.confirmationTitle = 'Demote Manager';
    this.confirmationMessage = 'Are you sure you want to demote this manager to USER? They will lose manager permissions.';
    this.confirmationType = 'warning';
    this.confirmText = 'Demote';
    this.showConfirmation = true;
  }

  delete(id: number) {
    this.pendingAction = 'delete';
    this.pendingUserId = id;
    this.confirmationTitle = 'Delete User';
    this.confirmationMessage = 'Are you sure you want to delete this user? This action cannot be undone.';
    this.confirmationType = 'danger';
    this.confirmText = 'Delete';
    this.showConfirmation = true;
  }

  confirmAction() {
    if (this.pendingUserId === null || this.pendingAction === null) return;

    // Save action and user ID before resetting confirmation
    const action = this.pendingAction;
    const userId = this.pendingUserId;

    // Close confirmation popup first
    this.resetConfirmation();
    this.cdr.detectChanges();

    // Execute action after confirmation is closed
    switch (action) {
      case 'promote':
        this.http.put(API_URLS.USERS.MAKE_MANAGER(userId), ['MANAGER'], { responseType: 'text' })
          .subscribe({
            next: () => {
              // Refresh user list first, then dashboard
              this.loadUsers();
              this.changed.emit();
              // Show notification after ensuring refresh
              setTimeout(() => {
                this.showNotificationPopup('User promoted to MANAGER', 'success');
                this.cdr.detectChanges();
              }, 200);
            },
            error: (err) => {
              console.error('Error promoting user:', err);
              setTimeout(() => {
                this.showNotificationPopup('Failed to promote user', 'error');
                this.cdr.detectChanges();
              }, 200);
            }
          });
        break;

      case 'demote':
        this.http.put(API_URLS.USERS.DEMOTE_MANAGER(userId), ['USER'], { responseType: 'text' })
          .subscribe({
            next: () => {
              // Refresh user list first, then dashboard
              this.loadUsers();
              this.changed.emit();
              // Show notification after ensuring refresh
              setTimeout(() => {
                this.showNotificationPopup('Manager demoted to USER', 'success');
                this.cdr.detectChanges();
              }, 200);
            },
            error: (err) => {
              console.error('Error demoting user:', err);
              setTimeout(() => {
                this.showNotificationPopup('Failed to demote user', 'error');
                this.cdr.detectChanges();
              }, 200);
            }
          });
        break;

      case 'delete':
        this.http.delete(API_URLS.USERS.DELETE(userId), { responseType: 'text' })
          .subscribe({
            next: () => {
              // Refresh user list first, then dashboard
              this.loadUsers();
              this.changed.emit();
              // Show notification after ensuring refresh
              setTimeout(() => {
                this.showNotificationPopup('User deleted successfully', 'success');
                this.cdr.detectChanges();
              }, 200);
            },
            error: (err) => {
              console.error('Error deleting user:', err);
              setTimeout(() => {
                this.showNotificationPopup('Failed to delete user', 'error');
                this.cdr.detectChanges();
              }, 200);
            }
          });
        break;
    }
  }

  cancelAction() {
    this.resetConfirmation();
  }

  resetConfirmation() {
    this.pendingAction = null;
    this.pendingUserId = null;
    this.showConfirmation = false;
    this.confirmationMessage = '';
    this.confirmationTitle = '';
    this.confirmText = 'Confirm';
  }

  showNotificationPopup(message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;
  }

  closeNotification() {
    this.showNotification = false;
  }
  hasRole(user: any, role: string): boolean {
    return user.roles.some((r: any) => r.name === role);
  }
}
