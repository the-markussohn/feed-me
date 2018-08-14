import {Component, OnInit} from '@angular/core';
import {ProductService} from '../product.service';
import {Product} from '../product';
import {Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, switchMap} from 'rxjs/operators';
import {ProductData} from '../product-data';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.css']
})
export class ProductSearchComponent implements OnInit {

  products$: Observable<Product[]>;
  private searchTerms = new Subject<string>();

  constructor(private productService: ProductService) {
  }

  ngOnInit() {
    this.products$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.productService.searchProducts(term)),
      map((data: ProductData) => {
        const list: Product[] = [];
        data.common.map( value => {
          const product = new Product();
          console.log(value);
          product.name = value.food_name;
          product.id = value.tag_id;
          list.push(product);
        });
        return list;
      })
    );
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

}
