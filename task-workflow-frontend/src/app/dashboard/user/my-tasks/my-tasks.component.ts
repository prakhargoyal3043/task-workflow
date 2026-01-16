import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { API_URLS } from '../../../shared/constants/api.constants';
import { NotificationPopupComponent } from '../../../shared/components/notification-popup/notification-popup.component';
import { ConfirmationPopupComponent } from '../../../shared/components/confirmation-popup/confirmation-popup.component';

@Component({
  selector: 'app-my-tasks',
  standalone: true,
  imports: [CommonModule, NotificationPopupComponent, ConfirmationPopupComponent],
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.scss']
})
export class MyTasksComponent implements OnInit {

  tasks: any[] = [];
  loading = true;
  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'info' | 'warning' | 'error' = 'success';
  showConfirmation = false;
  confirmationMessage = '';
  confirmationTitle = '';
  confirmText = 'Confirm';
  confirmationType: 'danger' | 'warning' | 'info' = 'warning';
  pendingAction: 'approve' | 'complete' | null = null;
  pendingTaskId: number | null = null;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadMyTasks();
  }

  loadMyTasks() {
    console.log('Loading my tasks...');
    this.http.get<any[]>(`${API_URLS.TASKS.BASE}/my`)
      .subscribe({
        next: (res) => {
          console.log('My tasks loaded:', res);
          // Create a new array reference to ensure change detection
          this.tasks = [...(res || [])];
          this.loading = false;
          console.log('Tasks array updated, count:', this.tasks.length);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading my tasks:', err);
          this.loading = false;
          this.tasks = [];
          this.cdr.detectChanges();
        }
      });
  }

  approve(taskId: number) {
    this.pendingAction = 'approve';
    this.pendingTaskId = taskId;
    this.confirmationTitle = 'Start Task';
    this.confirmationMessage = 'Are you sure you want to start this task and move it to IN_PROGRESS?';
    this.confirmationType = 'info';
    this.confirmText = 'Start Task';
    this.showConfirmation = true;
  }

  complete(taskId: number) {
    this.pendingAction = 'complete';
    this.pendingTaskId = taskId;
    this.confirmationTitle = 'Complete Task';
    this.confirmationMessage = 'Are you sure you want to mark this task as COMPLETED?';
    this.confirmationType = 'info';
    this.confirmText = 'Complete';
    this.showConfirmation = true;
  }

  confirmAction() {
    if (this.pendingTaskId === null || this.pendingAction === null) return;
    
    // Save action and task ID before resetting confirmation
    const action = this.pendingAction;
    const taskId = this.pendingTaskId;
    
    // Close confirmation popup first
    this.resetConfirmation();
    this.cdr.detectChanges();
    
    // Execute action after confirmation is closed
    const status = action === 'approve' ? 'IN_PROGRESS' : 'COMPLETED';
    this.updateStatus(taskId, status);
  }

  cancelAction() {
    this.resetConfirmation();
  }

  resetConfirmation() {
    this.pendingAction = null;
    this.pendingTaskId = null;
    this.showConfirmation = false;
    this.confirmationMessage = '';
    this.confirmationTitle = '';
    this.confirmText = 'Confirm';
  }

  private updateStatus(taskId: number, status: string) {
    const payload = { status };

    this.http.put(
      `${API_URLS.TASKS.BASE}/${taskId}/status`,
      payload,
      { responseType: 'text' }
    ).subscribe({
      next: (response) => {
        console.log('✅ Task status updated successfully. Response:', response);
        console.log('✅ Response type:', typeof response);
        // Refresh task list first
        this.loadMyTasks();
        // Show notification after ensuring refresh
        const statusMessages: { [key: string]: string } = {
          'IN_PROGRESS': 'Task started and moved to IN_PROGRESS',
          'COMPLETED': 'Task marked as COMPLETED'
        };
        setTimeout(() => {
          this.showNotificationPopup(statusMessages[status] || `Task updated to ${status}`, 'success');
          this.cdr.detectChanges();
        }, 200);
      },
      error: (err) => {
        console.error('❌ Error updating task status');
        console.error('❌ Error object:', err);
        console.error('❌ Error status:', err?.status);
        console.error('❌ Error statusText:', err?.statusText);
        console.error('❌ Error message:', err?.message);
        console.error('❌ Error error:', err?.error);
        if (err?.status === 200) {
          console.log('⚠️ Backend returned 200 but Angular treated it as error. Handling as success...');
          // If backend returned 200, treat as success anyway
          this.loadMyTasks();
          const statusMessages: { [key: string]: string } = {
            'IN_PROGRESS': 'Task started and moved to IN_PROGRESS',
            'COMPLETED': 'Task marked as COMPLETED'
          };
          setTimeout(() => {
            this.showNotificationPopup(statusMessages[status] || `Task updated to ${status}`, 'success');
            this.cdr.detectChanges();
          }, 200);
        } else {
          setTimeout(() => {
            this.showNotificationPopup('Failed to update task status', 'error');
            this.cdr.detectChanges();
          }, 200);
        }
      }
    });
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
