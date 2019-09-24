import { Component, OnInit } from '@angular/core';
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
import { trimTrailingNulls } from '@angular/compiler/src/render3/view/util';
import * as $ from 'jquery';
//import { Title } from '@angular/platform-browser';
import { Dropbox } from 'dropbox';
let dbx = new Dropbox({ accessToken: '6hPiXZkjq4AAAAAAAAAAH9B5muHXcLt-aPHlHHmNQwwcZGN2HnvnGrBqkf4pPkj9' });

@Component({
  selector: 'app-particular-issue',
  templateUrl: './particular-issue.component.html',
  styleUrls: ['./particular-issue.component.css']
})
export class ParticularIssueComponent implements OnInit {
  public Issue_Track_AuthToken;
  public Issue_Track_UserId;
  public Issue_Track_UserName;
  public Issue_Track_userInfo;
  public Issue_Track_email;
  public current_issueid;
  public issue_info_from_api;
  public origional_issue_info = {};
  public issue_title_data;
  public watcher_name_array = [];
  public watcher_id_array = [];
  public disconnectedSocket;
  public userList;
  public all_users_list = [];
  public all_comments = [];
  public Issue_Track_provider_pic;
  public Issue_Track_socialPlatform;
  public Notifications = [];
  //private title:Title,
  constructor(public toastr: ToastrService, public activated_route: ActivatedRoute, public _router: Router, public ngxSmartModalService: NgxSmartModalService, public socket_service: SocketService, public cookie: CookieService, public user_service: UserServiceService) { }

  ngOnInit() {
    this.Issue_Track_AuthToken = this.cookie.get('Issue_Track_AuthToken');
    this.Issue_Track_UserId = this.cookie.get('Issue_Track_UserId');
    this.Issue_Track_UserName = this.cookie.get('Issue_Track_UserName');
    this.Issue_Track_email = this.cookie.get('Issue_Track_email');
    this.Issue_Track_provider_pic = this.cookie.get('Issue_Track_provider_pic');
    this.Issue_Track_socialPlatform = this.cookie.get('Issue_Track_socialPlatform');
    this.Issue_Track_userInfo = this.user_service.getLocalStorageUserinfo();
    this.current_issueid = this.activated_route.snapshot.paramMap.get('IssueId');
    this.checkstatus();
    this.verifyUserConfirmation();
    this.getOnlineUserList();
    this.get_all_user_list();
    this.get_current_issue_information(this.current_issueid);
    this.get_All_commets_for_this_issue(this.current_issueid);
    this.get_particular_comment_updation();
    this.get_all_notifications();
    //this.title.setTitle(this.issue_info_from_api.issue_title);

    $(document).ready(function () {
      $("#issue_title_").focus(function () {
        document.getElementById('title_ok_cancel_btn').style.display = "block";
        document.getElementById('title_edit_icon').style.display = "none";
        $(".hover_input").css("background-color", "white")
      });

      $("#issue_title_").hover(function () {
        document.getElementById('title_edit_icon').style.display = "block";
        $(".hover_input").css("background-color", "darkgrey")
      }, function () {
        document.getElementById('title_edit_icon').style.display = "none";
        $(".hover_input").css("background-color", "#ecf0f5")
      });

      $("#description_text_div").hover(function () {
        document.getElementById('description_edit_icon_').style.display = "block";
        $(".description_text_div").css("background-color", "#ecf0f5");
      }, function () {
        document.getElementById('description_edit_icon_').style.display = "none";
        $(".description_text_div").css("background-color", "white");
      });

      $("#Assignee_name").hover(function () {
        document.getElementById('assignee_edit_icon').style.display = "block";
        $(".assignee_text_div").css("background-color", "#ecf0f5");
      }, function () {
        document.getElementById('assignee_edit_icon').style.display = "none";
        $(".assignee_text_div").css("background-color", "white");
      });

      $("#Assignee_name").click(function () {
        document.getElementById('assignee_edit_icon').style.display = "none";
        $(".assignee_text_div").css("background-color", "white");
      });

      $("#Reporter_name").hover(function () {
        document.getElementById('reporter_edit_icon').style.display = "block";
        $(".repporter_text_div").css("background-color", "#ecf0f5");
      }, function () {
        document.getElementById('reporter_edit_icon').style.display = "none";
        $(".repporter_text_div").css("background-color", "white");
      });

      $("#Reporter_name").click(function () {
        document.getElementById('reporter_edit_icon').style.display = "none";
        $(".repporter_text_div").css("background-color", "white");
      });

      $("#issue_status").hover(function () {
        document.getElementById('status_edit_icon').style.display = "block";
        $(".status_selction").css("background-color", "#ecf0f5");
      }, function () {
        document.getElementById('status_edit_icon').style.display = "none";
        $(".status_selction").css("background-color", "#ecf0f5");
      });

      $("#description_text_div").click(function () {
        document.getElementById('description_text_div').style.display = "none";
        document.getElementById('editor_content').style.display = "block";
        document.getElementById('editor_content_btns').style.display = "block";
      });

      $("#Assignee_name").on('input', function () {
        document.getElementById('assignee_edit_icon').style.display = "none";
        $(".assignee_text_div").css("background-color", "white");
        var val = this.value;
        if ($('#Assignee_name_list option').filter(function () {
          return this.value.toUpperCase() === val.toUpperCase();
        }).length) {
        }
        else {
        }
      });
      $("#Assignee_name").bind('change', function () {
        var origional_assignee_name = (<HTMLInputElement>document.getElementById('origional_issue_assignee_name')).value;
        var selected_assignee_name = (<HTMLInputElement>document.getElementById('Assignee_name')).value;
        var obj = $("#Assignee_name_list").find("option[value='" + selected_assignee_name + "']");

        if (obj != null && obj.length > 0) {
          var button_update_assignee = document.getElementById("update_assignee");
          button_update_assignee.click();
        }
        else {
          (<HTMLInputElement>document.getElementById('Assignee_name')).value = origional_assignee_name;
        }
      });

      $("#Reporter_name").on('input', function () {
        var val = this.value;
        if ($('#Reporter_name_list option').filter(function () {
          return this.value.toUpperCase() === val.toUpperCase();
        }).length) {
        }
        else {
        }
      });

      $("#Reporter_name").bind('change', function () {
        var origional_reporter_name = (<HTMLInputElement>document.getElementById('origional_issue_reporter_name')).value;
        var selected_reporter_name = (<HTMLInputElement>document.getElementById('Reporter_name')).value;
        var obj = $("#Reporter_name_list").find("option[value='" + selected_reporter_name + "']");
        if (obj != null && obj.length > 0) {
          var button_update_reporter = document.getElementById("update_reporter");
          button_update_reporter.click();
        }
        else {
          (<HTMLInputElement>document.getElementById('Reporter_name')).value = origional_reporter_name;
        }
      });
    });
    $("#add_comment_section_input").click(function () {
      document.getElementById('add_comment').style.display = "block";
      document.getElementById('comment_ok_cancel_btn').style.display = "block";
      document.getElementById('add_comment_section_input').style.display = "none";
    });
  }
  public remove_add_comment_editor = () => {
    document.getElementById('add_comment').style.display = "none";
    document.getElementById('comment_ok_cancel_btn').style.display = "none";
    document.getElementById('add_comment_section_input').style.display = "block";
  }
  public checkstatus: any = () => {
    if (this.Issue_Track_AuthToken === undefined || this.Issue_Track_AuthToken === null || this.Issue_Track_AuthToken === '') {
      this._router.navigate(['/Login']);
      return false;
    }
    else {
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
        //console.log(this.userList);
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
  public open_dropdown_of_watcher = () => {
    if ($("#watcher_m_d").css('display') == 'block') {
      document.getElementById('watcher_m_d').style.display = "none";
    }
    else if ($("#watcher_m_d").css('display') == 'none') {
      document.getElementById('watcher_m_d').style.display = "block";
    }
  }
  public watch_issue = () => {
    var concat_data = `${this.issue_info_from_api.watcher}${this.Issue_Track_UserId}:${this.Issue_Track_UserName}:${this.Issue_Track_email},`
    let add_data_to_watcher = {
      watcher_id: concat_data,
      issueId: this.issue_info_from_api.issueId
    }
    this.socket_service.add_watcher(add_data_to_watcher);
    document.getElementById('watcher_m_d').style.display = "none";
    this.get_current_issue_information(this.current_issueid);
  }

  public stop_watch_issue = () => {
    let removed_chars_watcher_name_array = this.issue_info_from_api.watcher.slice(1, -1);
    let converted_string_to_array = removed_chars_watcher_name_array.split(",");
    for (let x in converted_string_to_array) {
      let whole_string_of_sliced_data = converted_string_to_array[x].split(":");
      for (let y in whole_string_of_sliced_data) {
        if (y === '0') {
          if (whole_string_of_sliced_data[y] === this.Issue_Track_UserId) {
            var index = converted_string_to_array.indexOf(converted_string_to_array[x]);
            converted_string_to_array.splice(index, 1);
          }
        }
      }
    }
    let watcher_string = converted_string_to_array.toString(",");
    if (watcher_string != '') {
      var concat_data = `,${watcher_string},`
    }
    else {
      var concat_data = `,${watcher_string}`;
    }

    let add_data_to_watcher = {
      watcher_id: concat_data,
      issueId: this.issue_info_from_api.issueId
    }
    this.socket_service.add_watcher(add_data_to_watcher);
    document.getElementById('watcher_m_d').style.display = "none";
    this.get_current_issue_information(this.current_issueid);
  }
  public get_current_issue_information = (current_issue_id) => {
    this.socket_service.get_current_issue_info(current_issue_id).subscribe((apiResponse) => {
      if (apiResponse['status'] == 200) {
        this.origional_issue_info = {
          old_issue_title: apiResponse['data']['issue_title'],
          old_issue_description: apiResponse['data']['issue_description'],
          old_issue_assignee_name: apiResponse['data']['issue_assignee_name'],
          old_issue_assignee: apiResponse['data']['issue_assignee'],
          old_issue_reporter_name: apiResponse['data']['issue_reporter_name'],
          old_issue_reporter_id: apiResponse['data']['issue_reporter'],
          old_issue_status: apiResponse['data']['issue_status']
        };

        if (apiResponse['data']['issue_attachments'] != null) {
          var file_ext1 = apiResponse['data']['issue_attachments'].split('.').pop();
          var file_ext = file_ext1.toLowerCase();
          if (file_ext == 'bmp' || file_ext == 'gif' || file_ext == 'ico' || file_ext == 'jpeg' || file_ext == 'jpg' || file_ext == 'png' || file_ext == 'svg' || file_ext == 'tiff' || file_ext == 'tif' || file_ext == 'webp') {
            dbx.filesGetThumbnail({
              "path": `${apiResponse['data']['issue_attachments']}`, format: { '.tag': 'jpeg' },
              size: { '.tag': 'w480h320' },
              mode: { '.tag': 'strict' }
            })
              .then(function (response) {
                //alert(JSON.stringify(response))
                var fileUrl = URL.createObjectURL(response['fileBlob']);
                var img = document.createElement('img');
                img.setAttribute('src', fileUrl);
                $('#attchament_img_display').attr('src', fileUrl);
                document.getElementById("attchament_img_display").style.display = "block";
                document.getElementById('download_attachment').style.display = "none";
              })
              .catch(function (error) {
                //console.log("got error:");
                //console.log(error);
              });
          }
          else {
            dbx.filesDownload({ path: `${apiResponse['data']['issue_attachments']}` })
              .then(function (data) {
                var downloadUrl = URL.createObjectURL(data['fileBlob']);
                document.getElementById('download_attachment').style.display = "block";
                document.getElementById('attchament_img_display').style.display = "none";
                $('#download_attachment').attr('href', downloadUrl);
              })
              .catch(function (error) {
                console.error(error);
              });
          }
        }
        this.issue_info_from_api = apiResponse['data'];
      }
      this.watcher_id_array = [];
      this.watcher_name_array = [];
      if (this.issue_info_from_api.watcher != ',') {
        let removed_chars_watcher_name_array = this.issue_info_from_api.watcher.slice(1, -1);
        if (removed_chars_watcher_name_array != '' || removed_chars_watcher_name_array != null) {
          let converted_string_to_array = removed_chars_watcher_name_array.split(",");
          for (let x of converted_string_to_array) {
            let whole_string_of_sliced_data = x.split(":");
            for (let y in whole_string_of_sliced_data) {
              if (y === '0') {
                this.watcher_id_array.push(whole_string_of_sliced_data[y])
              }
              if (y === '1') {
                this.watcher_name_array.push(whole_string_of_sliced_data[y])
              }
            }
          }
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
        this.toastr.success(apiResponse['message']);
        this._router.navigate(['/Login']);
      }
      else {
        this.toastr.warning(apiResponse['message']);
      }
    });
  }
  public update_issue_title = () => {
    let watcher_id_string = this.watcher_id_array.toString();
    let updated_data = {
      issue_id: this.issue_info_from_api.issueId,
      old_issue_title: this.origional_issue_info['old_issue_title'],
      new_issue_title: this.issue_info_from_api.issue_title,
      updated_by: this.Issue_Track_UserName,
      issue_reporter: this.issue_info_from_api.issue_reporter,
      issue_assignee: this.issue_info_from_api.issue_assignee,
      issue_watchers: watcher_id_string
    }
    this.socket_service.update_I_title(updated_data);
    document.getElementById('title_ok_cancel_btn').style.display = "none";
  }

  public remove_updated_title = () => {
    this.issue_info_from_api.issue_title = this.origional_issue_info['old_issue_title'];
    document.getElementById('title_ok_cancel_btn').style.display = "none";
  }
  public description_save_btn = () => {
    let watcher_id_string = this.watcher_id_array.toString();
    let updated_description_data = {
      issue_id: this.issue_info_from_api.issueId,
      issue_title: this.issue_info_from_api.issue_title,
      old_issue_description: this.origional_issue_info['old_issue_description'],
      new_issue_description: this.issue_info_from_api.issue_description,
      updated_by: this.Issue_Track_UserName,
      issue_reporter: this.issue_info_from_api.issue_reporter,
      issue_assignee: this.issue_info_from_api.issue_assignee,
      issue_watchers: watcher_id_string
    }
    this.socket_service.update_I_desc(updated_description_data);
    document.getElementById('description_text_div').style.display = "block";
    document.getElementById('editor_content').style.display = "none";
    document.getElementById('editor_content_btns').style.display = "none";
  }
  public description_cancel_btn = () => {
    this.issue_info_from_api.issue_description = this.origional_issue_info['old_issue_description'];
    document.getElementById('description_text_div').style.display = "block";
    document.getElementById('editor_content').style.display = "none";
    document.getElementById('editor_content_btns').style.display = "none";
  }
  public update_assignee = () => {
    let watcher_id_string = this.watcher_id_array.toString();
    var selected_Assignee_name = (<HTMLInputElement>document.getElementById('Assignee_name')).value;
    var selected_assignee_id = $('#Assignee_name_list').find('option[value="' + selected_Assignee_name + '"]').attr('id');
    let updated_assignee_data = {
      issueId: this.issue_info_from_api.issueId,
      updated_assignee_name: selected_Assignee_name,
      updated_assignee_id: selected_assignee_id,
      old_assignee_name: this.origional_issue_info['old_issue_assignee_name'],
      old_assignee_id: this.origional_issue_info['old_issue_assignee'],
      issue_title: this.issue_info_from_api.issue_title,
      updated_by: this.Issue_Track_UserName,
      issue_reporter: this.issue_info_from_api.issue_reporter,
      issue_assignee: this.issue_info_from_api.issue_assignee,
      issue_watchers: watcher_id_string
    }
    this.socket_service.update_assignee(updated_assignee_data);
    this.get_current_issue_information(this.current_issueid);
  }
  public update_reporter = () => {
    let watcher_id_string = this.watcher_id_array.toString();
    var selected_Reporter_name = (<HTMLInputElement>document.getElementById('Reporter_name')).value;
    var selected_Reporter_id = $('#Reporter_name_list').find('option[value="' + selected_Reporter_name + '"]').attr('id');
    let updated_reporter_data = {
      issueId: this.issue_info_from_api.issueId,
      updated_reporter_name: selected_Reporter_name,
      updated_reporter_id: selected_Reporter_id,
      old_reporter_name: this.origional_issue_info['old_issue_reporter_name'],
      old_reporter_id: this.origional_issue_info['old_issue_reporter_id'],
      issue_title: this.issue_info_from_api.issue_title,
      updated_by: this.Issue_Track_UserName,
      issue_reporter: this.issue_info_from_api.issue_reporter,
      issue_assignee: this.issue_info_from_api.issue_assignee,
      issue_watchers: watcher_id_string
    }
    this.socket_service.update_reporter(updated_reporter_data);
    this.get_current_issue_information(this.current_issueid);
  }
  public change_issue_status = (updated_issue_status) => {
    let watcher_id_string = this.watcher_id_array.toString();
    let updated_issue_status_data = {
      issueId: this.issue_info_from_api.issueId,
      updated_issue_status: updated_issue_status,
      old_issue_status: this.origional_issue_info['old_issue_status'],
      issue_title: this.issue_info_from_api.issue_title,
      updated_by: this.Issue_Track_UserName,
      issue_reporter: this.issue_info_from_api.issue_reporter,
      issue_assignee: this.issue_info_from_api.issue_assignee,
      issue_watchers: watcher_id_string
    }
    this.socket_service.update_issue_status(updated_issue_status_data);
    this.get_current_issue_information(this.current_issueid);
  }
  public change_password = () => {
    this._router.navigate(['change-password']);
  }
  public edit_profile = () => {
    this._router.navigate(['edit-profile']);
  }

  public attachments;
  public OnFileSelected = (event) => {
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = function (e) {
      $('#blah').attr('src', reader.result);
      $('#attchament_img_display').attr('src', reader.result);
    }
    this.attachments = event.target.files[0];
  }

  public attachment_save_btn = () => {
    var images_path = $('#blah').attr('src');
    let updated_attachment_details = {
      issueId: this.issue_info_from_api.issueId,
      issue_attachments: this.attachments,
      issue_attachment_name: this.attachments.name,
      issue_attachment_type: this.attachments.type,
      issue_attachment_path: images_path,
    }
    this.socket_service.save_attachment(updated_attachment_details);
    this.attachments = '';

    /* dbx.filesGetThumbnail({
      "path": `/edwisor data/${this.attachments.name}`, format: { '.tag': 'jpeg' },
      size: { '.tag': 'w480h320' },
      mode: { '.tag': 'strict' }
    })
      .then(function (response) {
        var fileUrl = URL.createObjectURL(response['fileBlob']);
        var img = document.createElement('img');
        img.setAttribute('src', fileUrl);
        $('#attchament_img_display').attr('src', fileUrl);
        document.getElementById("attchament_img_display").style.display = "block";
      })
      .catch(function (error) {
      }); */
  }

  public add_comment_Section;
  public add_comment_to_section = () => {
    let watcher_id_string = this.watcher_id_array.toString();
    let comment_data = {
      issueId: this.current_issueid,
      commenter_user_id: this.Issue_Track_UserId,
      commenter_user_name: this.Issue_Track_UserName,
      comment: this.add_comment_Section,
      comment_posted_date: Date.now(),
      issue_title: this.issue_info_from_api.issue_title,
      updated_by: this.Issue_Track_UserName,
      issue_reporter: this.issue_info_from_api.issue_reporter,
      issue_assignee: this.issue_info_from_api.issue_assignee,
      issue_watchers: watcher_id_string
    }
    this.socket_service.add_comment(comment_data);
    document.getElementById('add_comment').style.display = "none";
    document.getElementById('comment_ok_cancel_btn').style.display = "none";
    document.getElementById('add_comment_section_input').style.display = "block";
    this.add_comment_Section = '';
    this.all_comments = [];
    this.get_All_commets_for_this_issue(this.current_issueid);
  }

  public get_All_commets_for_this_issue = (issue_id) => {
    this.socket_service.get_All_comments(issue_id).subscribe((apiResponse) => {
      if (apiResponse['status'] == 200) {
        for (let comment_data of apiResponse['data']) {
          var posted_time;
          let todays_date: any = new Date();
          let issue_posted_date_time: any = new Date(comment_data['comment_posted_date']);
          var diffMs = (todays_date - issue_posted_date_time); // milliseconds between now & Christmas
          var diffDays = Math.floor(diffMs / 86400000); // days
          var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
          var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
          var seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
          if (diffDays > 0) {
            posted_time = diffDays + " Days ago"
          }
          else if (diffHrs > 0) {
            posted_time = diffHrs + " Hours ago"
          }
          else if (diffMins > 0) {
            posted_time = diffMins + " Minutes ago"
          }
          else if (seconds > 0) {
            posted_time = seconds + " Seconds ago"
          }

          this.all_comments = [
            ...this.all_comments,
            {
              commentId: comment_data['commentId'],
              issueId: comment_data['issueId'],
              commenter_user_id: comment_data['commenter_user_id'],
              commenter_user_name: comment_data['commenter_user_name'],
              comment: comment_data['comment'],
              comment_posted_date: comment_data['comment_posted_date'],
              posted_time: posted_time
            }
          ]
        }
      }
    })
  }

  public get_particular_comment_updation = () => {
    this.socket_service.particular_issue_comment(this.current_issueid).subscribe((data) => {
      if (data['check_for_what'] == 'comment_added' && this.Issue_Track_UserId != data['commenter_user_id']) {
        this.all_comments = [];
        this.get_All_commets_for_this_issue(data['issueId']);
      }
      if (data['check_for_what'] == 'issue_creation') {
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
      if (data['check_for_what'] == 'title_updated') {
        this.origional_issue_info['old_issue_title'] = data['new_issue_title'];
        this.issue_info_from_api.issue_title = data['new_issue_title'];

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
      if (data['check_for_what'] == 'description_updated') {
        this.origional_issue_info['old_issue_description'] = data['new_issue_description'];
        this.issue_info_from_api.issue_description = data['new_issue_description'];

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
      if (data['check_for_what'] == 'assignee_updated') {
        this.origional_issue_info['old_assignee_id'] = data['updated_assignee_id'];
        this.origional_issue_info['old_assignee_name'] = data['updated_assignee_name'];
        this.issue_info_from_api.issue_assignee = data['updated_assignee_id'];
        this.issue_info_from_api.issue_assignee_name = data['updated_assignee_name'];

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
      if (data['check_for_what'] == 'reporter_updated') {
        this.origional_issue_info['old_issue_reporter_id'] = data['updated_reporter_id'];
        this.origional_issue_info['old_issue_reporter_name'] = data['updated_reporter_name'];
        this.issue_info_from_api.issue_reporter = data['updated_reporter_id'];
        this.issue_info_from_api.issue_reporter_name = data['updated_reporter_name'];

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
      if (data['check_for_what'] == 'status_updated') {
        this.origional_issue_info['issue_status'] = data['updated_issue_status'];
        this.issue_info_from_api.issue_status = data['updated_issue_status'];

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
      if (data['check_for_what'] == 'watchers_updated') {
        this.issue_info_from_api.watcher = data['watcher_id'];
        this.watcher_id_array = [];
        this.watcher_name_array = [];
        if (this.issue_info_from_api.watcher != ',') {
          let removed_chars_watcher_name_array = this.issue_info_from_api.watcher.slice(1, -1);
          if (removed_chars_watcher_name_array != '' || removed_chars_watcher_name_array != null) {
            let converted_string_to_array = removed_chars_watcher_name_array.split(",");
            for (let x of converted_string_to_array) {
              let whole_string_of_sliced_data = x.split(":");
              for (let y in whole_string_of_sliced_data) {
                if (y === '0') {
                  this.watcher_id_array.push(whole_string_of_sliced_data[y])
                }
                if (y === '1') {
                  this.watcher_name_array.push(whole_string_of_sliced_data[y])
                }
              }
            }
          }
        }
      }
      if (data['check_for_what'] == 'attachment_updated') {
        var file_ext1 = data['issue_attachments'].split('.').pop();
        var file_ext = file_ext1.toLowerCase();
        if (file_ext == 'bmp' || file_ext == 'gif' || file_ext == 'ico' || file_ext == 'jpeg' || file_ext == 'jpg' || file_ext == 'png' || file_ext == 'svg' || file_ext == 'tiff' || file_ext == 'tif' || file_ext == 'webp') {
          dbx.filesGetThumbnail({
            "path": `${data['issue_attachments']}`, format: { '.tag': 'jpeg' },
            size: { '.tag': 'w480h320' },
            mode: { '.tag': 'strict' }
          })
            .then(function (response) {
              //alert(JSON.stringify(response))
              var fileUrl = URL.createObjectURL(response['fileBlob']);
              var img = document.createElement('img');
              img.setAttribute('src', fileUrl);
              $('#attchament_img_display').attr('src', fileUrl);
              document.getElementById("attchament_img_display").style.display = "block";
              document.getElementById('download_attachment').style.display = "none";
            })
            .catch(function (error) {
              //console.log("got error:");
              //console.log(error);
            });
        }
        else {
          dbx.filesDownload({ path: `${data['issue_attachments']}` })
            .then(function (data) {
              var downloadUrl = URL.createObjectURL(data['fileBlob']);
              document.getElementById('download_attachment').style.display = "block";
              document.getElementById('attchament_img_display').style.display = "none";
              $('#download_attachment').attr('href', downloadUrl);
            })
            .catch(function (error) {
              console.error(error);
            });
        }

      }

    });
  }

  public sub1 = interval(60000)
    .subscribe((val) => {
      this.all_comments = [];
      this.get_All_commets_for_this_issue(this.current_issueid);
    });

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
