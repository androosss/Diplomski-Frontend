import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { APIHelper } from 'src/helpers/api.helper';
import { v4 as uuid } from 'uuid';
import { LocalStorageService } from './local.storage.service';

export const sportosAPI = {
  getMatches: '/sportos/pub/v1/matches',
  postMatches: '/sportos/pub/v1/matches',
  patchMatches: '/sportos/pub/v1/matches',
  postEvents: '/sportos/pub/v1/tournaments',
  postUserposts: '/sportos/pub/v1/userposts',
  postTeams: '/sportos/pub/v1/teams',
  patchTeams: '/sportos/pub/v1/teams',
  getTeams: '/sportos/pub/v1/teams',
  tournamentRound: '/sportos/pub/v1/tournament-round',
  patchTournament: '/sportos/pub/v1/tournaments',
  getTournaments: '/sportos/pub/v1/tournaments',
  postPractices: '/sportos/pub/v1/practices',
  getPractices: '/sportos/pub/v1/practices',
  patchPractices: '/sportos/pub/v1/practices',
  getSports: '/sportos/log/v1/sports',
  getCoaches: '/sportos/pub/v1/coaches',
  getUserposts: '/sportos/pub/v1/userposts',
  getPlaces: '/sportos/pub/v1/places',
  getTimes: '/sportos/pub/v1/times',
  getImages: '/sportos/log/v1/assets/images',
  getStats: '/sportos/pub/v1/statistics',
  getReviews: '/sportos/pub/v1/reviews',
  patchReviews: '/sportos/pub/v1/reviews',
};

@Injectable({
  providedIn: 'root',
})
export class APIService {
  constructor(
    private http: HttpClient,
    public localStorageService: LocalStorageService
  ) {}

  /**
   * Function to GET what you want
   *
   * @param url
   */
  private getJson(url: string): Observable<any> {
    // Call the http GET
    console.log('[api.service.ts] getJson(url: string) url= ', url);

    return this.http
      .get(url, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          // 'X-Request-ID': '4fb9a65f-2ba5-4582-990d-5771ace875d9',
          'X-Request-ID': uuid(),
          'Access-Control-Allow-Origin': '*',
        }),
      })
      .pipe(map(APIHelper.extractData), catchError(APIHelper.handleError));
  }

  private postJson(url: string, postData: any): Observable<any> {
    console.log(
      '[api.service.ts] postJson(url: string, postData: any) url= ',
      url
    );
    console.log(
      '[api.service.ts] postJson(url: string, postData: any) postData= ',
      JSON.stringify(postData)
    );
    return this.http
      .post<any>(url, postData, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          // 'X-Request-ID': '4fb9a65f-2ba5-4582-990d-5771ace875d9',
          'X-Request-ID': uuid(),
          'Access-Control-Allow-Origin': '*',
        }),
      })
      .pipe(map(APIHelper.extractData), catchError(APIHelper.handleError));
  }

  public getMatches(params: any): Observable<any> {
    return this.getJson(sportosAPI.getMatches + params);
  }

  public postMatch(body: any) {
    return this.postJson(sportosAPI.postMatches, body);
  }

  public postEvent(body: any) {
    return this.postJson(sportosAPI.postEvents, body);
  }

  public postTeam(body: any) {
    return this.postJson(sportosAPI.postTeams, body);
  }

  public patchTeam(body: any) {
    return this.http.patch(sportosAPI.patchTeams, body);
  }

  public getTeams(params: any) {
    return this.getJson(sportosAPI.getTeams + params);
  }

  public patchTournament(body: any) {
    return this.http.patch(sportosAPI.patchTournament, body);
  }

  public tournamentRound(body: any) {
    return this.postJson(sportosAPI.tournamentRound, body);
  }

  public getTournaments(params: any) {
    return this.getJson(sportosAPI.getTournaments + params);
  }

  public getCoaches(params: any) {
    return this.getJson(sportosAPI.getCoaches + params);
  }

  public postUserPost(form: FormData) {
    return this.http.post(sportosAPI.postUserposts, form);
  }

  public postPractices(body: any) {
    return this.http.post(sportosAPI.postPractices, body);
  }

  public getPractices(params: any) {
    return this.getJson(sportosAPI.getPractices + params);
  }

  public patchPractices(body: any) {
    return this.http.patch(sportosAPI.patchPractices, body);
  }

  public patchMatch(body: any) {
    return this.http.patch(sportosAPI.patchMatches, body);
  }

  public getPlaces(params: any) {
    return this.getJson(sportosAPI.getPlaces + params);
  }
  public getPosts(params: any) {
    return this.getJson(sportosAPI.getUserposts + params);
  }

  public getTimes(params: any) {
    return this.getJson(sportosAPI.getTimes + params);
  }

  public getSports(): Observable<any> {
    return this.getJson(sportosAPI.getSports);
  }

  public getStats(params: any): Observable<any> {
    return this.getJson(sportosAPI.getStats + params);
  }

  public getReviews(params: any): Observable<any> {
    return this.getJson(sportosAPI.getReviews + params);
  }

  public patchReviews(body: any): Observable<any> {
    return this.http.patch(sportosAPI.patchReviews, body);
  }
}
