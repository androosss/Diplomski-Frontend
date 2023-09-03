import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Team } from 'src/model/team.model';
import { APIService } from 'src/service/api.service';
import { TemplateComponent } from '../../template/template.component';

@Component({
  selector: 'team-table',
  templateUrl: './team-table.component.html',
  styleUrls: ['./team-table.component.scss'],
})
export class TeamTableComponent implements OnInit {
  data: Team[]; // Data which shows in table
  userId: string = '';

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

  getTeams() {
    this.templateComponent.showProgressSpinner = true;
    let sports = '';
    for (const elem of this.selectedSports) {
      sports += elem.name + ',';
    }
    sports = sports.slice(0, -1);
    this.api
      .getTeams(
        '?skipUser=' + this.userId + '&sports=' + sports + '&status=ACTIVE'
      )
      .subscribe({
        next: this.handleTeamsResponse.bind(this),
        error: this.handleTeamsError.bind(this),
      });
  }

  handleComplete(): void {
    this.templateComponent.showProgressSpinner = false;
  }

  handleTeamsResponse(data): void {
    this.data = data;
    this.handleComplete();
  }

  handleTeamsError(err): void {
    console.log('[team-table.component.ts] handleError(err) err= ', err);
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

  onClickApply(team: Team) {
    this.api
      .patchTeam({
        id: team.id,
        player: this.userId,
      })
      .subscribe({
        next: this.handlePatchResponse.bind(this),
        error: this.handlePatchError.bind(this),
      });
  }

  handlePatchResponse(data: any) {
    this.getTeams();
  }

  handlePatchError(err) {
    console.log('[team-table.component.ts] handleError(err) err= ', err);
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

  onClickCreate() {
    this.router.navigate(['/team-post']);
  }
}
