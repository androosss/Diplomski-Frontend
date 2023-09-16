import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { Practice } from 'src/model/practice.model';
import { APIService } from 'src/service/api.service';
import { TemplateComponent } from '../template/template.component';

@Component({
  selector: 'offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss'],
})
export class OffersComponent implements OnInit {
  active: Practice[]; // Data which shows in table
  future: Practice[];
  past: Practice[];
  userId: string = '';

  menuItems: any[] = [];

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
    this.fetchOffers();
  }

  handleComplete(): void {
    this.templateComponent.showProgressSpinner = false;
  }

  fetchOffers() {
    this.templateComponent.showProgressSpinner = true;
    this.api.getPractices('?coachId=' + this.userId).subscribe({
      next: this.handleOffersResponse.bind(this),
      error: this.handleOffersError.bind(this),
    });
  }

  handleOffersResponse(data): void {
    this.active = [];
    this.future = [];
    this.past = [];
    let now = new Date();
    for (let i = 0; i < data.length; i++) {
      let start = new Date(data[i].startTime);
      if (start < now || data[i].status === 'DENIED') {
        this.past.push(data[i]);
      } else {
        if (data[i].status === 'ACCEPTED') {
          this.active.push(data[i]);
        } else {
          this.future.push(data[i]);
        }
      }
    }
    this.handleComplete();
  }

  handleOffersError(err): void {
    console.log('[offers.component.ts] handleError(err) err= ', err);
    this.messageService.clear();
    this.messageService.add({
      key: 'error',
      severity: 'error',
      summary: 'Error',
      detail: err,
    });
    this.handleComplete();
  }

  onClickAction(offer) {
    this.menuItems = [
      { label: 'Deny', command: () => this.denyOffer(offer) },
      { label: 'Accept', command: () => this.acceptOffer(offer) },
    ];
  }

  acceptOffer(offer) {
    this.templateComponent.showProgressSpinner = true;
    this.api
      .patchPractices({
        id: offer.practiceId,
        status: 'ACCEPTED',
      })
      .subscribe({
        next: this.handleAcceptResponse.bind(this),
        error: this.handleAcceptError.bind(this),
      });
  }

  handleAcceptResponse(data): void {
    this.fetchOffers();
    this.handleComplete();
  }

  handleAcceptError(err): void {
    console.log('[offers.component.ts] handleError(err) err= ', err);
    this.messageService.clear();
    this.messageService.add({
      key: 'error',
      severity: 'error',
      summary: 'Error',
      detail: err,
    });
    this.handleComplete();
  }

  denyOffer(offer) {
    this.templateComponent.showProgressSpinner = true;
    this.api
      .patchPractices({
        id: offer.practiceId,
        status: 'DENIED',
      })
      .subscribe({
        next: this.handleAcceptResponse.bind(this),
        error: this.handleAcceptError.bind(this),
      });
  }

  handleDenyResponse(data): void {
    this.fetchOffers();
    this.handleComplete();
  }

  handleDenyError(err): void {
    console.log('[offers.component.ts] handleError(err) err= ', err);
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
