import { Component, OnInit } from '@angular/core';
import { TemplateComponent } from './template.component';

@Component({
  selector: 'app-menu',
  template: `
    <div class="layout-menu-container">
      <ul class="layout-menu" role="menu" (keydown)="onKeydown($event)">
        <div *ngIf="type === 'player'">
          <li
            app-menu
            class="layout-menuitem-category"
            *ngFor="let item of playerModel; let i = index"
            [item]="item"
            [index]="i"
            [root]="true"
            role="none"
          >
            <div
              class="layout-menuitem-root-text"
              [attr.aria-label]="item.label"
            >
              {{ item.label }}
            </div>
            <ul role="menu">
              <li
                app-menuitem
                *ngFor="let child of item.items"
                [item]="child"
                [index]="i"
                role="none"
              ></li>
            </ul>
          </li>
        </div>
        <div *ngIf="type === 'coach'">
          <li
            app-menu
            class="layout-menuitem-category"
            *ngFor="let item of coachModel; let i = index"
            [item]="item"
            [index]="i"
            [root]="true"
            role="none"
          >
            <div
              class="layout-menuitem-root-text"
              [attr.aria-label]="item.label"
            >
              {{ item.label }}
            </div>
            <ul role="menu">
              <li
                app-menuitem
                *ngFor="let child of item.items"
                [item]="child"
                [index]="i"
                role="none"
              ></li>
            </ul>
          </li>
        </div>
        <div *ngIf="type === 'place'">
          <li
            app-menu
            class="layout-menuitem-category"
            *ngFor="let item of placeModel; let i = index"
            [item]="item"
            [index]="i"
            [root]="true"
            role="none"
          >
            <div
              class="layout-menuitem-root-text"
              [attr.aria-label]="item.label"
            >
              {{ item.label }}
            </div>
            <ul role="menu">
              <li
                app-menuitem
                *ngFor="let child of item.items"
                [item]="child"
                [index]="i"
                role="none"
              ></li>
            </ul>
          </li>
        </div>
      </ul>
    </div>
  `,
})
export class AppMenuComponent implements OnInit {
  playerModel: any[] = [];
  coachModel: any[] = [];
  placeModel: any[] = [];

  type: string = '';

  constructor(public appMain: TemplateComponent) {}

  ngOnInit() {
    this.type = JSON.parse(localStorage.getItem('token')).type;
    console.log(this.type);
    this.playerModel = [
      {
        items: [
          { label: 'Casual play', routerLink: ['/casual'] },
          { label: 'Profile', routerLink: ['/profile'] },
          { label: 'Feed', routerLink: ['/feed'] },
          { label: 'Tournaments', routerLink: ['/tournaments'] },
          { label: 'Statistics', routerLink: ['/statistics'] },
          { label: 'Practice', routerLink: ['/practice'] },
          { label: 'Teams', routerLink: ['/teams'] },
          { label: 'Reviews', routerLink: ['/reviews'] },
        ],
      },
    ];
    this.coachModel = [
      {
        items: [
          { label: 'Profile', routerLink: ['/profile'] },
          { label: 'Feed', routerLink: ['/feed'] },
          { label: 'Apointments', routerLink: ['/offers'] },
        ],
      },
    ];
    this.placeModel = [
      {
        items: [
          { label: 'Profile', routerLink: ['/profile'] },
          { label: 'Feed', routerLink: ['/feed'] },
          { label: 'Create event', routerLink: ['/create-event'] },
          { label: 'My events', routerLink: ['/events'] },
        ],
      },
    ];
  }

  onKeydown(event: KeyboardEvent) {
    const nodeElement = <HTMLDivElement>event.target;
    if (event.code === 'Enter' || event.code === 'Space') {
      nodeElement.click();
      event.preventDefault();
    }
  }
}
