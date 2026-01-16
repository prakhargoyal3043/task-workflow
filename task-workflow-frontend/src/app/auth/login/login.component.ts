import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,          // ✅ for *ngIf, *ngFor
    ReactiveFormsModule    // ✅ for formGroup, formControlName
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.authService.login(this.loginForm.value).subscribe({
      next: (token: string) => {
        this.authService.saveToken(token);
        this.redirectByRole();
      },
      error: () => alert('Invalid credentials')
    });
  }

  private redirectByRole() {
    const role = this.authService.getRole();

    if (role === 'ADMIN') {
      this.router.navigate(['/dashboard/admin']);
    } else if (role === 'MANAGER') {
      this.router.navigate(['/dashboard/manager']);
    } else {
      this.router.navigate(['/dashboard/user']);
    }
  }
}
