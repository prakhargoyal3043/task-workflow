import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent {

  @Output() close = new EventEmitter<'user-created' | 'cancel'>();

  userForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.userForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    role: ['USER']
  });
  }

  submit() {
    if (this.userForm.invalid) return;

    const payload = {
      ...this.userForm.value,
      roles: [this.userForm.value.role] // IMPORTANT
    };

    this.userService.createUser(payload).subscribe(() => {
      this.close.emit('user-created');
    });
  }
}