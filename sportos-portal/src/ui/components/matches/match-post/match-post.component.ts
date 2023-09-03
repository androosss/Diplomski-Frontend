import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { APIService } from 'src/service/api.service';
import { LocalStorageService } from 'src/service/local.storage.service';
import { AbstractComponent } from '../../common/abstract.component';
import { TemplateComponent } from '../../template/template.component';

@Component({
  selector: 'match-post',
  templateUrl: './match-post.component.html',
  styleUrls: ['./match-post.component.scss'],
})
export class MatchPostComponent extends AbstractComponent implements OnInit {
  form: FormGroup;
  sport: FormControl;
  place: FormControl;
  date: FormControl;
  time: FormControl;

  sports = [];

  places = [];

  times = [];

  constructor(
    private messageService: MessageService,
    private api: APIService,
    public templateComponent: TemplateComponent,
    private formBuilder: FormBuilder,
    protected override injector: Injector,
    protected override dialogService: DialogService,
    public router: Router,
    public localStorageService: LocalStorageService,
    public http: HttpClient
  ) {
    super(injector, dialogService);
    this.form = formBuilder.group({
      sport: new FormControl({ value: null, disabled: false }, [
        Validators.required,
      ]),
      place: new FormControl({ value: null, disabled: false }, [
        Validators.required,
      ]),
      date: new FormControl({ value: null, disabled: false }, [
        Validators.required,
      ]),
      time: new FormControl({ value: null, disabled: false }, [
        Validators.required,
      ]),
    });
  }

  ngOnInit(): void {
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

  submitForm(event: any) {
    if (this.chechIfElementShouldRecieveKeyDownEvent(event)) {
      this.createMatch();
    }
  }

  createMatch() {
    if (this.form.valid) {
      this.templateComponent.showProgressSpinner = true;
      let date = new Date(this.form.controls['date'].value);
      let hours = parseInt(
        this.form.controls['time'].value.substring(0, 2),
        10
      );
      date.setHours(date.getHours() + hours);
      this.api
        .postMatch({
          sport: this.form.controls['sport'].value,
          placeId: this.form.controls['place'].value,
          startTime: date,
          players: JSON.parse(localStorage.getItem('token')).username,
        })
        .subscribe({
          next: this.handlePostCreateResponse.bind(this),
          error: this.handlePostCreateError.bind(this),
        });
    } else {
      this.messageService.add({
        key: 'error',
        severity: 'error',
        summary: 'Error',
        detail: 'All fields are mandatory!',
      });
      this.form.controls['sport'].markAsTouched();
      this.form.controls['place'].markAsTouched();
    }
  }

  handlePostCreateResponse(data: any) {
    this.messageService.clear();
    this.messageService.add({
      key: 'success',
      severity: 'success',
      summary: 'Success',
      detail: 'Match created successfully',
    });
    setTimeout(() => {
      this.router.navigate(['/casual']);
    }, 3000);

    this.handleComplete();
  }

  onChangeSport(event: any) {
    this.sport = event.value;
    this.api
      .getPlaces(
        '?sport=' +
          event.value +
          '&city=' +
          JSON.parse(localStorage.getItem('token')).city
      )
      .subscribe({
        next: this.handlePlacesResponse.bind(this),
        error: this.handlePlacesError.bind(this),
      });
  }

  onChangePlace(event: any) {
    this.place = event.value;
    this.form.controls['time'].reset();
  }

  onChangeDate(event: any) {
    this.date = event;
    this.form.controls['time'].reset();
    this.api
      .getTimes(
        '?date=' +
          new Date(event).toISOString() +
          '&username=' +
          this.form.controls['place'].value
      )
      .subscribe({
        next: this.handleTimesResponse.bind(this),
        error: this.handleTimesError.bind(this),
      });
  }

  onChangeTime(event: any) {
    this.time = event.value;
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

  handlePlacesResponse(data): void {
    this.places = data;
    this.handleComplete();
  }

  handlePlacesError(err): void {
    this.messageService.clear();
    this.messageService.add({
      key: 'error',
      severity: 'error',
      summary: 'Error',
      detail: err,
    });
    this.handleComplete();
  }

  handlePostCreateError(err): void {
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
