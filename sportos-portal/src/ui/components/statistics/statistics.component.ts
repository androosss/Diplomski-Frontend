import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { Stats } from 'src/model/stats.model';
import { APIService } from 'src/service/api.service';
import { TemplateComponent } from '../template/template.component';

@Component({
  selector: 'statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

  stats: any; // Data which shows
  userId: string = "";
  loading: boolean = false;
  sports: any[] = [];
  selectedSports: any;

  @Input() title: string;

  constructor(private api: APIService, private router: Router, private messageService: MessageService,
    public templateComponent: TemplateComponent, private translateService: TranslateService) {
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
    this.messageService.add({ key: "error", severity: 'error', summary: 'Error', detail: err });
    this.handleComplete();
  }

  ngOnInit(): void {
    this.userId = JSON.parse(localStorage.getItem("token")).username
      }

  handleStatsResponse(data: Stats[]): void {
    this.stats = data;
    console.log(this.stats.matches)
    this.handleComplete();
  }

  handleStatsError(err): void {
    this.messageService.clear();
    this.messageService.add({ key: "error", severity: 'error', summary: 'Error', detail: err });
    this.handleComplete();
  }

  handleComplete(): void {
    this.loading = false
    this.templateComponent.showProgressSpinner = false;
  }

  getStats() {
    this.loading = true
    this.templateComponent.showProgressSpinner = true;
    this.api.getStats('?sport=' + this.selectedSports.name).subscribe({
      next: this.handleStatsResponse.bind(this),
      error: this.handleStatsError.bind(this),
    });
  }
}
