import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { APIHelper } from 'src/helpers/api.helper';
import { LocalStorageService } from 'src/service/local.storage.service';

export const LOGIN_API = {
  postLogin: '/sportos/log/v1/login',
  patchLogin: '/sportos/log/v1/login', // For refresh token
  postUser: '/sportos/log/v1/user',
  postVerify: '/sportos/log/v1/verify',
  postSocialLogin: '/sportos/log/v1/social-login',
  postSocialUser: '/sportos/log/v1/social-user',
  postLogout: '/sportos/log/v1/logout',
  postSendReset: '/sportos/log/v1/send-reset',
  postResetPassword: '/sportos/log/v1/reset-password',
};

export class LoginService {
  constructor(
    public http: HttpClient,
    public localStorageService: LocalStorageService
  ) {}

  setToken(data: any) {
    localStorage.setItem(
      this.getKeyForLocalStorageForToken(),
      JSON.stringify(data)
    );
  }

  getToken(): any {
    let token;
    try {
      token = JSON.parse(
        localStorage.getItem(this.getKeyForLocalStorageForToken())
      );
    } catch (e) {
      console.log('[login.service.ts] getToken() e= ' + JSON.stringify(e));
    }
    return token;
  }
  getKeyForLocalStorageForToken(): string {
    return 'token';
  }

  getUsername(): string {
    return JSON.parse(
      localStorage.getItem(this.getKeyForLocalStorageForToken())
    ).username;
  }

  getUsernameForShow(): string {
    return localStorage.getItem('forShow');
  }

  getAccessToken(): string {
    return JSON.parse(
      localStorage.getItem(this.getKeyForLocalStorageForToken())
    ).accessToken;
  }

  public createToken(body: any): Observable<any> {
    body = {
      username: body.username,
      password: body.password,
    };
    return this.http
      .post<any>(LOGIN_API.postLogin, body, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Methods':
            'GET, POST, OPTIONS, PUT, DELETE, PATCH',
          'Access-Control-Allow-Headers':
            'language,username,password,channel,agent,ipAddress,domain,Authorization,Accept,Origin,DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type',
        }),
      })
      .pipe(map(APIHelper.extractData), catchError(APIHelper.handleError));
  }

  public createSocialToken(username: string): Observable<any> {
    let body = {
      username: username,
    };
    return this.http
      .post<any>(LOGIN_API.postSocialLogin, body, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Methods':
            'GET, POST, OPTIONS, PUT, DELETE, PATCH',
          'Access-Control-Allow-Headers':
            'language,username,password,channel,agent,ipAddress,domain,Authorization,Accept,Origin,DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type',
        }),
      })
      .pipe(map(APIHelper.extractData), catchError(APIHelper.handleError));
  }

  logout(username: string) {
    let body = {
      username: username,
    };
    this.http
      .post<any>(LOGIN_API.postLogout, body, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Methods':
            'GET, POST, OPTIONS, PUT, DELETE, PATCH',
          'Access-Control-Allow-Headers':
            'language,username,password,channel,agent,ipAddress,domain,Authorization,Accept,Origin,DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type',
        }),
      })
      .pipe(map(APIHelper.extractData), catchError(APIHelper.handleError));
  }

  public createUser(body: any): Observable<any> {
    body = {
      username: body.username,
      password: body.password,
      email: body.email,
      userType: body.userType,
      name: body.name,
      sport: body.sport,
      city: body.city,
    };
    return this.http
      .post<any>(LOGIN_API.postUser, body, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json; charset=utf-8',
        }),
      })
      .pipe(map(APIHelper.extractData), catchError(APIHelper.handleError));
  }

  public createSocialUser(body: any): Observable<any> {
    body = {
      username: body.username,
      email: body.email,
      userType: body.userType,
      name: body.name,
      sport: body.sport,
      city: body.city,
    };
    return this.http
      .post<any>(LOGIN_API.postSocialUser, body, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json; charset=utf-8',
        }),
      })
      .pipe(map(APIHelper.extractData), catchError(APIHelper.handleError));
  }

  verifyUser(token: string) {
    let body = {
      verifyToken: token,
    };
    return this.http
      .post<any>(LOGIN_API.postVerify, body, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Methods':
            'GET, POST, OPTIONS, PUT, DELETE, PATCH',
          'Access-Control-Allow-Headers':
            'language,refreshToken,Authorization,Accept,Origin,DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type',
        }),
      })
      .pipe(map(APIHelper.extractData), catchError(APIHelper.handleError));
  }

  public refreshToken(): Observable<any> {
    let body = {
      username: this.getUsername(),
      accessToken: this.getAccessToken(),
    };
    return this.http
      .put<any>(LOGIN_API.patchLogin, body, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Methods':
            'GET, POST, OPTIONS, PUT, DELETE, PATCH',
          'Access-Control-Allow-Headers':
            'language,refreshToken,Authorization,Accept,Origin,DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type',
          language: 'EN',
        }),
      })
      .pipe(map(APIHelper.extractData), catchError(APIHelper.handleError));
  }

  sendReset(email: string) {
    let body = {
      email: email,
    };
    return this.http
      .post<any>(LOGIN_API.postSendReset, body, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Methods':
            'GET, POST, OPTIONS, PUT, DELETE, PATCH',
          'Access-Control-Allow-Headers':
            'language,refreshToken,Authorization,Accept,Origin,DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type',
          language: 'EN',
        }),
      })
      .pipe(map(APIHelper.extractData), catchError(APIHelper.handleError));
  }

  resetPassword(body: any) {
    body = {
      password: body.password,
      resetToken: body.resetToken,
    };
    return this.http
      .post<any>(LOGIN_API.postResetPassword, body, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Methods':
            'GET, POST, OPTIONS, PUT, DELETE, PATCH',
          'Access-Control-Allow-Headers':
            'language,refreshToken,Authorization,Accept,Origin,DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type',
          language: 'EN',
        }),
      })
      .pipe(map(APIHelper.extractData), catchError(APIHelper.handleError));
  }
}
