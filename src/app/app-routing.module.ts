import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AfterloginService } from './services/afterlogin.service';
import { BeforeloginService } from './services/beforelogin.service';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { UsersComponent } from './components/users/users.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { RequestResetComponent } from './components/password/request-reset/request-reset.component';
import { ResponseResetComponent } from './components/password/response-reset/response-reset.component';
import { SignupConfrimComponent } from './components/signup-confrim/signup-confrim.component';
import { RolesComponent } from './components/roles/roles.component';
import { PermissionsComponent } from './components/permissions/permissions.component';
import { AttendanceComponent } from './components/attendance/attendance.component';
import { LocationMapComponent } from './components/location-map/location-map.component';
import { LocationComponent } from './components/location/location.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ClassComponent } from './components/class/class.component';
import { SchoolFeesComponent } from './components/school-fees/school-fees.component';
import { SubjectsComponent } from './components/subjects/subjects.component';
import { MaterialsComponent } from './components/materials/materials.component';
import { ResultsComponent } from './components/results/results.component';
import { TimeTableComponent } from './components/time-table/time-table.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { NoticeComponent } from './components/notice/notice.component';
import { StudentComponent } from './components/student/student.component';
import { SubjectComponent } from './components/subject/subject.component';
import { SubjectGroupComponent } from './components/subject-group/subject-group.component';

const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate : [AfterloginService]
  },
  {
    path: 'reset-password',
    component : RequestResetComponent,
    canActivate : [BeforeloginService]
  },
  {
    path: 'reset-password-submit',
    component : ResponseResetComponent,
    canActivate : [BeforeloginService]
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate : [BeforeloginService]
  },
  {
    path: 'signup/activate',
    component: SignupConfrimComponent,
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate : [AfterloginService]
  },
  {
    path: 'roles',
    component: RolesComponent,
    canActivate : [AfterloginService]
  },
  {
    path: 'permissions',
    component: PermissionsComponent,
    canActivate : [AfterloginService]
  },
  {
    path: 'attendance',
    component: AttendanceComponent,
    canActivate : [AfterloginService]
  },
  {
    path: 'location',
    component: LocationComponent,
    canActivate : [AfterloginService]
  },
  {
    path: 'locationMap',
    component: LocationMapComponent,
    canActivate : [AfterloginService]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate : [AfterloginService]
  },
  {
    path: 'class',
    component: ClassComponent,
    canActivate : [AfterloginService]
  },
  {
    path: 'fees',
    component: SchoolFeesComponent,
    canActivate : [AfterloginService]
  },
  {
    path: 'subjects',
    component: SubjectsComponent,
    canActivate : [AfterloginService]
  },
  {
    path: 'materials',
    component: MaterialsComponent,
    canActivate : [AfterloginService]
  },
  {
    path: 'results',
    component: ResultsComponent,
    canActivate : [AfterloginService]
  },
  {
    path: 'timetables',
    component: TimeTableComponent,
    canActivate : [AfterloginService]
  },
  {
    path: 'payments',
    component: PaymentsComponent,
    canActivate : [AfterloginService]
  },
  {
    path: 'notices',
    component: NoticeComponent,
    canActivate : [AfterloginService]
  },
  {
    path: 'students',
    component: StudentComponent,
    canActivate : [AfterloginService]
  },
  {
    path: 'classes',
    component: ClassComponent,
    canActivate : [AfterloginService]
  },
  {
    path: 'subject',
    component: SubjectComponent,
    canActivate : [AfterloginService]
  },
  {
    path: 'subjectManage',
    component: SubjectGroupComponent,
    canActivate : [AfterloginService]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
