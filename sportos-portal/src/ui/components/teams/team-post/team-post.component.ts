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
  selector: 'team-post',
  templateUrl: './team-post.component.html',
  styleUrls: ['./team-post.component.scss'],
})
export class TeamPostComponent extends AbstractComponent implements OnInit {
  form: FormGroup;
  sport: FormControl;
  name: FormControl;

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
      sport: new FormControl({ value: null, disabled: false }, [
        Validators.required,
      ]),
      name: new FormControl({ value: null, disabled: false }, [
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
      this.createTeam();
    }
  }

  createTeam() {
    if (this.form.valid) {
      this.templateComponent.showProgressSpinner = true;
      this.api
        .postTeam({
          sport: this.form.controls['sport'].value,
          name: this.form.controls['name'].value,
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
      this.form.controls['name'].markAsTouched();
    }
  }

  handlePostCreateResponse(data: any) {
    this.messageService.clear();
    this.messageService.add({
      key: 'success',
      severity: 'success',
      summary: 'Success',
      detail: 'Team created successfully',
    });
    setTimeout(() => {
      this.router.navigate(['/teams']);
    }, 3000);

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
