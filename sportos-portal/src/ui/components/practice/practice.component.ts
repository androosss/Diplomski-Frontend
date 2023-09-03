import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { Coach } from 'src/model/coach.model';
import { APIService } from 'src/service/api.service';
import { TemplateComponent } from '../template/template.component';

@Component({
  selector: 'practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.scss'],
})
export class PracticeComponent implements OnInit {
  data: Coach[]; // Data which shows in table
  userId: string = '';
  city: string = '';
  time: any;
  date: any;
  coachId: string = '';
  sport: string = '';
  times: any[];

  sports: any[] = [];
  selectedSports: any[] = [];
  visible: boolean = false;

  @ViewChild('filter') filter: ElementRef;

  constructor(
    private api: APIService,
    private router: Router,
    private messageService: MessageService,
    public templateComponent: TemplateComponent,
    private translateService: TranslateService
  ) {
    this.templateComponent.showProgressSpinner = true;
  }

  ngOnInit(): void {
    this.userId = JSON.parse(localStorage.getItem('token')).username;
    this.city = JSON.parse(localStorage.getItem('token')).city;
    this.api.getSports().subscribe({
      next: this.handleSportsResponse.bind(this),
      error: this.handleSportsError.bind(this),
    });
  }

  handleSportsResponse(data): void {
    this.sports = data;
    this.handleComplete();
  }

  handleSportsError(err): void {
    this.messageService.clear();
    this.messageService.add({
      key: 'error',
      severity: 'error',
      summary: 'Error',
      detail: err,
    });
    this.handleComplete();
  }

  getCoaches() {
    this.templateComponent.showProgressSpinner = true;
    let sports = '';
    for (const elem of this.selectedSports) {
      sports += elem.name + ',';
    }
    sports = sports.slice(0, -1);
    this.api
      .getCoaches(
        (sports ? '?sports=' + sports + '&' : '?') + 'city=' + this.city
      )
      .subscribe({
        next: this.handleCoachesResponse.bind(this),
        error: this.handleCoachesError.bind(this),
      });
  }

  handleComplete(): void {
    this.templateComponent.showProgressSpinner = false;
  }

  handleCoachesResponse(data): void {
    this.data = data;
    this.handleComplete();
  }

  handleCoachesError(err): void {
    console.log('[practice.component.ts] handleError(err) err= ', err);
    this.messageService.clear();
    this.messageService.add({
      key: 'error',
      severity: 'error',
      summary: 'Error',
      detail: err,
    });
    this.handleComplete();
  }

  onChangeDate(event: any) {
    this.date = event;
    this.time = undefined;
    this.api
      .getTimes(
        '?date=' + new Date(event).toISOString() + '&username=' + this.coachId
      )
      .subscribe({
        next: this.handleTimesResponse.bind(this),
        error: this.handleTimesError.bind(this),
      });
  }

  handleTimesResponse(data): void {
    this.times = data;
    this.handleComplete();
  }

  handleTimesError(err): void {
    this.messageService.clear();
    this.messageService.add({
      key: 'error',
      severity: 'error',
      summary: 'Error',
      detail: err,
    });
    this.handleComplete();
  }

  onChangeTime(event: any) {
    this.time = event.value;
  }

  showDialog(coachId, sport) {
    this.coachId = coachId;
    this.sport = sport;
    this.visible = true;
  }

  onClickApply() {
    this.templateComponent.showProgressSpinner = true;
    let date = new Date(this.date);
    let hours = parseInt(this.time.substring(0, 2), 10);
    date.setHours(date.getHours() + hours);
    this.api
      .postPractices({
        coachId: this.coachId,
        startTime: date,
        sport: this.sport,
      })
      .subscribe({
        next: this.handlePostResponse.bind(this),
        error: this.handlePostError.bind(this),
      });
  }

  handlePostResponse(data) {
    this.handleComplete();
    this.visible = false;
  }

  handlePostError(err): void {
    this.messageService.clear();
    this.messageService.add({
      key: 'error',
      severity: 'error',
      summary: 'Error',
      detail: err,
    });
    this.handleComplete();
    this.visible = false;
  }
}
