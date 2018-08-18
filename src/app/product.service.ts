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
  private ingredientsSource = new Subject<Product>();

  ingredientsCache: Product[];

  ingredientEvent$ = this.ingredientsSource.asObservable();
  productList$ = new Observable<Product>((ob) => {
    console.log('productList$ started');
    if (this.ingredientsCache) {
      this.ingredientsCache.forEach(i => ob.next(i));
    }
    ob.complete();
    console.log('productList$ completed');
  });

  constructor(private http: HttpClient) {
  }

  setIngredients(products: Product[]) {
    this.ingredientsCache = products;
  }

  addIngredient(productName: string): void {
    let products: Product[] = [];
    this.getNutrients(productName).subscribe(
      nutrientData => {
        products = this.extractData(nutrientData.foods);
      },
      catchError(this.handleError('addIngredient')),
      () => {
        products.forEach((product: Product) => {
          this.ingredientsSource.next(product);
          console.log(`added ${product.name}`);
        });
      }
    );
  }

  delete(ingredient: Product | string): void {
    const name = typeof ingredient === 'string' ? ingredient : ingredient.name;
    this.ingredientsCache = this.ingredientsCache.filter(i => i.name !== name);
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

  getNutrients(query: string): Observable<NutrientData> {
    return this.http.post<NutrientData>(this.nutrientApiUrl, {query: query}, httpOptions).pipe(
      tap(_ => console.log(`nutrients data received: ${_.foods.length}`)),
      catchError(this.handleError<NutrientData>('getNutrients', {} as NutrientData))
    );
  }

  clear(): void {
    this.ingredientsCache = [];
  }

  private extractData(foods: Food[]): Product[] {
    return foods.map<Product>((food: Food) => {
      const product = new Product();
      product.name = food.food_name;
      product.calories = this.standard(food.nf_calories, food.serving_weight_grams);
      product.caloriesWeight = 100;
      product.carbs = this.standard(food.nf_total_carbohydrate, food.serving_weight_grams);
      product.protein = this.standard(food.nf_protein, food.serving_weight_grams);
      product.fat = this.standard(food.nf_total_fat, food.serving_weight_grams);
      return product;
    });
  }

  private standard(value: number, weight: number): number {
    return value * 100 / weight;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
