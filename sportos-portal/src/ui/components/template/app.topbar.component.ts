import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SocialAuthService } from 'angularx-social-login';
import { MenuItem } from 'primeng/api';
import { APIHelper } from 'src/helpers/api.helper';
import { LocalStorageService } from 'src/service/local.storage.service';
import { TemplateComponent } from './template.component';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent {
  menuItems: MenuItem[] = [];
  username: string;

  constructor(
    public templateComponent: TemplateComponent,
    private socialAuthService: SocialAuthService,
    public localStorageService: LocalStorageService,
    public translateService: TranslateService,
    public router: Router,
    public http: HttpClient
  ) {
    this.username = new APIHelper(this.http, this.localStorageService)
      .getLogin()
      .getUsernameForShow();

    let menuItem: MenuItem = {};
    this.translateService.get('login.logout').subscribe((res: string) => {
      menuItem.label = res;
    });
    menuItem.command = () => {
      try {
        this.socialAuthService.signOut(true);
      } catch {}
      localStorage.removeItem('token');
      localStorage.removeItem('forShow');
      new APIHelper(this.http, this.localStorageService).getLogin().logout();
      this.router.navigate(['/login']);
    };
    this.menuItems.push(menuItem);
  }

  onIconClick() {}
}
