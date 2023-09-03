import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { APIHelper } from 'src/helpers/api.helper';
import { LocalStorageService } from 'src/service/local.storage.service';
import { AbstractComponent } from '../common/abstract.component';
import { TemplateComponent } from '../template/template.component';

@Component({
  selector: 'verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss'],
})
export class VerifyComponent extends AbstractComponent implements OnInit {
  verifyToken: string;

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute,
    public templateComponent: TemplateComponent,
    protected override injector: Injector,
    protected override dialogService: DialogService,
    public router: Router,
    public localStorageService: LocalStorageService,
    public http: HttpClient
  ) {
    super(injector, dialogService);
  }

  ngOnInit(): void {
    this.verifyToken = this.route.snapshot.queryParams['verifyToken'];
    console.log('[verify.component.ts] ngOnInit()');
    this.verify();
  }

  verify() {
    this.templateComponent.showProgressSpinner = true;

    let apiHelper = new APIHelper(this.http, this.localStorageService);
    apiHelper
      .getLogin()
      .verifyUser(this.verifyToken)
      .subscribe({
        next: this.handlePostResetResponse.bind(this),
        error: this.handlePostResetError.bind(this),
      });
  }

  handlePostResetResponse(data: any) {
    this.messageService.clear();
    this.messageService.add({
      key: 'success',
      severity: 'success',
      summary: 'Success',
      detail: 'Successfully verified',
    });
    setTimeout(() => {
      this.router.navigate(['login']);
    }, 3000);

    this.handleComplete();
  }

  handlePostResetError(err): void {
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
