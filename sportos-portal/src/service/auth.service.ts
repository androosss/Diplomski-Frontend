import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { APIHelper } from 'src/helpers/api.helper';
import { CodeUtil } from 'src/utils/code.util';
import { LocalStorageService } from './local.storage.service';

@Injectable()
export class AuthService {
  constructor(
    private messageService: MessageService,
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    public router: Router
  ) {}

  public isAuthenticatedMethod(): boolean {
    if (
      CodeUtil.checkIfNullOrUndefined(
        new APIHelper(this.http, this.localStorageService).getLogin().getToken()
      )
    ) {
      return false;
    }
    return true;
  }

  refreshToken() {
    return new APIHelper(this.http, this.localStorageService)
      .getLogin()
      .refreshToken({});
  }
}
