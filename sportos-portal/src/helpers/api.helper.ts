import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { LocalStorageService } from 'src/service/local.storage.service';
import { LoginService } from 'src/service/login.service';

export class APIHelper {
  constructor(
    public http: HttpClient,
    public localStorageService: LocalStorageService
  ) {}

  public getLogin(): any {
    return new LoginService(this.http, this.localStorageService);
  }

  /**
   * Function to handle error when the server return an error
   * TODO typify Error to match backend error structure
   * @param error
   */
  public static handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('[api.service.ts] An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code. The response body may contain clues as to what went wrong,
      console.error(
        `[api.service.ts] Backend returned code ${error.status}, ` +
          `body was: ${JSON.stringify(error)}`
      );
    }
    let ret = '';
    console.log(error);
    if (!!error.error) {
      var foundError = false;
      if (!!error.error.code) {
        foundError = true;
      }
      if (!!error.error.errorMessage) {
        ret = ret + ' ' + error.error.errorMessage;
        foundError = true;
      }
      if (!!error.error.payload) {
        ret = ret + ' ' + JSON.stringify(error.error.payload);
        foundError = true;
      }
      if (!foundError) {
        ret = JSON.stringify(error.error);
      }
    }
    // return an observable with a user-facing error message
    return throwError(ret);
  }

  /**
   * Function to extract the data when the server return some
   *
   * @param res
   */
  public static extractData(res: Response) {
    console.log('[api.service.ts] extractData(res: Response) res= ', res);
    const body = res;
    return body || {};
  }
}
