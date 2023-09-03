import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { APIHelper } from 'src/helpers/api.helper';
import { AuthService } from './auth.service';
import { LocalStorageService } from './local.storage.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(
    public authService: AuthService,
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    public router: Router
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('[token.interceptor.ts] intercept()');

    if (
      new APIHelper(this.http, this.localStorageService).getLogin().getToken()
    ) {
      request = this.addToken(
        request,
        new APIHelper(this.http, this.localStorageService)
          .getLogin()
          .getAccessToken()
      );
    }

    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(request, next);
        } else {
          return throwError(error);
        }
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('[token.interceptor.ts] handle401Error()');
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((token: any) => {
          console.log('[token.interceptor.ts] handle401Error() token= ', token);
          let apiHelper = new APIHelper(this.http, this.localStorageService);
          apiHelper.getLogin().setToken(token);

          this.isRefreshing = false;
          this.refreshTokenSubject.next(apiHelper.getLogin().getAccessToken());
          return next.handle(
            this.addToken(request, apiHelper.getLogin().getAccessToken())
          );
        }),
        catchError((error) => {
          console.log('[token.interceptor.ts] handle401Error() error= ', error);
          this.router.navigate(['/login']);
          return of(false);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((jwt) => {
          return next.handle(this.addToken(request, jwt));
        })
      );
    }
  }
}

export const tokenInterceptor = {
  provide: HTTP_INTERCEPTORS,
  useClass: TokenInterceptor,
  multi: true,
};
