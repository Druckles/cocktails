import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <header class="d-print-none">
      <h1>Cocktails - Das Lamm</h1>
    </header>

    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['app.component.scss']
})
export class AppComponent {
}
