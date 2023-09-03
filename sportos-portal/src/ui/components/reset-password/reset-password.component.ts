import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { APIHelper } from 'src/helpers/api.helper';
import { LocalStorageService } from 'src/service/local.storage.service';
import { AbstractComponent } from '../common/abstract.component';
import { TemplateComponent } from '../template/template.component';


@Component({
  selector: 'reset-passowrd',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent extends AbstractComponent implements OnInit {

  form: FormGroup;
  password: FormControl;
  confirmPassword: FormControl;
  resetToken: any;

  constructor(private messageService: MessageService, private route: ActivatedRoute, public templateComponent: TemplateComponent, private formBuilder: FormBuilder, protected override injector: Injector, protected override dialogService: DialogService,  public router: Router, public localStorageService: LocalStorageService, public http: HttpClient) {
    super(injector, dialogService);
    this.form = formBuilder.group({
      'password': new FormControl({ value: null, disabled: false }, [Validators.required]),
      'confirmPassword': new FormControl({ value: null, disabled: false }, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.resetToken=this.route.snapshot.queryParams['resetToken'];
    console.log('[login.component.ts] ngOnInit()');
  }

  submitForm(event: any) {
    if (this.chechIfElementShouldRecieveKeyDownEvent(event)) {
      this.resetPassword();
    }
  }

 resetPassword() {
    if (this.form.valid) {
      if (this.form.controls['password'].value!=this.form.controls['confirmPassword'].value) {
        this.messageService.clear();
        this.messageService.add({ key: "error", severity: 'error', summary: 'Error', detail: "Passwords do not match" });
        return
      }

      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d#?!@$%^&*-\.])[a-zA-Z\d#?!@$%^&*-\.]{7,}$/.test(this.form.controls['password'].value)) {
        this.messageService.clear();
        this.messageService.add({ key: "error", severity: 'error', summary: 'Error', detail: "Passwords is not strong enough" });
        return
      }
      
      this.templateComponent.showProgressSpinner = true;

      let apiHelper = new APIHelper(this.http, this.localStorageService);
      apiHelper.getLogin().resetPassword({
          password: this.form.controls['password'].value,
          resetToken: this.resetToken
        })
        .subscribe({
          next: this.handlePostResetResponse.bind(this),
          error: this.handlePostResetError.bind(this)
        });
    } else {
      this.messageService.add({ key: "error", severity: 'error', summary: 'Error', detail: 'Email is mandatory!' });
    }
  }

  handlePostResetResponse(data: any) {
    this.messageService.clear();
    this.messageService.add({ key: "success", severity: 'success', summary: 'Success', detail: "Password successfully reset" });
    setTimeout(() => 
    {
        this.router.navigate(['login']);
    },
    3000);

    this.handleComplete();
  }

  handlePostResetError(err): void {
    console.log(err);
    this.messageService.clear();
    this.messageService.add({ key: "error", severity: 'error', summary: 'Error', detail: err });

    this.handleComplete();
  }

  handleComplete(): void {
    this.templateComponent.showProgressSpinner = false;
  }

}
