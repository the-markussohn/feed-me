import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../environments/environment';
import {ProductData} from './product-data';
import {Observable, of} from 'rxjs';
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

  constructor(private http: HttpClient) {
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

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
