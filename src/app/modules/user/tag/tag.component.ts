import { AfterViewInit, Component, Input } from '@angular/core';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements AfterViewInit {

  @Input() data: number;
  @Input() info: string;

  constructor() { }

  ngAfterViewInit(): void {

    console.log('init tag', this.data, this.info);

  }

}
