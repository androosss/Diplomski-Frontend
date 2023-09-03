import { ChangeDetectorRef, Injector, NgZone } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';

import * as _ from 'underscore';

export abstract class AbstractComponent {
  protected cdRef: ChangeDetectorRef; // This is used to push change detection for ng2 https://github.com/ng-bootstrap/ng-bootstrap/issues/1159
  protected zone: NgZone;

  private markForRefresh: boolean;

  // https://css-tricks.com/debouncing-throttling-explained-examples/
  reloadDOMDebounced = _.debounce(() => this.reloadDOM(), 200, false);

  constructor(
    protected injector: Injector,
    protected dialogService: DialogService
  ) {
    this.zone = this.injector.get(NgZone);
    this.cdRef = this.injector.get(ChangeDetectorRef);
  }

  private reloadDOM() {
    this.markForRefresh = true;
    if (!!this.markForRefresh) {
      this.markForRefresh = false;
      this.zone.run(() => {
        console.log('[abstract.component.ts] reloadDOM() markForCheck()');
        this.cdRef.markForCheck();
      });
    }
  }

  chechIfElementShouldRecieveKeyDownEvent(event: any) {
    if (
      event.srcElement.localName !== 'textarea' &&
      event.srcElement.localName !== 'button' &&
      !event.defaultPrevented
    ) {
      return true;
    }
    return false;
  }
}
