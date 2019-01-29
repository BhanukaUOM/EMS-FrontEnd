import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { SnotifyService } from 'ng-snotify';
import { Router, ActivatedRoute } from '@angular/router';
import { TokenService } from '../../services/token.service'
import { DataService } from 'src/app/services/data.service';
import { RolesCheckService } from 'src/app/services/roles-check.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  results = null;

  isAdmin = false;
  isTeacher = false;
  isStudent = false;
  isParent = false;
  isStudentorParent = false;

  headers = {     //Token for API Authorization
    'Authorization' : this.token.get(),
    'X-Requested-With' : 'XMLHttpRequest'
  }

  constructor(private role : RolesCheckService, private route : ActivatedRoute, private token : TokenService, private router : Router,private api : ApiService, private notify : SnotifyService) {
  }

  ngOnInit() {
    this.notify.clear();
    this.notify.info("Loading...", {timeout: 0});
    this.isAdmin = this.role.isAdmin || this.role.isSuperAdmin;
    this.isTeacher = this.role.isTeacher;
    this.isStudent = this.role.isStudent;
    this.isParent = this.role.isParent;

    this.route.queryParams.subscribe(params => {
      if(params['results']){
        this.class = false;
        this.api.get('results/mobile?&class_id=' + params['results'], this.headers).subscribe(
          data => this.datahandlerresults(data),
          error => { this.notify.error(error.error.message) }
        );
      } else {
        this.class = true;
        if(this.isParent || this.isStudent){
          this.isStudentorParent = true;
          this.api.get('results/mobile?student_id=' + localStorage.getItem('student_id') + '&subject_id=' + params['subject'], this.headers).subscribe(
            data => this.datahandler(data),
            error => { this.notify.error(error.error.message) }
          );
        } else if(this.isTeacher) {
          this.api.get('class/teacher', this.headers).subscribe(
            data => {console.log(data), this.classes = data; }
          )
        }
      }
    });
  }

  class = false;
  classes = null;
  datahandlerresults(data){
    this.results = data;
  }

  datahandler(data){
    this.notify.clear();
    console.log(data);
    this.results = data;
  }

  //User edit Handling
  edit(id){
    this.notify.clear();
    this.data = null;
    // this.api.get('users/'+id, this.headers).subscribe(
    //   data => this.editDataHandler(data),
    //   error => this.notify.error("User Not Found", {timeout: 0})
    // );
    //this.data.id = id;
    var modal = document.getElementById('editModal');
    modal.style.display = "block";
  }

  editDataHandler(data){
    console.log(data);
    // this.data.name = data.name;
    // for(var i=0; i<data.roles.length; i++)
    //   this.data.role.push(data.roles[i].name);
  }

  editsubmit(){
    this.notify.clear();
    this.notify.info("Wait...", {timeout: 0});
    // this.api.put('users/'+this.data.id, this.data, this.headers).subscribe(
    //   data => {
    //     this.notify.clear();
    //     this.notify.info("User Updated Successfully", {timeout: 2000});
    //     this.ngOnInit();
    //     this.closeEditModal();
    //   },
    //   error => { this.notify.clear(); this.error = error.error.errors; }
    // );
  }

  closeEditModal(){
    this.error = {
      'subject' : null,
      'indexNo' : null,
      'term' : null,
      'mark' : null
    };
    var modal = document.getElementById('editModal');
    modal.style.display = "none";
  }

  //User delete Handling
  delete(id){
    this.notify.clear();
    this.notify.warning('Are you sure you want to detele this User?', 'Delete User', {
      timeout: 0,
      showProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      buttons: [
        {text: 'Yes', action: () => {
          var headers = {
            'Authorization' : this.token.get()
          }
          // return this.api.delete('users/'+id, headers).subscribe(
          //   data => {this.notify.info("Success", {timeout: 2000}); this.ngOnInit(); },
          //   error => this.notify.error(error.message, {timeout: 0})
          // );
        }, bold: false},
        {text: 'No'}
      ]
    });
  }

  //New User add Handling
  add(){
    this.notify.clear();

    this.form.name = null;
    this.form.email = null;
    this.form.password = null;
    this.form.password_confirmation = null;
    this.form.role = [];

    var modal = document.getElementById('addModal');
    modal.style.display = "block";
  }

  checkboxAdd(event){
    if(event.srcElement.checked){
      this.form.role.push(event.srcElement.name);
    } else {
      var index =this.form.role.indexOf(event.srcElement.name);
      this.form.role.splice(index, index+1);
    }
    console.log(this.form.role);
  }

  addModalSubmit(){
    this.notify.clear();
    this.notify.info("Wait...", {timeout: 0});
    // this.api.post('users', this.form, this.headers).subscribe(
    //   data => {
    //     this.notify.clear();
    //     this.notify.info("User Added Successfully", {timeout: 2000});
    //     this.ngOnInit();
    //     this.closeAddModal();
    //   },
    //   error => { this.notify.clear(); this.error = error.error.errors; }
    // );

  }

  data = {          //User Update Data
    "id" : null,
    "name" : null,
    "role" : []
  }

  form = {         //New User add Data
    'name' : null,
    'email' : null,
    'password' : null,
    'password_confirmation' : null,
    'role' : []
  }

  error = {
    'subject' : null,
    'indexNo' : null,
    'term' : null,
    'mark' : null
  };
  closeAddModal(){
    this.error = {
      'subject' : null,
      'indexNo' : null,
      'term' : null,
      'mark' : null
    };
    var modal = document.getElementById('addModal');
    modal.style.display = "none";
  }

}
