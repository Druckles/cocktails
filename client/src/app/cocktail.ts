export function getMockCocktails() {
  return [{
    id: "1",
    name: 'Sex on the Beach',
    description: 'Fruity',
    glass: 'tall',
    ingredients: [
      '4 cl vodka',
      '2 cl Malibu'
    ]
  }, {
    id: "2",
    name: 'Mojito',
    description: 'Minty',
    glass: 'short',
    ingredients: [
      '4 cl white rum',
      '3 cl lime juice'
    ]
  }, {
    id: "3",
    name: 'Cosmopolitan',
    description: 'Sex & the City style.',
    glass: 'cocktail',
    ingredients: [
      '4 cl vodka',
      '2 cl triple sec'
    ]
  }]
}

export class Cocktail {
  id: string;
  name: string;
  description: string;
  glass: string;
  ingredients: string[];
  method: string[];
  decoration: string;
  color?: string;
  notes?: string;
}
