import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { APIService } from 'src/service/api.service';
import { TemplateComponent } from '../../template/template.component';

@Component({
  selector: 'reviews-table',
  templateUrl: './reviews-table.component.html',
  styleUrls: ['./reviews-table.component.scss'],
})
export class ReviewsTableComponent implements OnInit {
  coaches: any[]; // Data which shows in table
  places: any[];
  userId: string = '';
  city: string = '';

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
    this.city = JSON.parse(localStorage.getItem('token')).city;
    this.getCoaches();
    this.getPlaces();
  }

  getCoaches() {
    this.templateComponent.showProgressSpinner = true;
    this.api.getCoaches('?city=' + this.city).subscribe({
      next: this.handleActiveResponse.bind(this),
      error: this.handleActiveError.bind(this),
    });
  }

  handleComplete(): void {
    this.templateComponent.showProgressSpinner = false;
  }

  handleActiveResponse(data): void {
    this.coaches = data;
    this.handleComplete();
  }

  handleActiveError(err): void {
    console.log('[reviews-table.component.ts] handleError(err) err= ', err);
    this.messageService.clear();
    this.messageService.add({
      key: 'error',
      severity: 'error',
      summary: 'Error',
      detail: err,
    });
    this.handleComplete();
  }

  getPlaces() {
    this.templateComponent.showProgressSpinner = true;
    this.api.getPlaces('?city=' + this.city).subscribe({
      next: this.handlePlacesResponse.bind(this),
      error: this.handlePlacesError.bind(this),
    });
  }

  handlePlacesResponse(data): void {
    this.places = data;
    this.handleComplete();
  }

  handlePlacesError(err): void {
    console.log('[reviews-table.component.ts] handleError(err) err= ', err);
    this.messageService.clear();
    this.messageService.add({
      key: 'error',
      severity: 'error',
      summary: 'Error',
      detail: err,
    });
    this.handleComplete();
  }

  onClickApply(id: string) {
    this.router.navigate(['reviews', id]);
  }
}
