import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../environments/environment';
import {ProductData} from './product-data';
import {Observable, of, Subject} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {Food, NutrientData} from './nutrient-data';
import {Product} from './product';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'x-app-id': environment.appId,
    'x-app-key': environment.apiKey
  })
};

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private searchApiUrl = 'https://trackapi.nutritionix.com/v2/search/instant';
  private nutrientApiUrl = 'https://trackapi.nutritionix.com/v2/natural/nutrients';
  private productEventSource = new Subject<Product>();

  productNames: string[];
  ingredients: Product[];

  productEvent$ = this.productEventSource;

  constructor(private http: HttpClient) {
  }

  addProductName(productName: string): void {
    if (!this.productNames) {
      this.productNames = [];
    }
    this.productNames.push(productName);
    if (!this.ingredients) {
      this.ingredients = [];
    }
    this.getNutrients(productName).subscribe(
      nutrientData => this.extractData(nutrientData.foods),
      catchError(this.handleError('addProductName')),
      () => {
        this.productEventSource.next(this.ingredients[this.ingredients.length - 1]);
        console.log(`added ${this.ingredients[this.ingredients.length - 1].name}`);
      }
    );
  }

  getIngredients(): Observable<Product[]> {
    if (!this.ingredients) {
      return of([]);
    }
    return of(this.ingredients);
  }

  delete(ingredient: Product | string): Observable<Product[]> {
    const name = typeof ingredient === 'string' ? ingredient : ingredient.name;
    this.productNames = this.productNames.filter(pn => pn !== name);
    this.ingredients = this.ingredients.filter(i => i.name !== name);
    return of(this.ingredients);
  }

  searchProducts(term: string) {
    if (!term.trim()) {
      return of({} as ProductData);
    }

    return this.http.get<ProductData>(this.searchApiUrl + '?query=' + term + '&branded=false', httpOptions).pipe(
      tap(_ => console.log(`found common results: ${_.common.length}`)),
      catchError(this.handleError<ProductData>('searchProducts', {} as ProductData))
    );
  }

  getNutrients(query: string) {
    return this.http.post<NutrientData>(this.nutrientApiUrl, {query: query}, httpOptions).pipe(
      tap(_ => console.log(`nutrients data received: ${_.foods.length}`)),
      catchError(this.handleError<NutrientData>('getNutrients', {} as NutrientData))
    );
  }

  clear(): void {
    this.productNames = [];
    this.ingredients = [];
  }

  private extractData(foods: Food[]): void {
    foods.map(food => {
      const product = new Product();
      product.name = food.food_name;
      product.calories = food.nf_calories;
      product.caloriesWeight = food.serving_weight_grams;
      product.carbs = food.nf_total_carbohydrate;
      product.protein = food.nf_protein;
      product.fat = food.nf_protein;
      this.ingredients.push(product);
    });
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
