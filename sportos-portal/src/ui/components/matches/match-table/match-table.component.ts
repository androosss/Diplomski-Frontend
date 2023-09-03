import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Match } from 'src/model/match.model';
import { APIService } from 'src/service/api.service';
import { TemplateComponent } from '../../template/template.component';

@Component({
  selector: 'match-table',
  templateUrl: './match-table.component.html',
  styleUrls: ['./match-table.component.scss'],
})
export class MatchTableComponent implements OnInit {
  data: Match[]; // Data which shows in table
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

  getMatches() {
    this.templateComponent.showProgressSpinner = true;
    let sports = '';
    for (const elem of this.selectedSports) {
      sports += elem.name + ',';
    }
    sports = sports.slice(0, -1);
    this.api
      .getMatches('?playerId=' + this.userId + '&sports=' + sports)
      .subscribe({
        next: this.handleMatchesResponse.bind(this),
        error: this.handleMatchesError.bind(this),
      });
  }

  handleComplete(): void {
    this.templateComponent.showProgressSpinner = false;
  }

  handleMatchesResponse(data): void {
    this.data = data;
    this.handleComplete();
  }

  handleMatchesError(err): void {
    console.log('[match-table.component.ts] handleError(err) err= ', err);
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

  onClickApply(match: Match) {
    this.api
      .patchMatch({
        id: match.matchId,
        player: this.userId,
      })
      .subscribe({
        next: this.handlePatchResponse.bind(this),
        error: this.handlePatchError.bind(this),
      });
  }

  handlePatchResponse(data: any) {
    this.api.getMatches('?playerId=' + this.userId).subscribe({
      next: this.handleMatchesResponse.bind(this),
      error: this.handleMatchesError.bind(this),
    });
  }

  handlePatchError(err) {
    console.log('[match-table.component.ts] handleError(err) err= ', err);
    this.messageService.clear();
    this.messageService.add({
      key: 'error',
      severity: 'error',
      summary: 'Error',
      detail: JSON.stringify(err.error),
    });
    this.handleComplete();
  }

  checkIfApplied(players: string): boolean {
    let playersArr = players.split(',');
    for (const elem of playersArr) {
      if (elem === this.userId) {
        return true;
      }
    }
    return false;
  }

  updateResult(matchId, result: any) {
    this.api
      .patchMatch({
        id: matchId,
        result: result,
      })
      .subscribe({
        next: this.handlePatchResponse.bind(this),
        error: this.handlePatchError.bind(this),
      });
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  onClickCreate() {
    this.router.navigate(['/match-post']);
  }
}
