import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import { AuthService } from 'src/service/auth.service';
import { AppComponent } from '../../../app/app.component';

@Component({
  selector: 'template-component',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss'],
  animations: [
    trigger('submenu', [
      state(
        'hidden',
        style({
          height: '0px',
        })
      ),
      state(
        'visible',
        style({
          height: '*',
        })
      ),
      transition(
        'visible => hidden',
        animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')
      ),
      transition(
        'hidden => visible',
        animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')
      ),
    ]),
  ],
  encapsulation: ViewEncapsulation.None,
})
export class TemplateComponent implements AfterViewInit, OnDestroy, OnInit {
  public menuInactiveDesktop: boolean = false;

  public dark: boolean = true;

  public inputStyle: string = 'filled';

  public ripple: boolean = true;

  public menuActiveMobile: boolean = false;

  public overlayMenuActive: boolean = false;

  public staticMenuInactive: boolean = false;

  public profileActive: boolean = false;

  public topMenuActive: boolean = false;

  public topMenuLeaving: boolean = false;

  documentClickListener!: () => void;

  menuClick: boolean = false;

  topMenuButtonClick: boolean = false;

  showProgressSpinner: boolean = false;

  constructor(
    public renderer: Renderer2,
    public app: AppComponent,
    public auth: AuthService
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    // hides the overlay menu and top menu if outside is clicked
    this.documentClickListener = this.renderer.listen(
      'body',
      'click',
      (event) => {
        if (!this.isDesktop()) {
          if (!this.menuClick) {
            this.menuActiveMobile = false;
          }

          if (!this.topMenuButtonClick) {
            this.hideTopMenu();
          }
        } else {
          if (!this.menuClick && this.isOverlay()) {
            this.menuInactiveDesktop = true;
          }
          if (!this.menuClick) {
            this.overlayMenuActive = false;
          }
        }

        this.menuClick = false;
        this.topMenuButtonClick = false;
      }
    );
  }

  toggleMenu(event: Event) {
    this.menuClick = true;

    if (this.isDesktop()) {
      if (this.app.menuMode === 'overlay') {
        if (this.menuActiveMobile === true) {
          this.overlayMenuActive = true;
        }

        this.overlayMenuActive = !this.overlayMenuActive;
        this.menuActiveMobile = false;
      } else if (this.app.menuMode === 'static') {
        this.staticMenuInactive = !this.staticMenuInactive;
      }
    } else {
      this.menuActiveMobile = !this.menuActiveMobile;
      this.topMenuActive = false;
    }

    event.preventDefault();
  }

  toggleProfile(event: Event) {
    this.profileActive = !this.profileActive;
    event.preventDefault();
  }

  toggleTopMenu(event: Event) {
    this.topMenuButtonClick = true;
    this.menuActiveMobile = false;

    if (this.topMenuActive) {
      this.hideTopMenu();
    } else {
      this.topMenuActive = true;
    }

    event.preventDefault();
  }

  hideTopMenu() {
    this.topMenuLeaving = true;
    setTimeout(() => {
      this.topMenuActive = false;
      this.topMenuLeaving = false;
    }, 1);
  }

  onMenuClick() {
    this.menuClick = true;
  }

  isStatic() {
    return this.app.menuMode === 'static';
  }

  isOverlay() {
    return this.app.menuMode === 'overlay';
  }

  isDesktop() {
    return window.innerWidth > 1024;
  }

  isMobile() {
    return window.innerWidth < 1024;
  }

  onSearchClick() {
    this.topMenuButtonClick = true;
  }

  ngOnDestroy() {
    if (this.documentClickListener) {
      this.documentClickListener();
    }
  }
}
