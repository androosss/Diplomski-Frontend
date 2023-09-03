import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { APIService } from 'src/service/api.service';
import { TemplateComponent } from '../../template/template.component';

@Component({
  selector: 'event-control',
  templateUrl: './event-control.component.html',
  styleUrls: ['./event-control.component.scss'],
})
export class EventControlComponent implements OnInit {
  userId: string = '';
  event: any;

  pairings: any[] = [];
  standings: any[] = [];

  @ViewChild('filter') filter: ElementRef;

  constructor(
    private api: APIService,
    private router: Router,
    private messageService: MessageService,
    public templateComponent: TemplateComponent,
    private translateService: TranslateService
  ) {
    this.event = this.router.getCurrentNavigation()?.extras?.state?.['event'];
    if (!this.event) {
      this.router.navigate(['events']);
    }
    this.standings = this.event?.tournament?.standings;
    this.pairings =
      this.event?.tournament?.rounds?.[
        this.event?.tournament?.rounds.length - 1
      ].pairing;
    console.log(this.event);
    console.log(this.standings);
    console.log(this.pairings);
  }

  ngOnInit(): void {
    this.userId = JSON.parse(localStorage.getItem('token')).username;
  }

  finishEvent() {
    this.pairings.forEach((item) => {
      if (!item.score) {
        this.messageService.clear();
        this.messageService.add({
          key: 'error',
          severity: 'error',
          summary: 'Error',
          detail: 'All scores must be entered',
        });
      }
    });
    this.api
      .patchTournament({
        id: this.event.eventId,
        finish: true,
        round: { pairing: this.pairings },
      })
      .subscribe({
        next: this.handleFinishResponse.bind(this),
        error: this.handleFinishError.bind(this),
      });
  }

  handleFinishResponse(data): void {
    this.handleComplete();
    this.event = data;
    this.standings = this.event?.tournament?.standings;
    this.pairings =
      this.event?.tournament?.rounds?.[
        this.event?.tournament?.rounds.length - 1
      ].pairing;
  }

  handleFinishError(err): void {
    console.log('[event-control.component.ts] handleError(err) err= ', err);
    this.messageService.clear();
    this.messageService.add({
      key: 'error',
      severity: 'error',
      summary: 'Error',
      detail: err,
    });
    this.handleComplete();
  }

  createNextRound() {
    this.pairings.forEach((item) => {
      if (!item.score) {
        this.messageService.clear();
        this.messageService.add({
          key: 'error',
          severity: 'error',
          summary: 'Error',
          detail: 'All scores must be entered',
        });
      }
    });
    this.api
      .tournamentRound({
        id: this.event.eventId,
        round: { pairing: this.pairings },
      })
      .subscribe({
        next: this.handleRoundResponse.bind(this),
        error: this.handleRoundError.bind(this),
      });
  }

  handleRoundResponse(data): void {
    this.handleComplete();
    this.event = data;
    this.standings = this.event?.tournament?.standings;
    this.pairings =
      this.event?.tournament?.rounds?.[
        this.event?.tournament?.rounds.length - 1
      ].pairing;
  }

  handleRoundError(err): void {
    console.log('[event-control.component.ts] handleError(err) err= ', err);
    this.messageService.clear();
    this.messageService.add({
      key: 'error',
      severity: 'error',
      summary: 'Error',
      detail: err,
    });
    this.handleComplete();
  }

  handleComplete(): void {
    this.templateComponent.showProgressSpinner = false;
  }
}
