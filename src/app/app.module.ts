import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { LoginComponent } from './login/login.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsComponent } from './CommonForms/Forms/forms/forms.component';
import { RolesComponent } from './CommonForms/Roles/roles/roles.component';
import { UsersComponent } from './CommonForms/Users/users/users.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NgxPrintModule } from 'ngx-print';
import { environment } from 'src/environments/environment.prod';
import en from '@angular/common/locales/en';
import { initializeApp } from 'firebase/app';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { FormComponent } from './CommonForms/Forms/form/form.component';
import { RoleComponent } from './CommonForms/Roles/role/role.component';
import { RoledetailsComponent } from './CommonForms/Roles/roledetails/roledetails.component';
import { UserComponent } from './CommonForms/Users/user/user.component';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { MasterModule } from './Pages/masters.module';
import { SharedModule } from './shared/shared.module';
import { JobCompletionpopupComponent } from './job-completionpopup/job-completionpopup.component';
// import { MaindashboardComponent } from './maindashboard/maindashboard.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { TimeSlotDrawerComponent } from './time-slot-drawer/time-slot-drawer.component';
import { AddNewNotificationDrawerComponent } from './add-new-notification-drawer/add-new-notification-drawer.component';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';
import { JobWiseTicketsRaisedreportComponent } from './job-wise-tickets-raisedreport/job-wise-tickets-raisedreport.component';
// import { SearchpageComponent } from './searchpage/searchpage.component';
registerLocaleData(en);
initializeApp(environment.firebase);
// getAnalytics(app);
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FormsComponent,
    FormComponent,
    RolesComponent,
    RoleComponent,
    RoledetailsComponent,
    UsersComponent,
    UserComponent,
    DashboardComponent,
    JobCompletionpopupComponent,
    // MaindashboardComponent,
    // SearchpageComponent,
    TimeSlotDrawerComponent,
    AddNewNotificationDrawerComponent,
    CustomerDashboardComponent,
    JobWiseTicketsRaisedreportComponent
  ],

  imports: [
    // MbscModule,
    NzAlertModule,
    SharedModule,
    NzDividerModule,
    NzTabsModule,
    NzTimelineModule,
    NzSpinModule,
    NzStepsModule,
    NzSwitchModule,
    NzDropDownModule,
    NzToolTipModule,
    NzCardModule,
    NzSpaceModule,
    NzCheckboxModule,
    NzTimePickerModule,
    NzInputNumberModule,
    NzPopconfirmModule,
    NzDrawerModule,
    NzNotificationModule,
    NzFormModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    AppRoutingModule,
    FormsModule,
    NzBadgeModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzPopoverModule,
    NzSelectModule,
    NzProgressModule,
    NzModalModule,
    NzInputModule,
    NzDatePickerModule,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzButtonModule,
    NzTableModule,
    NzTreeSelectModule,
    NzRadioModule,
    NgApexchartsModule,
    NzTagModule,
    NzEmptyModule,
    NzResultModule,
    NzAvatarModule,
    NzImageModule,
    NzCommentModule,
    NzListModule,
    NzRateModule,
    NgxPrintModule,
    MasterModule,
    ImageCropperModule
  ],


  providers: [{ provide: NZ_I18N, useValue: en_US }, NzNotificationService],

  bootstrap: [AppComponent],
})
export class AppModule { }
