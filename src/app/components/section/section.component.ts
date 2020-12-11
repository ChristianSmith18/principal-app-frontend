import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
})
export class SectionComponent {
  @Input() public titleContent = 'Sin título';
  @Input() public description = 'Sin descripción';
  @Input() public imgUrl: string = null;

  constructor() {}
}
