import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../environments/environment';
import {ProductData} from './product-data';

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

  private apiUrl = 'https://trackapi.nutritionix.com/v2/search/instant';

  constructor(private http: HttpClient) { }

  searchProducts(term: string) {
    return this.http.get<ProductData>(this.apiUrl + '?query=' + term, httpOptions);
  }
}
