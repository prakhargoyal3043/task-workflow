import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-popup.component.html',
  styleUrls: ['./notification-popup.component.scss']
})
export class NotificationPopupComponent {
  @Input() message: string = '';
  @Input() type: 'success' | 'info' | 'warning' | 'error' = 'success';
  @Output() close = new EventEmitter<void>();

  closePopup() {
    this.close.emit();
  }
}
