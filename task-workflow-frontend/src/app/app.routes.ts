import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AdminDashboardComponent } from './dashboard/admin/admin-dashboard.component';
import { UserCreateComponent } from './dashboard/admin/users/user-create.component';
import { TaskCreateComponent } from './dashboard/admin/task/task-create.component';
import { ManagerDashboardComponent } from './dashboard/manager/manager-dashboard.component';
import { UserDashboardComponent } from './dashboard/user/user-dashboard.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
      path: 'dashboard/admin',
      component: AdminDashboardComponent,
      children: [
        { path: 'users/create', component: UserCreateComponent },
        { path: 'tasks/create', component: TaskCreateComponent }
      ]
    },
    {
      path: 'dashboard/manager',
      component: ManagerDashboardComponent
    },
    {
      path: 'dashboard/user',
      component: UserDashboardComponent
    },  
    { path: '', redirectTo: 'login', pathMatch: 'full' }
];
