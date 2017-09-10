import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <header class="d-print-none">
      <img src="/assets/images/hotel.jpg" />
      <h1>Das Lamm</h1>
      <h3>Cocktails Liste</h3>
    </header>

    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['app.component.scss']
})
export class AppComponent {
}
