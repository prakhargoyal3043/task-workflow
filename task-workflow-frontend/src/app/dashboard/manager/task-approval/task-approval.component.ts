import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { API_URLS } from '../../../shared/constants/api.constants';
import { ChangeDetectorRef } from '@angular/core';
import { NotificationPopupComponent } from '../../../shared/components/notification-popup/notification-popup.component';
import { ConfirmationPopupComponent } from '../../../shared/components/confirmation-popup/confirmation-popup.component';

@Component({
  selector: 'app-task-approval',
  standalone: true,
  imports: [CommonModule, NotificationPopupComponent, ConfirmationPopupComponent],
  templateUrl: './task-approval.component.html',
  styleUrls: ['./task-approval.component.scss']
})
export class TaskApprovalComponent implements OnInit {

  tasks: any[] = [];

  @Output() taskUpdated = new EventEmitter<void>();

  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'info' | 'warning' | 'error' = 'success';
  showConfirmation = false;
  confirmationMessage = '';
  confirmationTitle = '';
  confirmText = 'Confirm';
  confirmationType: 'danger' | 'warning' | 'info' = 'warning';
  pendingAction: 'approve' | 'complete' | 'todo' | 'reject' | null = null;
  pendingTaskId: number | null = null;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    console.log('Loading tasks...');
    this.http.get<any[]>(`${API_URLS.TASKS.ALL}?status`)
      .subscribe({
        next: (res) => {
          console.log('Tasks loaded:', res);
          // Create a new array reference to ensure change detection
          this.tasks = [...(res || [])];
          console.log('Tasks array updated, count:', this.tasks.length);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading tasks:', err);
          this.tasks = [];
          this.cdr.detectChanges();
        }
      });
  }

  // ✅ TODO → TODO
  todo(taskId: number) {
    this.pendingAction = 'todo';
    this.pendingTaskId = taskId;
    this.confirmationTitle = 'Move Task to TODO';
    this.confirmationMessage = 'Are you sure you want to move this task back to TODO status?';
    this.confirmationType = 'warning';
    this.confirmText = 'Move to TODO';
    this.showConfirmation = true;
  }

  // ✅ APPROVE → IN_PROGRESS
  approve(taskId: number) {
    this.pendingAction = 'approve';
    this.pendingTaskId = taskId;
    this.confirmationTitle = 'Approve Task';
    this.confirmationMessage = 'Are you sure you want to approve this task and move it to IN_PROGRESS?';
    this.confirmationType = 'info';
    this.confirmText = 'Approve';
    this.showConfirmation = true;
  }

  // ✅ COMPLETE → COMPLETED
  complete(taskId: number) {
    this.pendingAction = 'complete';
    this.pendingTaskId = taskId;
    this.confirmationTitle = 'Complete Task';
    this.confirmationMessage = 'Are you sure you want to mark this task as COMPLETED?';
    this.confirmationType = 'info';
    this.confirmText = 'Complete';
    this.showConfirmation = true;
  }

  // ❌ REJECT → REJECTED
  reject(taskId: number) {
    this.pendingAction = 'reject';
    this.pendingTaskId = taskId;
    this.confirmationTitle = 'Reject Task';
    this.confirmationMessage = 'Are you sure you want to reject this task? This action cannot be undone.';
    this.confirmationType = 'danger';
    this.confirmText = 'Reject';
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
    const statusMap: { [key: string]: string } = {
      'approve': 'IN_PROGRESS',
      'complete': 'COMPLETED',
      'todo': 'TODO',
      'reject': 'REJECTED'
    };
    
    this.updateStatus(taskId, statusMap[action]);
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
        this.loadTasks();
        // Emit change event to refresh dashboard
        this.taskUpdated.emit();
        // Show notification after ensuring refresh
        const statusMessages: { [key: string]: string } = {
          'TODO': 'Task moved to TODO',
          'IN_PROGRESS': 'Task approved and moved to IN_PROGRESS',
          'COMPLETED': 'Task marked as COMPLETED',
          'REJECTED': 'Task rejected'
        };
        setTimeout(() => {
          this.showNotificationPopup(statusMessages[status] || `Task marked as ${status}`, 'success');
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
          this.loadTasks();
          this.taskUpdated.emit();
          const statusMessages: { [key: string]: string } = {
            'TODO': 'Task moved to TODO',
            'IN_PROGRESS': 'Task approved and moved to IN_PROGRESS',
            'COMPLETED': 'Task marked as COMPLETED',
            'REJECTED': 'Task rejected'
          };
          setTimeout(() => {
            this.showNotificationPopup(statusMessages[status] || `Task marked as ${status}`, 'success');
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
