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
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent extends AbstractComponent implements OnInit {
  form: FormGroup;
  username: FormControl;
  password: FormControl;
  confirmPassword: FormControl;
  email: FormControl;
  userType: FormControl;
  name: FormControl;
  sport: FormControl;
  city: FormControl;

  UserType: string = '';

  types = [
    { value: 'coach', name: 'Coach' },
    { value: 'player', name: 'Player' },
    { value: 'place', name: 'Sport place' },
  ];

  sports = [];

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
      username: new FormControl({ value: null, disabled: false }, [
        Validators.required,
      ]),
      password: new FormControl({ value: null, disabled: false }, [
        Validators.required,
      ]),
      confirmPassword: new FormControl({ value: null, disabled: false }, [
        Validators.required,
      ]),
      email: new FormControl({ value: null, disabled: false }, [
        Validators.required,
      ]),
      userType: new FormControl({ value: null, disabled: false }, [
        Validators.required,
      ]),
      sport: new FormControl({ value: null, disabled: false }),
      name: new FormControl({ value: null, disabled: false }, [
        Validators.required,
      ]),
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
    console.log('[register.component.ts] handleResponse(data) data= ', data);
    this.sports = data;
    this.handleComplete();
  }

  handleSportsError(err): void {
    console.log('[register.component.ts] handleError(err) err= ', err);
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
        this.form.controls['password'].value !=
        this.form.controls['confirmPassword'].value
      ) {
        this.messageService.clear();
        this.messageService.add({
          key: 'error',
          severity: 'error',
          summary: 'Error',
          detail: 'Passwords do not match',
        });
        return;
      }

      if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d#?!@$%^&*-\.])[a-zA-Z\d#?!@$%^&*-\.]{7,}$/.test(
          this.form.controls['password'].value
        )
      ) {
        this.messageService.clear();
        this.messageService.add({
          key: 'error',
          severity: 'error',
          summary: 'Error',
          detail: 'Passwords is not strong enough',
        });
        return;
      }

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
        .createUser({
          username: this.form.controls['username'].value,
          password: this.form.controls['password'].value,
          email: this.form.controls['email'].value,
          userType: this.form.controls['userType'].value,
          sport: this.form.controls['sport'].value,
          name: this.form.controls['name'].value,
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

    this.messageService.clear();
    this.messageService.add({
      key: 'success',
      severity: 'success',
      summary: 'Success',
      detail: 'Please verify your email',
    });
    setTimeout(() => {
      this.router.navigate(['login']);
    }, 3000);

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
