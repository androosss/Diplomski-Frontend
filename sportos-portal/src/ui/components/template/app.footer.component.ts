import { Component } from '@angular/core';
import { TemplateComponent } from './template.component';

@Component({
  selector: 'app-footer',
  templateUrl: './app.footer.component.html',
})
export class AppFooterComponent {
  constructor(public templateComponent: TemplateComponent) {}
}
