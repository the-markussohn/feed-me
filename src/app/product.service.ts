import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../environments/environment';
import {ProductData} from './product-data';
import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

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

  constructor(private http: HttpClient) {
  }

  searchProducts(term: string) {
    if (!term.trim()) {
      return of({} as ProductData);
    }

    return this.http.get<ProductData>(this.searchApiUrl + '?query=' + term, httpOptions).pipe(
      tap(_ => console.log(`found results: ${_.common.length}`)),
      catchError(this.handleError<ProductData>('searchProducts', {} as ProductData))
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
