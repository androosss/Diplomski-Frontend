import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { APIService } from 'src/service/api.service';
import { LocalStorageService } from 'src/service/local.storage.service';
import { AbstractComponent } from '../../common/abstract.component';
import { TemplateComponent } from '../../template/template.component';

@Component({
  selector: 'reviews-post',
  templateUrl: './reviews-post.component.html',
  styleUrls: ['./reviews-post.component.scss'],
})
export class ReviewsPostComponent extends AbstractComponent implements OnInit {
  id: string = '';
  userId: string = '';
  reviews: any[];
  myReview: any = {
    name: '',
    rating: 0,
    comment: '',
  };

  constructor(
    private messageService: MessageService,
    private api: APIService,
    public templateComponent: TemplateComponent,
    private formBuilder: FormBuilder,
    protected override injector: Injector,
    protected override dialogService: DialogService,
    public router: Router,
    public route: ActivatedRoute,
    public localStorageService: LocalStorageService,
    public http: HttpClient
  ) {
    super(injector, dialogService);
  }

  ngOnInit(): void {
    this.userId = JSON.parse(localStorage.getItem('token')).username;
    this.id = this.route.snapshot.paramMap.get('id');
    this.api.getReviews('?id=' + this.id).subscribe({
      next: this.handleReviewsResponse.bind(this),
      error: this.handleReviewsError.bind(this),
    });
  }

  handleReviewsResponse(data): void {
    this.myReview = {
      name: '',
      rating: 0,
      comment: '',
    };
    this.reviews = [];
    if (data && data.reviews) {
      data.reviews.forEach((elem) => {
        if (elem.userId === this.userId) {
          this.myReview = {
            name: elem.name,
            rating: elem.rating,
            comment: elem.comment,
          };
        } else {
          this.reviews.push(elem);
        }
      });
    }
    console.log(this.myReview);
    this.handleComplete();
  }

  handleReviewsError(err): void {
    this.messageService.clear();
    this.messageService.add({
      key: 'error',
      severity: 'error',
      summary: 'Error',
      detail: err,
    });
    this.handleComplete();
  }

  updateReviews() {
    this.templateComponent.showProgressSpinner = true;
    this.api
      .patchReviews({
        id: this.id,
        grade: this.myReview.rating,
        comment: this.myReview.comment,
      })
      .subscribe({
        next: this.handleUpdateResponse.bind(this),
        error: this.handleUpdateError.bind(this),
      });
  }

  handleUpdateResponse(data): void {
    this.api.getReviews('?id=' + this.id).subscribe({
      next: this.handleReviewsResponse.bind(this),
      error: this.handleReviewsError.bind(this),
    });
  }

  handleUpdateError(err): void {
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

  handleComplete(): void {
    this.templateComponent.showProgressSpinner = false;
  }
}
