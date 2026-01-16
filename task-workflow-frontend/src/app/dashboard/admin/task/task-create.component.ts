import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { API_URLS } from '../../../shared/constants/api.constants';

@Component({
  selector: 'app-task-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.scss']
})
export class TaskCreateComponent implements OnInit {

  @Output() close = new EventEmitter<'task-created' | 'cancel'>();

  users: any[] = [];

  taskForm;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      assignedTo: ['', Validators.required] // USER ID
    });
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.http.get<any>(API_URLS.USERS.ALL).subscribe(res => {
      this.users = res.content; // VERY IMPORTANT
    });
  }

  submit() {
    if (this.taskForm.invalid) return;

    const payload = {
      title: this.taskForm.value.title,
      description: this.taskForm.value.description,
      assignedUserId: this.taskForm.value.assignedTo // 🔥 backend expects this
    };

    this.http.post(API_URLS.TASKS.CREATE, payload).subscribe({
      next: () => {
        this.close.emit('task-created');
      },
      error: err => console.error(err)
    });
  }
}
