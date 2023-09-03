import { HttpClient } from '@angular/common/http';
import { Component, Injector, NgZone, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import {
  FacebookLoginProvider,
  SocialAuthService,
} from 'angularx-social-login';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { APIHelper } from 'src/helpers/api.helper';
import { LocalStorageService } from 'src/service/local.storage.service';
import { AbstractComponent } from '../common/abstract.component';
import { TemplateComponent } from '../template/template.component';

declare var google: any;

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends AbstractComponent implements OnInit {
  form: FormGroup;
  username: FormControl;
  password: FormControl;
  user: any;
  isSignedin: boolean;

  constructor(
    private messageService: MessageService,
    private ngZone: NgZone,
    public templateComponent: TemplateComponent,
    private formBuilder: FormBuilder,
    protected override injector: Injector,
    protected override dialogService: DialogService,
    public router: Router,
    public localStorageService: LocalStorageService,
    public http: HttpClient,
    private socialAuthService: SocialAuthService
  ) {
    super(injector, dialogService);
    this.form = formBuilder.group({
      username: new FormControl({ value: null, disabled: false }, [
        Validators.required,
      ]),
      password: new FormControl({ value: null, disabled: false }, [
        Validators.required,
      ]),
    });
  }

  ngOnInit(): void {
    console.log('[login.component.ts] ngOnInit()');
  }

  submitForm(event: any) {
    if (this.chechIfElementShouldRecieveKeyDownEvent(event)) {
      this.login();
    }
  }

  login() {
    if (this.form.valid) {
      this.templateComponent.showProgressSpinner = true;

      let apiHelper = new APIHelper(this.http, this.localStorageService);
      apiHelper
        .getLogin()
        .createToken({
          username: this.form.controls['username'].value,
          password: this.form.controls['password'].value,
        })
        .subscribe({
          next: this.handlePostLoginResponse.bind(this),
          error: this.handlePostLoginError.bind(this),
        });
    } else {
      this.messageService.add({
        key: 'error',
        severity: 'error',
        summary: 'Error',
        detail: 'Username and password are mandatory!',
      });
      this.form.controls['username'].markAsTouched();
      this.form.controls['password'].markAsTouched();
    }
  }

  ngAfterViewInit(): void {
    google.accounts.id.initialize({
      client_id:
        '430413954914-tsghgb4cvv3ib95dtrndr6qkvppnfmn2.apps.googleusercontent.com',
      callback: (response: any) =>
        this.ngZone.run(() => this.handleGoogleSignIn(response)),
    });
    google.accounts.id.renderButton(
      document.getElementById('buttonDiv'),
      { size: 'large', type: 'icon', shape: 'pill' } // customization attributes
    );
  }

  handleGoogleSignIn(response: any) {
    console.log(response.credential);

    // This next is for decoding the idToken to an object if you want to see the details.
    let base64Url = response.credential.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let user = JSON.parse(
      decodeURIComponent(
        atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      )
    );
    this.localStorageService.set('forShow', user.given_name);
    this.user = {
      username: 'google_' + user.sub,
      email: user.email,
      name: user.name,
    };
    new APIHelper(this.http, this.localStorageService)
      .getLogin()
      .createSocialToken(this.user.username)
      .subscribe({
        next: this.handlePostSocialLoginResponse.bind(this),
        error: this.handlePostSocialLoginError.bind(this),
      });
  }

  facebookLogin(): void {
    this.socialAuthService
      .signIn(FacebookLoginProvider.PROVIDER_ID)
      .then((user) => {
        this.user = {
          username: 'facebook_' + user.id,
          email: user.email,
          name: user.firstName + ' ' + user.lastName,
        };
        this.localStorageService.set('forShow', user.firstName);
        new APIHelper(this.http, this.localStorageService)
          .getLogin()
          .createSocialToken(this.user.username)
          .subscribe({
            next: this.handlePostSocialLoginResponse.bind(this),
            error: this.handlePostSocialLoginError.bind(this),
          });
      });
  }

  register() {
    this.router.navigate(['register']);
  }

  reset() {
    this.router.navigate(['send-reset']);
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
    let navigationsExtras: NavigationExtras = {
      state: {
        user: this.user,
      },
    };
    this.router.navigate(['additional-info'], navigationsExtras);

    this.handleComplete();
  }

  handlePostLoginResponse(data: any) {
    console.log(
      '[login-component.ts] handlePostLoginResponse(data: any) data= ',
      data
    );
    new APIHelper(this.http, this.localStorageService)
      .getLogin()
      .setToken(data);
    this.localStorageService.set('forShow', data.username);
    this.router.navigate(['']);

    this.handleComplete();
  }

  handlePostLoginError(err): void {
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
