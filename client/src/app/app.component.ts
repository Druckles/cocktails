import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <header>
      <h1>Cocktails - Das Lamm</h1>
    </header>

    <body>
      <router-outlet></router-outlet>
    </body>
  `,
  styleUrls: ['app.component.css']
})
export class AppComponent {
}
