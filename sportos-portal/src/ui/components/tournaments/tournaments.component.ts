import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Tournament } from 'src/model/tournament.model';
import { APIService } from 'src/service/api.service';
import { TemplateComponent } from '../template/template.component';

@Component({
  selector: 'tournaments',
  templateUrl: './tournaments.component.html',
  styleUrls: ['./tournaments.component.scss'],
})
export class TournamentsComponent implements OnInit {
  data: Tournament[]; // Data which shows in table
  userId: string = '';

  sports: any[] = [];
  selectedSports: any[] = [];
  team: any;
  teams: any[];
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

  getTournaments() {
    this.templateComponent.showProgressSpinner = true;
    let sports = '';
    for (const elem of this.selectedSports) {
      sports += elem.name + ',';
    }
    sports = sports.slice(0, -1);
    this.api
      .getTournaments(
        (sports ? '?sports=' + sports + '&' : '?') + 'status=CREATED'
      )
      .subscribe({
        next: this.handleTournamentsResponse.bind(this),
        error: this.handleTournamentsError.bind(this),
      });
  }

  handleComplete(): void {
    this.templateComponent.showProgressSpinner = false;
  }

  handleTournamentsResponse(data): void {
    this.data = data;
    this.handleComplete();
  }

  handleTournamentsError(err): void {
    console.log('[tournament.component.ts] handleError(err) err= ', err);
    this.messageService.clear();
    this.messageService.add({
      key: 'error',
      severity: 'error',
      summary: 'Error',
      detail: err,
    });
    this.handleComplete();
  }

  onSort() {}

  onClickApply(tournament: Tournament) {
    console.log(tournament);
    this.api
      .patchTournament({
        id: tournament.eventId,
        team: this.team.id,
      })
      .subscribe({
        next: this.handlePatchResponse.bind(this),
        error: this.handlePatchError.bind(this),
      });
  }

  handlePatchResponse(data: any) {
    this.getTournaments();
    this.visible = false;
  }

  handlePatchError(err) {
    console.log('[tournament-table.component.ts] handleError(err) err= ', err);
    this.messageService.clear();
    this.messageService.add({
      key: 'error',
      severity: 'error',
      summary: 'Error',
      detail: JSON.stringify(err.error),
    });
    this.handleComplete();
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  showDialog(sport: string) {
    this.api
      .getTeams('?sports=' + sport + '&owner=' + this.userId + '&status=FULL')
      .subscribe((teams) => {
        this.teams = teams;
        this.visible = true;
      });
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
}
