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
import { APIHelper } from 'src/helpers/api.helper';
import { APIService } from 'src/service/api.service';
import { LocalStorageService } from 'src/service/local.storage.service';
import { AbstractComponent } from '../common/abstract.component';
import { TemplateComponent } from '../template/template.component';

@Component({
  selector: 'additional-info',
  templateUrl: './additional-info.component.html',
  styleUrls: ['./additional-info.component.scss'],
})
export class AdditionalInfoComponent
  extends AbstractComponent
  implements OnInit
{
  form: FormGroup;
  userType: FormControl;
  sport: FormControl;
  city: FormControl;
  user: any;

  UserType: string = '';

  sports = [];

  types = [
    { value: 'coach', name: 'Coach' },
    { value: 'player', name: 'Player' },
    { value: 'place', name: 'Sport place' },
  ];

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
    this.user = this.router.getCurrentNavigation().extras.state['user'];
    if (this.user === undefined) {
      this.router.navigate['login'];
    }
    console.log(this.user);
    this.form = formBuilder.group({
      userType: new FormControl({ value: null, disabled: false }, [
        Validators.required,
      ]),
      sport: new FormControl({ value: null, disabled: false }),
      city: new FormControl({ value: null, disabled: false }, [
        Validators.required,
      ]),
    });
  }

  ngOnInit(): void {
    console.log('[login.component.ts] ngOnInit()');
    this.api.getSports().subscribe({
      next: this.handleSportsResponse.bind(this),
      error: this.handleSportsError.bind(this),
    });
  }

  handleSportsResponse(data): void {
    console.log(
      '[additional-info.component.ts] handleResponse(data) data= ',
      data
    );
    this.sports = data;
    this.handleComplete();
  }

  handleSportsError(err): void {
    console.log('[additional-info.component.ts] handleError(err) err= ', err);
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
      this.register();
    }
  }

  register() {
    if (this.form.valid) {
      if (
        (this.form.controls['sport'].value === undefined ||
          this.form.controls['sport'].value === null) &&
        this.UserType !== 'player'
      ) {
        this.messageService.clear();
        this.messageService.add({
          key: 'error',
          severity: 'error',
          summary: 'Error',
          detail: 'All fields are mandatory',
        });
        return;
      }
      this.templateComponent.showProgressSpinner = true;

      let apiHelper = new APIHelper(this.http, this.localStorageService);
      apiHelper
        .getLogin()
        .createSocialUser({
          username: this.user.username,
          email: this.user.email,
          userType: this.form.controls['userType'].value,
          name: this.user.name,
          sport: this.form.controls['sport'].value,
          city: this.form.controls['city'].value,
        })
        .subscribe({
          next: this.handlePostRegisterResponse.bind(this),
          error: this.handlePostRegisterError.bind(this),
        });
    } else {
      this.messageService.add({
        key: 'error',
        severity: 'error',
        summary: 'Error',
        detail: 'All fields are mandatory!',
      });
      this.form.controls['username'].markAsTouched();
      this.form.controls['password'].markAsTouched();
    }
  }

  handlePostRegisterResponse(data: any) {
    console.log(
      '[register-component.ts] handlePostRegisterResponse(data: any) data= ',
      data
    );

    new APIHelper(this.http, this.localStorageService)
      .getLogin()
      .createSocialToken(this.user.username)
      .subscribe({
        next: this.handlePostSocialLoginResponse.bind(this),
        error: this.handlePostSocialLoginError.bind(this),
      });

    this.handleComplete();
  }

  handlePostSocialLoginResponse(data: any) {
    console.log(
      '[login-component.ts] handlePostSocialLoginResponse(data: any) data= ',
      data
    );
    new APIHelper(this.http, this.localStorageService)
      .getLogin()
      .setToken(data);
    this.router.navigate(['']);

    this.handleComplete();
  }

  handlePostSocialLoginError(err): void {
    this.handleComplete();
  }

  onChangeType(event: any) {
    this.UserType = event.value;
    this.userType = event.value;
  }

  onChangeSport(event: any) {
    this.sport = event.value;
  }

  handlePostRegisterError(err): void {
    console.log(err);
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
