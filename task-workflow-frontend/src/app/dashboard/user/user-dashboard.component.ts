import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';
import { MyTasksComponent } from './my-tasks/my-tasks.component';
import { API_URLS } from '../../shared/constants/api.constants';
import { ConfirmationPopupComponent } from '../../shared/components/confirmation-popup/confirmation-popup.component';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, MyTasksComponent, ConfirmationPopupComponent],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {

  currentUser: any = null;
  showLogoutConfirmation = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
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
