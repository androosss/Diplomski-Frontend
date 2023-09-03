import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { Tournament } from 'src/model/tournament.model';
import { APIService } from 'src/service/api.service';
import { TemplateComponent } from '../../template/template.component';

@Component({
  selector: 'event-table',
  templateUrl: './event-table.component.html',
  styleUrls: ['./event-table.component.scss'],
})
export class EventTableComponent implements OnInit {
  active: Tournament[]; // Data which shows in table
  future: Tournament[];
  userId: string = '';

  menuItems: any[] = [];
  sports: any[] = [];
  selectedSports: any[] = [];

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
    this.getActiveTournaments();
    this.getFutureTournaments();
  }

  getActiveTournaments() {
    this.templateComponent.showProgressSpinner = true;
    this.api
      .getTournaments('?place=' + this.userId + '&status=ACTIVE')
      .subscribe({
        next: this.handleActiveResponse.bind(this),
        error: this.handleActiveError.bind(this),
      });
  }

  handleComplete(): void {
    this.templateComponent.showProgressSpinner = false;
  }

  handleActiveResponse(data): void {
    this.active = data;
    this.handleComplete();
  }

  handleActiveError(err): void {
    console.log('[event-table.component.ts] handleError(err) err= ', err);
    this.messageService.clear();
    this.messageService.add({
      key: 'error',
      severity: 'error',
      summary: 'Error',
      detail: err,
    });
    this.handleComplete();
  }

  getFutureTournaments() {
    this.templateComponent.showProgressSpinner = true;
    this.api
      .getTournaments('?place=' + this.userId + '&status=CREATED')
      .subscribe({
        next: this.handleFutureResponse.bind(this),
        error: this.handleFutureError.bind(this),
      });
  }

  handleFutureResponse(data): void {
    this.future = data;
    this.handleComplete();
  }

  handleFutureError(err): void {
    console.log('[event-table.component.ts] handleError(err) err= ', err);
    this.messageService.clear();
    this.messageService.add({
      key: 'error',
      severity: 'error',
      summary: 'Error',
      detail: err,
    });
    this.handleComplete();
  }

  teamNames(teams: any[]) {
    if (teams) {
      let ret = '';
      teams.forEach((team) => {
        if (ret == '') {
          ret = ret + team.name;
        } else {
          ret = ret + ',' + team.name;
        }
      });
      return ret;
    }
    return '';
  }

  eventControl(data) {
    let navigationsExtras: NavigationExtras = {
      state: {
        event: data,
      },
    };
    this.router.navigate(['event-control'], navigationsExtras);
  }

  onClickAction(event) {
    this.menuItems = [
      { label: 'Cancel', command: () => this.cancelEvent(event) },
      { label: 'Start', command: () => this.startEvent(event) },
    ];
  }

  startEvent(event) {
    this.templateComponent.showProgressSpinner = true;
    this.api
      .tournamentRound({
        id: event.eventId,
      })
      .subscribe({
        next: this.handleStartResponse.bind(this),
        error: this.handleStartError.bind(this),
      });
  }

  handleStartResponse(data): void {
    this.handleComplete();
    this.eventControl(data);
  }

  handleStartError(err): void {
    console.log('[event-table.component.ts] handleError(err) err= ', err);
    this.messageService.clear();
    this.messageService.add({
      key: 'error',
      severity: 'error',
      summary: 'Error',
      detail: err,
    });
    this.handleComplete();
  }

  cancelEvent(event) {
    this.templateComponent.showProgressSpinner = true;
    this.api
      .patchTournament({
        id: event.eventId,
        cancel: true,
      })
      .subscribe({
        next: this.handleCancelResponse.bind(this),
        error: this.handleCancelError.bind(this),
      });
  }

  handleCancelResponse(data): void {
    this.getFutureTournaments();
  }

  handleCancelError(err): void {
    console.log('[event-table.component.ts] handleError(err) err= ', err);
    this.messageService.clear();
    this.messageService.add({
      key: 'error',
      severity: 'error',
      summary: 'Error',
      detail: err,
    });
    this.handleComplete();
  }
}
