import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import * as io from 'socket.io-client';
import { Observable, from } from 'rxjs';
import { tap } from 'rxjs/operators';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private baseUrl = "http://localhost:3000";
  private socket;
  private IssueUrl = "http://localhost:3000/api/v1/Issues";
  public USerUrl = "http://localhost:3000/api/v1/users";
 public commentUrl = "http://localhost:3000/api/v1/Comments";

  constructor(public _http: HttpClient) { 
    this.socket = io('http://localhost:3000', { transports: ['websocket'] });
  }

  public create_issue = (create_issue_data) => {
    console.log("create issue");
    this.socket.emit("create-issue", create_issue_data);
  }

  public verifyUSer = () => {
    return Observable.create((observer) => {
      this.socket.on('VerifyUser', (data) => {
        observer.next(data);
      });
    });
  }

  public onlineUSerList = () => {
    return Observable.create((observer) => {
      this.socket.on('online-user-list', (userList) => {
        observer.next(userList);
      });
    });
  }

  public add_watcher = (data) => {
    this.socket.emit('add-watcher',data);
  }

  public setUser = (authToken) => {
    console.log("set user is called");
    this.socket.emit("set-User", authToken);
  }

  public particular_user_issues = (userId) => {
    return Observable.create((observer) => {
      this.socket.on(userId, (data) => {
        observer.next(data);
      }); // end Socket
    }); // end Observable
  }

  public get_issues_assigned_to_loggedin_user = (logged_in_user_data) => {
    let params = new HttpParams()
    .set('logged_in_user_id', logged_in_user_data.assignee)

    let response = this._http.post(`${this.IssueUrl}/Perticular-User-assigned-issues`, params);
    return response;
  }

  public get_issues_created_by_log_in_user = (log_in_user_data) => {
    let params = new HttpParams()
    .set('issue_reporter_id', log_in_user_data.issue_reporter)

    let response = this._http.post(`${this.IssueUrl}/issues-created-by-logged-in-user`, params);
    return response;
  }

  public getAll_issues = () => {
    let response = this._http.get(`${this.IssueUrl}/get-all-issues`);
    return response;
  }

  public get_done_Issues = () => {
    let response = this._http.get(`${this.IssueUrl}/done-issues`);
    return response;
  }

  public get_ALL_open_Issues = () => {
    let response = this._http.get(`${this.IssueUrl}/all-open-issues`);
    return response;
  }

  public get_current_issue_info = (issue_id) => {
    let params = new HttpParams()
                  .set('issue_id',issue_id)
    let response = this._http.post(`${this.IssueUrl}/issue-information`,params);
    return response;
  }

  public update_I_title = (data_to_update) => {
    //alert();
    this.socket.emit("update_title", data_to_update);
  }

  public update_I_desc = (data_to_update) => {
    this.socket.emit("update_description",data_to_update)
  }

  public get_all_user_list = () => {
    let response = this._http.get(`${this.USerUrl}/getallUser`);
    return response;
  }

  public update_assignee = (updated_assignee_data) => {
    this.socket.emit('update-assignee',updated_assignee_data);
  }

  public update_reporter = (updated_reporter_data) => {
    this.socket.emit('update-reporter',updated_reporter_data);
  }

  public update_issue_status = (updated_issue_status_data) => {
    this.socket.emit('update-issue-status',updated_issue_status_data);
  }

  public save_attachment = (updated_attachment_details) => {
    this.socket.emit('update-attachment',updated_attachment_details);
  }

  public add_comment = (comment_data) => {
    this.socket.emit('add-comment',comment_data);
  }

  public Logout = (user_id) => {
    let get_data = new HttpParams()
    .set('userId', user_id.userId);

    let response = this._http.post(`${this.USerUrl}/logOut`, get_data);
    return response;
  }

  public get_All_comments = (issue_id) => {
    let data = new HttpParams()
              .set('issueId',issue_id);
    let response = this._http.post(`${this.commentUrl}/get-comments-of-particular-issue`,data);
    return response;
  }

  public particular_issue_comment = (issueId) => {
    return Observable.create((observer) => {
      this.socket.on(issueId, (data) => {
        observer.next(data);
      }); // end Socket
    }); // end Observable
  } 

  public get_list_of_Async_issues = (userId) => {
    return Observable.create((observer) => {
      this.socket.on('send-all-async-issues', (data) => {
        observer.next(data);
      }); // end Socket
    }); // end Observable
  }

}
