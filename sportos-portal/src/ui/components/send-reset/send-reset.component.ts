import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { APIHelper } from 'src/helpers/api.helper';
import { LocalStorageService } from 'src/service/local.storage.service';
import { AbstractComponent } from '../common/abstract.component';
import { TemplateComponent } from '../template/template.component';


@Component({
  selector: 'send-reset',
  templateUrl: './send-reset.component.html',
  styleUrls: ['./send-reset.component.scss']
})
export class SendResetComponent extends AbstractComponent implements OnInit {

  form: FormGroup;
  email: FormControl;

  constructor(private messageService: MessageService, public templateComponent: TemplateComponent, private formBuilder: FormBuilder, protected override injector: Injector, protected override dialogService: DialogService,  public router: Router, public localStorageService: LocalStorageService, public http: HttpClient) {
    super(injector, dialogService);
    this.form = formBuilder.group({
      'email': new FormControl({ value: null, disabled: false }, [Validators.required]),
    });
  }

  ngOnInit(): void {
   console.log('[login.component.ts] ngOnInit()');
  }

  submitForm(event: any) {
    if (this.chechIfElementShouldRecieveKeyDownEvent(event)) {
      this.sendReset();
    }
  }

 sendReset() {
    if (this.form.valid) {
      this.templateComponent.showProgressSpinner = true;

      let apiHelper = new APIHelper(this.http, this.localStorageService);
      apiHelper.getLogin().sendReset(this.form.controls['email'].value)
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
    this.messageService.add({ key: "success", severity: 'success', summary: 'Success', detail: "Password reset email successfully sent" });
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
