import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from 'angular-calendar';
import { ApiService } from '../../services/api.service';
import { SnotifyService } from 'ng-snotify';
import { Router } from '@angular/router';
import {NgbPaginationConfig} from '@ng-bootstrap/ng-bootstrap';

import { TokenService } from '../../services/token.service'
import { DataService } from 'src/app/services/data.service';
import { RolesCheckService } from 'src/app/services/roles-check.service';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  },
  green: {
    primary: '#1eff21',
    secondary: '#FAE3E3'
  },
};

@Component({
  selector: 'app-time-table',
  templateUrl: './time-table.component.html',
  styleUrls: ['./time-table.component.css']
})
export class TimeTableComponent implements OnInit {

  view: CalendarView = CalendarView.Week;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  isAdmin = false;
  isTeacher = false;
  isStudent = false;
  isParent = false;

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  events: CalendarEvent[] = [
    // {
    //   start: subDays(startOfDay(new Date()), 1),
    //   end: addDays(new Date(), 1),
    //   title: 'A 3 day event',
    //   color: colors.red,
    //   actions: this.actions,
    //   allDay: true,
    //   resizable: {
    //     beforeStart: true,
    //     afterEnd: true
    //   },
    //   draggable: true
    // }
  ];

  activeDayIsOpen: boolean = true;

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
  }

  addEvent(): void {
    this.events.push({
      title: 'New event',
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      color: colors.red,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    });
  }

  pagination = {    //Current Pagination data
    'page' :  '1',
    'max' : '10'
  }
  headers = {     //Token for API Authorization
    'Authorization' : this.token.get(),
    'X-Requested-With' : 'XMLHttpRequest'
  }

  constructor(private role : RolesCheckService , private pg: NgbPaginationConfig, private token : TokenService, private http : HttpClient, private router : Router,private api : ApiService, private notify : SnotifyService) {
    pg.boundaryLinks = true;
    pg.rotate = true;
  }

  timeTables = null;
  weekday=new Array(8);
  ngOnInit() {
    this.weekday[1]="Monday";
    this.weekday[2]="Tuesday";
    this.weekday[3]="Wednesday";
    this.weekday[4]="Thursday";
    this.weekday[5]="Friday";
    this.weekday[6]="Saturday";
    this.weekday[7]="Sunday";
    this.notify.clear();
    this.notify.info("Loading...", {timeout: 2000});
    this.isAdmin = this.role.isAdmin || this.role.isSuperAdmin;
    this.isTeacher = this.role.isTeacher;
    this.isStudent = this.role.isStudent;
    this.isParent = this.role.isParent;
    if(this.isParent || this.isStudent){
      this.api.get('timetable/mobile?student_id=' + localStorage.getItem('student_id'), this.headers).subscribe(
        data => this.datahandler(data),
        error => { this.notify.error(error.error.message); this.notify.error(error.error.message) }
      );
    } else if(this.isTeacher){
      console.log(JSON.parse(localStorage.getItem('user')));
      this.api.get('timetable/mobile?teacher_id=' + JSON.parse(localStorage.getItem('user')).id, this.headers).subscribe(
        data => this.datahandler(data),
        error => { this.notify.error(error.error.message); this.notify.error(error.error.message) }
      );
    } else {
      this.api.get('subjects', this.headers).subscribe(
        data => this.subjects = data,
        error => { this.notify.error(error.error.message) }
      );
      this.api.get('class/classall', this.headers).subscribe(
        data => this.classes = data,
        error => { this.notify.error(error.error.message) }
      );
      this.api.get('class/teacherall', this.headers).subscribe(
        data => this.teachers = data,
        error => { this.notify.error(error.error.message) }
      );
      this.api.get('timetable', this.headers).subscribe(
        data => this.timeTables = data,
        error => { this.notify.error(error.error.message); this.notify.error(error.error.message) }
      );
    }
  }
subjects = null;
classes = null;
teachers = null;
  datahandler(data){
    this.notify.clear();
    console.log(data);
    for(var i=0; i<data.length; i++){
      let d = addDays(startOfDay(new Date()), (data[i].week_day-startOfDay(new Date()).getDay())%7);
      data[i].start = new Date(d.setHours(data[i].start.split(':')[0], data[i].start.split(':')[1]));
      data[i].end = new Date(d.setHours(data[i].end.split(':')[0], data[i].end.split(':')[1]));
      data[i].title =  data[i].subject.name;
      if(this.isTeacher)
        data[i].title += ' - ' + data[i].class.grade + data[i].class.sub_class;
    }
    this.events = data;

  }


  //User edit Handling
  edit(id){
    this.notify.clear();
    this.api.get('timetable/'+id, this.headers).subscribe(
      data => this.editDataHandler(data),
      error => this.notify.error("Result Not Found", {timeout: 0})
    );
    this.data.id = id;
    var modal = document.getElementById('editModal');
    modal.style.display = "block";
  }

  editDataHandler(data){
    console.log(data);
    this.data.week_day = data.week_day;
    this.data.start = data.start;
    this.data.end = data.end;
    // for(var i=0; i<data.roles.length; i++)
    //   this.data.role.push(data.roles[i].name);
  }

  editsubmit(){
    this.notify.clear();
    this.notify.info("Wait...", {timeout: 0});
    this.api.put('timetable/'+this.data.id, this.data, this.headers).subscribe(
      data => {
        this.notify.clear();
        this.notify.info("User Updated Successfully", {timeout: 2000});
        this.ngOnInit();
        this.closeEditModal();
      },
      error => { this.notify.clear(); this.error = error.error.errors; }
    );
  }

  closeEditModal(){
    this.error = {
      "week_day" : null,
      "end" : null,
      "start" : null,
      "id" : null
    };
    var modal = document.getElementById('editModal');
    modal.style.display = "none";
  }

  //User delete Handling
  delete(id){
    this.notify.clear();
    this.notify.warning('Are you sure you want to detele?', 'Delete', {
      timeout: 0,
      showProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      buttons: [
        {text: 'Yes', action: () => {
          var headers = {
            'Authorization' : this.token.get()
          }
          return this.api.delete('timetable/'+id, headers).subscribe(
            data => {this.notify.info("Success", {timeout: 2000}); this.ngOnInit(); },
            error => this.notify.error(error.message, {timeout: 0})
          );
        }, bold: false},
        {text: 'No'}
      ]
    });
  }

  //New User add Handling
  add(){
    this.notify.clear();

    this.form = {
      "week_day" : null,
      "end" : null,
      "start" : null,
      "id" : null,
      "subject_id" : null,
      "class_id" : null,
      "teacher_id" : null,
    }

    var modal = document.getElementById('addModal');
    modal.style.display = "block";
  }

  addModalSubmit(){
    this.notify.clear();
    this.notify.info("Wait...", {timeout: 0});
    this.api.post('timetable', this.form, this.headers).subscribe(
      data => {
        this.notify.clear();
        this.notify.info("User Added Successfully", {timeout: 2000});
        this.ngOnInit();
        this.closeAddModal();
      },
      error => { this.notify.clear(); this.error = error.error.errors; }
    );

  }

  data = {          //User Update Data
    "week_day" : null,
    "end" : null,
    "start" : null,
    "id" : null
  }

  form = {
    "week_day" : null,
    "end" : null,
    "start" : null,
    "id" : null,
    "subject_id" : null,
    "class_id" : null,
    "teacher_id" : null,
  }

  error = {
    "week_day" : null,
    "end" : null,
    "start" : null,
    "id" : null
  };
  closeAddModal(){
    this.error = {
      "week_day" : null,
      "end" : null,
      "start" : null,
      "id" : null
    };
    var modal = document.getElementById('addModal');
    modal.style.display = "none";
  }

}



