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
  selector: 'event-post',
  templateUrl: './event-post.component.html',
  styleUrls: ['./event-post.component.scss'],
})
export class EventPostComponent extends AbstractComponent implements OnInit {
  form: FormGroup;
  name: FormControl;
  date: FormControl;

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
      name: new FormControl({ value: null, disabled: false }, [
        Validators.required,
      ]),
      date: new FormControl({ value: null, disabled: false }, [
        Validators.required,
      ]),
    });
  }

  ngOnInit(): void {}

  submitForm(event: any) {
    if (this.chechIfElementShouldRecieveKeyDownEvent(event)) {
      this.createEvent();
    }
  }

  createEvent() {
    if (this.form.valid) {
      this.templateComponent.showProgressSpinner = true;
      let date = new Date(this.form.controls['date'].value);
      this.api
        .postEvent({
          name: this.form.controls['name'].value,
          startTime: date,
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
      this.form.controls['name'].markAsTouched();
      this.form.controls['date'].markAsTouched();
    }
  }

  handlePostCreateResponse(data: any) {
    this.messageService.clear();
    this.messageService.add({
      key: 'success',
      severity: 'success',
      summary: 'Success',
      detail: 'Event created successfully',
    });
    setTimeout(() => {
      this.router.navigate(['/events']);
    }, 3000);

    this.handleComplete();
  }

  handlePostCreateError(err): void {
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
