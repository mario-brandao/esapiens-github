import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'esapiens-github';
  isRoot: boolean;

  constructor(private router: Router) {
    this.isRoot = this.router.url === '/';
  }

  ngOnInit(): void {
    this.watchRouteChanges();
  }

  watchRouteChanges(): void {
    this.router.events.subscribe((event: any) => {
      if (event.url) {
        this.isRoot = event.url === '/';
      }
    });
  }
}
