import { Component, Input, ViewChild, ElementRef } from '@angular/core';

import { Cocktail } from './cocktail';

@Component({
  selector: 'cocktail-image',
  templateUrl: 'cocktail-image.component.html',
  styleUrls: ['cocktail-image.component.scss']
})
export class CocktailImageComponent {
  @Input() cocktail: Cocktail;

  @ViewChild("cocktailCanvas") canvas: ElementRef;
  @ViewChild("cocktailGlass") glass: ElementRef;

  drawCocktail(): void {
    // Resize to fit glass.
    const canvas = this.canvas.nativeElement;
    canvas.width = this.glass.nativeElement.width;
    canvas.height = this.glass.nativeElement.height;
    let context: CanvasRenderingContext2D = canvas.getContext('2d');

    // Try printing a colour.
    if ('color' in this.cocktail) {
      context.fillStyle = this.cocktail.color;
      context.fillRect(0, 0, 1500, 1500);
    }
  }
}
