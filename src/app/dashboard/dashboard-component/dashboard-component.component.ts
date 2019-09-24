import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { SocketService } from 'src/app/socket.service';
import { Observable } from 'rxjs';
import { interval, fromEvent } from 'rxjs';
import { switchMap } from 'rxjs/operators';
//import 'rxjs/add/observable/interval';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserServiceService } from 'src/app/user-service.service';
import { OrderPipe } from 'ngx-order-pipe';
import { FilterPipe } from 'ngx-filter-pipe';
import * as $ from 'jquery';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard-component',
  templateUrl: './dashboard-component.component.html',
  styleUrls: ['./dashboard-component.component.css']
})

export class DashboardComponentComponent implements OnInit {
  public Issue_Track_AuthToken;
  public Issue_Track_UserId;
  public Issue_Track_UserName;
  public Issue_Track_userInfo;
  public issue_title;
  public issue_description;
  public assignee;
  public attachments: File = null;
  public disconnectedSocket;
  public userList;
  public Issues = [];
  public all_users_list = [];
  public items_per_page: Number = 10;
  p: number = 1;
  order: string = 'info.name';
  reverse: boolean = false;
  statusFilter: any = { issue_status: '' };
  public view_dashboard;
  public view_dashboard_header;
  public Issue_Track_provider_pic;
  public Issue_Track_socialPlatform;
  public Notifications = [];

  constructor(private title: Title, public toastr: ToastrService, private filterPipe: FilterPipe, public _router: Router, public ngxSmartModalService: NgxSmartModalService, public socket_service: SocketService, public cookie: CookieService, public user_service: UserServiceService) { }

  ngOnInit() {
    this.Issue_Track_AuthToken = this.cookie.get('Issue_Track_AuthToken');
    this.Issue_Track_UserId = this.cookie.get('Issue_Track_UserId');
    this.Issue_Track_UserName = this.cookie.get('Issue_Track_UserName');
    this.Issue_Track_provider_pic = this.cookie.get('Issue_Track_provider_pic');
    this.Issue_Track_socialPlatform = this.cookie.get('Issue_Track_socialPlatform');
    this.Issue_Track_userInfo = this.user_service.getLocalStorageUserinfo();
    this.view_dashboard = 'issues_assign_to_me';
    this.view_dashboard_header = 'Issues Assigned To Me';
    this.checkstatus();
    this.verifyUserConfirmation();
    this.getOnlineUserList();
    this.get_all_issues_Assigned_to_logged_in_user();
    this.get_issues_from_all_users();
    this.get_all_user_list();
    this.get_list_of_async_issues();
    this.get_all_notifications();
    this.title.setTitle('Dashboard');
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

  public get_all_issues_Assigned_to_logged_in_user = () => {

    let logged_in_user_obj = {
      assignee: this.Issue_Track_UserId
    }
    this.socket_service.get_issues_assigned_to_loggedin_user(logged_in_user_obj).subscribe((apiResponse) => {
      if (apiResponse['status'] == 200) {
        this.Issues = [];
        for (let x_issues of apiResponse['data']) {
          var only_date = `${new Date(x_issues['issue_posted_date']).getDate()}-${new Date(x_issues['issue_posted_date']).getMonth()}-${new Date(x_issues['issue_posted_date']).getFullYear()}`;
          this.Issues = [
            ...this.Issues,
            {
              issueId: x_issues['issueId'],
              issue_title: x_issues['issue_title'],
              issue_status: x_issues['issue_status'],
              issue_reporter: x_issues['issue_reporter'],
              issue_reporter_name: x_issues['issue_reporter_name'],
              issue_description: x_issues['issue_description'],
              issue_attachments: x_issues['issue_attachments'],
              issue_assignee: x_issues['issue_assignee'],
              issue_assignee_name: x_issues['issue_assignee_name'],
              issue_posted_date: only_date,
              dropbox_id: x_issues['dropbox_id'],
            }
          ];
        }
      }
      else {
        this.Issues = [];
      }
    });
  }

  public get_all_issues_created_by_logged_in_user = () => {
    let logged_in_user_data = {
      issue_reporter: this.Issue_Track_UserId
    }
    this.socket_service.get_issues_created_by_log_in_user(logged_in_user_data).subscribe((apiResponse) => {
      if (apiResponse['status'] == 200) {
        this.Issues = [];
        for (let x_issues of apiResponse['data']) {
          var only_date = `${new Date(x_issues['issue_posted_date']).getDate()}-${new Date(x_issues['issue_posted_date']).getMonth()}-${new Date(x_issues['issue_posted_date']).getFullYear()}`;
          this.Issues = [
            ...this.Issues,
            {
              issueId: x_issues['issueId'],
              issue_title: x_issues['issue_title'],
              issue_status: x_issues['issue_status'],
              issue_reporter: x_issues['issue_reporter'],
              issue_reporter_name: x_issues['issue_reporter_name'],
              issue_description: x_issues['issue_description'],
              issue_attachments: x_issues['issue_attachments'],
              issue_assignee: x_issues['issue_assignee'],
              issue_assignee_name: x_issues['issue_assignee_name'],
              issue_posted_date: only_date,
              dropbox_id: x_issues['dropbox_id'],
            }
          ];
        }
      }
      else {
        this.Issues = [];
      }
    });
  }

  public get_all_the_issues = () => {
    this.socket_service.getAll_issues().subscribe((apiResponse) => {
      if (apiResponse['status'] == 200) {
        this.Issues = [];
        for (let x_issues of apiResponse['data']) {
          var only_date = `${new Date(x_issues['issue_posted_date']).getDate()}-${new Date(x_issues['issue_posted_date']).getMonth()}-${new Date(x_issues['issue_posted_date']).getFullYear()}`;
          this.Issues = [
            ...this.Issues,
            {
              issueId: x_issues['issueId'],
              issue_title: x_issues['issue_title'],
              issue_status: x_issues['issue_status'],
              issue_reporter: x_issues['issue_reporter'],
              issue_reporter_name: x_issues['issue_reporter_name'],
              issue_description: x_issues['issue_description'],
              issue_attachments: x_issues['issue_attachments'],
              issue_assignee: x_issues['issue_assignee'],
              issue_assignee_name: x_issues['issue_assignee_name'],
              issue_posted_date: only_date,
              dropbox_id: x_issues['dropbox_id'],
            }
          ];
        }
      }
      else {
        this.Issues = [];
      }
    });
  }

  public get_all_done_issues = () => {
    this.socket_service.get_done_Issues().subscribe((apiResponse) => {
      if (apiResponse['status'] == 200) {
        this.Issues = [];
        for (let x_issues of apiResponse['data']) {
          var only_date = `${new Date(x_issues['issue_posted_date']).getDate()}-${new Date(x_issues['issue_posted_date']).getMonth()}-${new Date(x_issues['issue_posted_date']).getFullYear()}`;
          this.Issues = [
            ...this.Issues,
            {
              issueId: x_issues['issueId'],
              issue_title: x_issues['issue_title'],
              issue_status: x_issues['issue_status'],
              issue_reporter: x_issues['issue_reporter'],
              issue_reporter_name: x_issues['issue_reporter_name'],
              issue_description: x_issues['issue_description'],
              issue_attachments: x_issues['issue_attachments'],
              issue_assignee: x_issues['issue_assignee'],
              issue_assignee_name: x_issues['issue_assignee_name'],
              issue_posted_date: only_date,
              dropbox_id: x_issues['dropbox_id'],
            }
          ];
        }
      }
      else {
        this.Issues = [];
      }
    });
  }

  public get_all_open_issues = () => {
    this.socket_service.get_ALL_open_Issues().subscribe((apiResponse) => {
      if (apiResponse['status'] == 200) {
        this.Issues = [];
        for (let x_issues of apiResponse['data']) {
          var only_date = `${new Date(x_issues['issue_posted_date']).getDate()}-${new Date(x_issues['issue_posted_date']).getMonth()}-${new Date(x_issues['issue_posted_date']).getFullYear()}`;
          this.Issues = [
            ...this.Issues,
            {
              issueId: x_issues['issueId'],
              issue_title: x_issues['issue_title'],
              issue_status: x_issues['issue_status'],
              issue_reporter: x_issues['issue_reporter'],
              issue_reporter_name: x_issues['issue_reporter_name'],
              issue_description: x_issues['issue_description'],
              issue_attachments: x_issues['issue_attachments'],
              issue_assignee: x_issues['issue_assignee'],
              issue_assignee_name: x_issues['issue_assignee_name'],
              issue_posted_date: only_date,
              dropbox_id: x_issues['dropbox_id'],
            }
          ];
        }
      }
      else {
        this.Issues = [];
      }
    });
  }

  public get_all_user_list = () => {
    this.socket_service.get_all_user_list().subscribe((apiResponse) => {
      if (apiResponse['status'] == 200) {
        for (let all_users of apiResponse['data']) {
          this.all_users_list = [
            ...this.all_users_list,
            {
              userId: all_users['userId'],
              userName: all_users['userName']
            }
          ];
        }
      }
    });
  }

  public checkstatus: any = () => {
    if (this.Issue_Track_AuthToken === undefined || this.Issue_Track_AuthToken === null || this.Issue_Track_AuthToken === '') {
      this._router.navigate(['/Login']);
      return false;
    }
    else {
      this._router.navigate(['/Dashboard']);
      return true;
    }
  }

  public verifyUserConfirmation = () => {
    this.socket_service.verifyUSer().subscribe((data) => {
      this.disconnectedSocket = false;
      this.socket_service.setUser(this.Issue_Track_AuthToken);
    });
  }

  public getOnlineUserList = () => {
    this.socket_service.onlineUSerList().subscribe((userList1) => {
      this.userList = [];
      for (let x in userList1) {
        let user = { userId: userList1[x]['userId'], userName: userList1[x]['fullname'] };
        this.userList.push(user);
        console.log(this.userList);
      }
    });
  }

  public create() {
    this.ngxSmartModalService.getModal('popuptwo').open();
  }

  public OnFileSelected = (event) => {
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = function (e) {
      $('#blah').attr('src', reader.result);
      document.getElementById('blah').style.display = "block";
    }
    this.attachments = event.target.files[0];
  }

  public create_iss_ue = () => {
    if (this.issue_title === undefined || this.issue_title === null || this.issue_title === '') {
      this.toastr.warning("Please Enter Issue Title");
    }
    else if (this.assignee === undefined || this.assignee === null || this.assignee === '') {
      this.toastr.warning("Please Assign Issue To Yourself Or Other User Whom You Want To Assign");
    }
    else {
      var images_path = $('#blah').attr('src');
      var assignee_name = document.getElementById(this.assignee).innerHTML;
      if (this.attachments != undefined || this.attachments != null) {
        let create_issue_data = {
          issue_title: this.issue_title,
          issue_description: this.issue_description,
          issue_attachments: this.attachments,
          issue_attachment_name: this.attachments.name,
          issue_attachment_type: this.attachments.type,
          issue_attachment_path: images_path,
          issue_assignee: this.assignee,
          issue_assignee_name: assignee_name,
          issue_reporter: this.Issue_Track_UserId,
          issue_reporter_name: this.Issue_Track_UserName,
          issue_status: 'In Backlog',
          issue_posted_date: Date.now()
        }
        $('#loader').show(0);
        this.socket_service.create_issue(create_issue_data);
      }
      else {
        let create_issue_data = {
          issue_title: this.issue_title,
          issue_description: this.issue_description,
          issue_attachments: this.attachments,
          issue_assignee: this.assignee,
          issue_assignee_name: assignee_name,
          issue_reporter: this.Issue_Track_UserId,
          issue_reporter_name: this.Issue_Track_UserName,
          issue_status: 'In Backlog',
          issue_posted_date: Date.now()
        }
        $('#loader').show(0);
        this.socket_service.create_issue(create_issue_data);
      }
    }
  }

  public change_view_to = (data) => {
    this.view_dashboard = data;
    if (this.view_dashboard == 'issues_assign_to_me') {
      this.view_dashboard_header = 'Issues Assigned To Me';
      this.get_all_issues_Assigned_to_logged_in_user();
    }
    else if (this.view_dashboard == 'open_issues') {
      this.view_dashboard_header = 'My Open Issues';
      this.get_all_issues_created_by_logged_in_user();
    }
    else if (this.view_dashboard == 'all_issues') {
      this.view_dashboard_header = 'All Issues';
      this.get_all_the_issues();
    }
    else if (this.view_dashboard == 'all_open_issues') {
      this.view_dashboard_header = 'Open Issues';
      this.get_all_open_issues();
    }
    else if (this.view_dashboard == 'done_issues') {
      this.view_dashboard_header = 'Done Issues';
      this.get_all_done_issues();
    }
  }

  public get_issues_from_all_users = () => {
    this.socket_service.particular_user_issues(this.Issue_Track_UserId).subscribe((data) => {
      $('#loader').hide(0);
      $(document).ready(function () {
        var btn_id = document.getElementById('close_btn_creation_isssue');
        btn_id.click();
        $('#blah').attr('src', '');
        document.getElementById('blah').style.display = "none";
      });

      if (data['check_for_what'] == 'issue_creation') {
        if (this.view_dashboard == 'issues_assign_to_me') {
          if ((this.cookie.get('Issue_Track_UserId')) == data['issue_assignee']) {
            var only_date1 = `${new Date(data['issue_posted_date']).getDate()}-${new Date(data['issue_posted_date']).getMonth()}-${new Date(data['issue_posted_date']).getFullYear()}`;
            this.Issues = [
              ...this.Issues,
              {
                issueId: data['issueId'],
                issue_title: data['issue_title'],
                issue_status: data['issue_status'],
                issue_reporter: data['issue_reporter'],
                issue_reporter_name: data['issue_reporter_name'],
                issue_description: data['issue_description'],
                issue_attachments: data['issue_attachments'],
                issue_assignee: data['issue_assignee'],
                issue_assignee_name: data['issue_assignee_name'],
                issue_posted_date: only_date1,
                dropbox_id: data['dropbox_id'],
              }
            ]
          }
        }
        else if (this.view_dashboard == 'open_issues') {
          if ((this.cookie.get('Issue_Track_UserId')) == data['issue_reporter']) {
            var only_date1 = `${new Date(data['issue_posted_date']).getDate()}-${new Date(data['issue_posted_date']).getMonth()}-${new Date(data['issue_posted_date']).getFullYear()}`;
            this.Issues = [
              ...this.Issues,
              {
                issueId: data['issueId'],
                issue_title: data['issue_title'],
                issue_status: data['issue_status'],
                issue_reporter: data['issue_reporter'],
                issue_reporter_name: data['issue_reporter_name'],
                issue_description: data['issue_description'],
                issue_attachments: data['issue_attachments'],
                issue_assignee: data['issue_assignee'],
                issue_assignee_name: data['issue_assignee_name'],
                issue_posted_date: only_date1,
                dropbox_id: data['dropbox_id'],
              }
            ]
          }
        }
        else if (this.view_dashboard == 'all_issues') {
          var only_date1 = `${new Date(data['issue_posted_date']).getDate()}-${new Date(data['issue_posted_date']).getMonth()}-${new Date(data['issue_posted_date']).getFullYear()}`;
          this.Issues = [
            ...this.Issues,
            {
              issueId: data['issueId'],
              issue_title: data['issue_title'],
              issue_status: data['issue_status'],
              issue_reporter: data['issue_reporter'],
              issue_reporter_name: data['issue_reporter_name'],
              issue_description: data['issue_description'],
              issue_attachments: data['issue_attachments'],
              issue_assignee: data['issue_assignee'],
              issue_assignee_name: data['issue_assignee_name'],
              issue_posted_date: only_date1,
              dropbox_id: data['dropbox_id'],
            }
          ]
        }
      }
    });
  }

  public logout = () => {
    let logged_in_user_id = this.cookie.get('Issue_Track_UserId');
    let userId_data = {
      userId: logged_in_user_id
    }
    this.socket_service.Logout(userId_data).subscribe((apiResponse) => {
      if (apiResponse['status'] == 200) {
        this.cookie.delete('Issue_Track_AuthToken');
        this.cookie.delete('Issue_Track_UserId');
        this.cookie.delete('Issue_Track_UserName');
        this.cookie.delete('Issue_Track_email');
        this.user_service.setUserInfoLocalStorage("");
        this._router.navigate(['/']);
        this.toastr.success(apiResponse['message']);
      }
      else {
        this.toastr.warning(apiResponse['message']);
      }
    });
  }

  public edit_profile = () => {
    this._router.navigate(['edit-profile']);
  }

  public change_password = () => {
    this._router.navigate(['change-password']);
  }

  public get_list_of_async_issues = () => {
    this.socket_service.get_list_of_Async_issues(this.Issue_Track_UserId).subscribe((data) => {
      if (data['check_for_what'] == 'issue_creation') {
        if (data['notification_occurs'] == 'creation') {
          this.Notifications = [
            ...this.Notifications,
            {
              NotificationId: data['notificationId'],
              Notification_data: data['notificationTitle'],
              Notification_link: data['Notification_issue_id'],
              Notification_watched_by: ','
            }
          ]
        }
        if (this.view_dashboard == 'issues_assign_to_me') {
          if ((this.cookie.get('Issue_Track_UserId')) == data['issue_assignee']) {
            var only_date2 = `${new Date(data['issue_posted_date']).getDate()}-${new Date(data['issue_posted_date']).getMonth()}-${new Date(data['issue_posted_date']).getFullYear()}`;
            this.Issues = [
              ...this.Issues,
              {
                issueId: data['issueId'],
                issue_title: data['issue_title'],
                issue_status: data['issue_status'],
                issue_reporter: data['issue_reporter'],
                issue_reporter_name: data['issue_reporter_name'],
                issue_description: data['issue_description'],
                issue_attachments: data['issue_attachments'],
                issue_assignee: data['issue_assignee'],
                issue_assignee_name: data['issue_assignee_name'],
                issue_posted_date: only_date2,
                dropbox_id: data['dropbox_id'],
              }
            ]
          }
        }
        else if (this.view_dashboard == 'open_issues') {
          if ((this.cookie.get('Issue_Track_UserId')) == data['issue_reporter']) {
            var only_date2 = `${new Date(data['issue_posted_date']).getDate()}-${new Date(data['issue_posted_date']).getMonth()}-${new Date(data['issue_posted_date']).getFullYear()}`;
            this.Issues = [
              ...this.Issues,
              {
                issueId: data['issueId'],
                issue_title: data['issue_title'],
                issue_status: data['issue_status'],
                issue_reporter: data['issue_reporter'],
                issue_reporter_name: data['issue_reporter_name'],
                issue_description: data['issue_description'],
                issue_attachments: data['issue_attachments'],
                issue_assignee: data['issue_assignee'],
                issue_assignee_name: data['issue_assignee_name'],
                issue_posted_date: only_date2,
                dropbox_id: data['dropbox_id'],
              }
            ]
          }
        }
        else if (this.view_dashboard == 'all_issues') {
          var only_date2 = `${new Date(data['issue_posted_date']).getDate()}-${new Date(data['issue_posted_date']).getMonth()}-${new Date(data['issue_posted_date']).getFullYear()}`;
          this.Issues = [
            ...this.Issues,
            {
              issueId: data['issueId'],
              issue_title: data['issue_title'],
              issue_status: data['issue_status'],
              issue_reporter: data['issue_reporter'],
              issue_reporter_name: data['issue_reporter_name'],
              issue_description: data['issue_description'],
              issue_attachments: data['issue_attachments'],
              issue_assignee: data['issue_assignee'],
              issue_assignee_name: data['issue_assignee_name'],
              issue_posted_date: only_date2,
              dropbox_id: data['dropbox_id'],
            }
          ]
        }
      }
      else if (data['check_for_what'] == 'title_updated') {
        let converted_n_watchers_id_to_array = data['notification_issue_watchers'].split(",");
        if (data['notitification_issue_reporter'] == this.Issue_Track_UserId) {
          this.Notifications = [
            ...this.Notifications,
            {
              NotificationId: data['notificationId'],
              Notification_data: data['notificationTitle'],
              Notification_link: data['Notification_issue_id'],
              Notification_watched_by: ','
            }
          ]
        }
        else if (data['notification_issue_assignee'] == this.Issue_Track_UserId) {
          this.Notifications = [
            ...this.Notifications,
            {
              NotificationId: data['notificationId'],
              Notification_data: data['notificationTitle'],
              Notification_link: data['Notification_issue_id'],
              Notification_watched_by: ','
            }
          ]
        }
        else if (converted_n_watchers_id_to_array.includes(this.Issue_Track_UserId) == true) {
          this.Notifications = [
            ...this.Notifications,
            {
              NotificationId: data['notificationId'],
              Notification_data: data['notificationTitle'],
              Notification_link: data['Notification_issue_id'],
              Notification_watched_by: ','
            }
          ]
        }

        this.Issues = this.Issues.map(iEvent => {
          if (iEvent.issueId === data['issue_id']) {
            return {
              issueId: iEvent.issueId,
              issue_title: data['new_issue_title'],
              issue_status: iEvent.issue_status,
              issue_reporter: iEvent.issue_reporter,
              issue_reporter_name: iEvent.issue_reporter_name,
              issue_description: iEvent.issue_description,
              issue_attachments: iEvent.issue_attachments,
              issue_assignee: iEvent.issue_assignee,
              issue_assignee_name: iEvent.issue_assignee_name,
              issue_posted_date: iEvent.issue_posted_date,
              dropbox_id: iEvent.dropbox_id
            };
          }
          return iEvent;
        });
      }
      else if (data['check_for_what'] == 'description_updated') {
        let converted_n_watchers_id_to_array = data['notification_issue_watchers'].split(",");
        if (data['notitification_issue_reporter'] == this.Issue_Track_UserId) {
          this.Notifications = [
            ...this.Notifications,
            {
              NotificationId: data['notificationId'],
              Notification_data: data['notificationTitle'],
              Notification_link: data['Notification_issue_id'],
              Notification_watched_by: ','
            }
          ]
        }
        else if (data['notification_issue_assignee'] == this.Issue_Track_UserId) {
          this.Notifications = [
            ...this.Notifications,
            {
              NotificationId: data['notificationId'],
              Notification_data: data['notificationTitle'],
              Notification_link: data['Notification_issue_id'],
              Notification_watched_by: ','
            }
          ]
        }
        else if (converted_n_watchers_id_to_array.includes(this.Issue_Track_UserId) == true) {
          this.Notifications = [
            ...this.Notifications,
            {
              NotificationId: data['notificationId'],
              Notification_data: data['notificationTitle'],
              Notification_link: data['Notification_issue_id'],
              Notification_watched_by: ','
            }
          ]
        }

        this.Issues = this.Issues.map(iEvent => {
          if (iEvent.issueId === data['issue_id']) {
            return {
              issueId: iEvent.issueId,
              issue_title: iEvent.issue_title,
              issue_status: iEvent.issue_status,
              issue_reporter: iEvent.issue_reporter,
              issue_reporter_name: iEvent.issue_reporter_name,
              issue_description: data['new_issue_description'],
              issue_attachments: iEvent.issue_attachments,
              issue_assignee: iEvent.issue_assignee,
              issue_assignee_name: iEvent.issue_assignee_name,
              issue_posted_date: iEvent.issue_posted_date,
              dropbox_id: iEvent.dropbox_id
            };
          }
          return iEvent;
        });
      }
      else if (data['check_for_what'] == 'assignee_updated') {

        let converted_n_watchers_id_to_array = data['notification_issue_watchers'].split(",");
        if (data['notitification_issue_reporter'] == this.Issue_Track_UserId) {
          this.Notifications = [
            ...this.Notifications,
            {
              NotificationId: data['notificationId'],
              Notification_data: data['notificationTitle'],
              Notification_link: data['Notification_issue_id'],
              Notification_watched_by: ','
            }
          ]
        }
        else if (data['notification_issue_assignee'] == this.Issue_Track_UserId) {
          this.Notifications = [
            ...this.Notifications,
            {
              NotificationId: data['notificationId'],
              Notification_data: data['notificationTitle'],
              Notification_link: data['Notification_issue_id'],
              Notification_watched_by: ','
            }
          ]
        }
        else if (converted_n_watchers_id_to_array.includes(this.Issue_Track_UserId) == true) {
          this.Notifications = [
            ...this.Notifications,
            {
              NotificationId: data['notificationId'],
              Notification_data: data['notificationTitle'],
              Notification_link: data['Notification_issue_id'],
              Notification_watched_by: ','
            }
          ]
        }

        this.Issues = this.Issues.map(iEvent => {
          if (iEvent.issueId === data['issueId']) {
            return {
              issueId: iEvent.issueId,
              issue_title: iEvent.issue_title,
              issue_status: iEvent.issue_status,
              issue_reporter: iEvent.issue_reporter,
              issue_reporter_name: iEvent.issue_reporter_name,
              issue_description: iEvent.issue_description,
              issue_attachments: iEvent.issue_attachments,
              issue_assignee: data['updated_assignee_id'],
              issue_assignee_name: data['updated_assignee_name'],
              issue_posted_date: iEvent.issue_posted_date,
              dropbox_id: iEvent.dropbox_id
            };
          }
          return iEvent;
        });
      }
      else if (data['check_for_what'] == 'reporter_updated') {
        let converted_n_watchers_id_to_array = data['notification_issue_watchers'].split(",");
        if (data['notitification_issue_reporter'] == this.Issue_Track_UserId) {
          this.Notifications = [
            ...this.Notifications,
            {
              NotificationId: data['notificationId'],
              Notification_data: data['notificationTitle'],
              Notification_link: data['Notification_issue_id'],
              Notification_watched_by: ','
            }
          ]
        }
        else if (data['notification_issue_assignee'] == this.Issue_Track_UserId) {
          this.Notifications = [
            ...this.Notifications,
            {
              NotificationId: data['notificationId'],
              Notification_data: data['notificationTitle'],
              Notification_link: data['Notification_issue_id'],
              Notification_watched_by: ','
            }
          ]
        }
        else if (converted_n_watchers_id_to_array.includes(this.Issue_Track_UserId) == true) {
          this.Notifications = [
            ...this.Notifications,
            {
              NotificationId: data['notificationId'],
              Notification_data: data['notificationTitle'],
              Notification_link: data['Notification_issue_id'],
              Notification_watched_by: ','
            }
          ]
        }
        this.Issues = this.Issues.map(iEvent => {
          if (iEvent.issueId === data['issueId']) {
            return {
              issueId: iEvent.issueId,
              issue_title: iEvent.issue_title,
              issue_status: iEvent.issue_status,
              issue_reporter: data['updated_reporter_id'],
              issue_reporter_name: data['updated_reporter_name'],
              issue_description: iEvent.issue_description,
              issue_attachments: iEvent.issue_attachments,
              issue_assignee: iEvent.issue_assignee,
              issue_assignee_name: iEvent.issue_assignee_name,
              issue_posted_date: iEvent.issue_posted_date,
              dropbox_id: iEvent.dropbox_id
            };
          }
          return iEvent;
        });
      }
      else if (data['check_for_what'] == 'status_updated') {
        let converted_n_watchers_id_to_array = data['notification_issue_watchers'].split(",");
        if (data['notitification_issue_reporter'] == this.Issue_Track_UserId) {
          this.Notifications = [
            ...this.Notifications,
            {
              NotificationId: data['notificationId'],
              Notification_data: data['notificationTitle'],
              Notification_link: data['Notification_issue_id'],
              Notification_watched_by: ','
            }
          ]
        }
        else if (data['notification_issue_assignee'] == this.Issue_Track_UserId) {
          this.Notifications = [
            ...this.Notifications,
            {
              NotificationId: data['notificationId'],
              Notification_data: data['notificationTitle'],
              Notification_link: data['Notification_issue_id'],
              Notification_watched_by: ','
            }
          ]
        }
        else if (converted_n_watchers_id_to_array.includes(this.Issue_Track_UserId) == true) {
          this.Notifications = [
            ...this.Notifications,
            {
              NotificationId: data['notificationId'],
              Notification_data: data['notificationTitle'],
              Notification_link: data['Notification_issue_id'],
              Notification_watched_by: ','
            }
          ]
        }
        this.Issues = this.Issues.map(iEvent => {
          if (iEvent.issueId === data['issueId']) {
            return {
              issueId: iEvent.issueId,
              issue_title: iEvent.issue_title,
              issue_status: data['updated_issue_status'],
              issue_reporter: iEvent.issue_reporter,
              issue_reporter_name: iEvent.issue_reporter_name,
              issue_description: iEvent.issue_description,
              issue_attachments: iEvent.issue_attachments,
              issue_assignee: iEvent.issue_assignee,
              issue_assignee_name: iEvent.issue_assignee_name,
              issue_posted_date: iEvent.issue_posted_date,
              dropbox_id: iEvent.dropbox_id
            };
          }
          return iEvent;
        });
      }
      else if (data['check_for_what'] == 'comment_added') {
        let converted_n_watchers_id_to_array = data['notification_issue_watchers'].split(",");
        if (data['notitification_issue_reporter'] == this.Issue_Track_UserId) {
          this.Notifications = [
            ...this.Notifications,
            {
              NotificationId: data['notificationId'],
              Notification_data: data['notificationTitle'],
              Notification_link: data['Notification_issue_id'],
              Notification_watched_by: ','
            }
          ]
        }
        else if (data['notification_issue_assignee'] == this.Issue_Track_UserId) {
          this.Notifications = [
            ...this.Notifications,
            {
              NotificationId: data['notificationId'],
              Notification_data: data['notificationTitle'],
              Notification_link: data['Notification_issue_id'],
              Notification_watched_by: ','
            }
          ]
        }
        else if (converted_n_watchers_id_to_array.includes(this.Issue_Track_UserId) == true) {
          this.Notifications = [
            ...this.Notifications,
            {
              NotificationId: data['notificationId'],
              Notification_data: data['notificationTitle'],
              Notification_link: data['Notification_issue_id'],
              Notification_watched_by: ','
            }
          ]
        }
      }
      else if (data['check_for_what'] == 'Notification_updated') {
        this.Notifications = this.Notifications.map(iEvent => {
          if (iEvent.NotificationId == data['notificationId'] && iEvent.Notification_link == data['Notification_issue_id']) {
            return {
              NotificationId: iEvent.notificationId,
              Notification_data: iEvent.notificationTitle,
              Notification_link: iEvent.Notification_issue_id,
              Notification_watched_by: data['notification_watched_by']
            };
          }
          return iEvent;
        });
      }

    })
  }

  public get_all_notifications = () => {
    this.socket_service.get_Notification().subscribe((apiResponse) => {
      if (apiResponse['status'] == 200) {
        for (let data1 of apiResponse['data']) {
          if (data1['notification_occurs'] == 'creation' && data1['notitification_issue_reporter'] != this.Issue_Track_UserId) {
            if (data1['notification_watched_by'].watcher != ',') {
              let notification_watchers_id_array = data1['notification_watched_by'].slice(1, -1);
              if (notification_watchers_id_array.indexOf(this.Issue_Track_UserId) != -1) {
                this.Notifications = [
                  ...this.Notifications
                ]
              }
              else {
                this.Notifications = [
                  ...this.Notifications,
                  {
                    NotificationId: data1['notificationId'],
                    Notification_data: data1['notificationTitle'],
                    Notification_link: data1['Notification_issue_id'],
                    Notification_watched_by: data1['notification_watched_by']
                  }
                ]
              }
            }
            else {
              this.Notifications = [
                ...this.Notifications,
                {
                  NotificationId: data1['notificationId'],
                  Notification_data: data1['notificationTitle'],
                  Notification_link: data1['Notification_issue_id'],
                  Notification_watched_by: data1['notification_watched_by']
                }
              ]
            }
          }
          else if (data1['notification_occurs'] == 'updation') {
            if (data1['notification_watched_by'].watcher != ',') {
              let notification_watchers_id_array = data1['notification_watched_by'].slice(1, -1);
              if (notification_watchers_id_array.indexOf(this.Issue_Track_UserId) != -1) {
                this.Notifications = [
                  ...this.Notifications
                ]
              }
              else {
                let converted_n_watchers_id_to_array = data1['notification_issue_watchers'].split(",");
                if (data1['notitification_issue_reporter'] == this.Issue_Track_UserId) {
                  this.Notifications = [
                    ...this.Notifications,
                    {
                      NotificationId: data1['notificationId'],
                      Notification_data: data1['notificationTitle'],
                      Notification_link: data1['Notification_issue_id'],
                      Notification_watched_by: data1['notification_watched_by']
                    }
                  ]
                }
                else if (data1['notification_issue_assignee'] == this.Issue_Track_UserId) {
                  this.Notifications = [
                    ...this.Notifications,
                    {
                      NotificationId: data1['notificationId'],
                      Notification_data: data1['notificationTitle'],
                      Notification_link: data1['Notification_issue_id'],
                      Notification_watched_by: data1['notification_watched_by']
                    }
                  ]
                }
                else if (converted_n_watchers_id_to_array.includes(this.Issue_Track_UserId) == true) {
                  this.Notifications = [
                    ...this.Notifications,
                    {
                      NotificationId: data1['notificationId'],
                      Notification_data: data1['notificationTitle'],
                      Notification_link: data1['Notification_issue_id'],
                      Notification_watched_by: data1['notification_watched_by']
                    }
                  ]
                }
              }
            }
            else {
              let converted_n_watchers_id_to_array = data1['notification_issue_watchers'].split(",");
              if (data1['notitification_issue_reporter'] == this.Issue_Track_UserId) {
                this.Notifications = [
                  ...this.Notifications,
                  {
                    NotificationId: data1['notificationId'],
                    Notification_data: data1['notificationTitle'],
                    Notification_link: data1['Notification_issue_id'],
                    Notification_watched_by: data1['notification_watched_by']
                  }
                ]
              }
              else if (data1['notification_issue_assignee'] == this.Issue_Track_UserId) {
                this.Notifications = [
                  ...this.Notifications,
                  {
                    NotificationId: data1['notificationId'],
                    Notification_data: data1['notificationTitle'],
                    Notification_link: data1['Notification_issue_id'],
                    Notification_watched_by: data1['notification_watched_by']
                  }
                ]
              }
              else if (converted_n_watchers_id_to_array.includes(this.Issue_Track_UserId) == true) {
                this.Notifications = [
                  ...this.Notifications,
                  {
                    NotificationId: data1['notificationId'],
                    Notification_data: data1['notificationTitle'],
                    Notification_link: data1['Notification_issue_id'],
                    Notification_watched_by: data1['notification_watched_by']
                  }
                ]
              }
            }
          }
        }
      }
    })
  }

  public Notification_clicked = (notificationid, issueid, notification_watched_by) => {

    let Notification_watched = `${notification_watched_by}${this.Issue_Track_UserId},`;
    let updated_notification_data = {
      notificationId: notificationid,
      Notification_issue_id: issueid,
      notification_watched_by: Notification_watched,
    }
    this.socket_service.update_notification(updated_notification_data);
    this._router.navigate(['/Issue', issueid])
  }

}
