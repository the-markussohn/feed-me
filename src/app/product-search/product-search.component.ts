import {Component, OnInit} from '@angular/core';
import {ProductService} from '../product.service';
import {Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, switchMap} from 'rxjs/operators';
import {ProductData} from '../product-data';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.css']
})
export class ProductSearchComponent implements OnInit {

  productData$: Observable<ProductData>;
  private searchTerms = new Subject<string>();

  constructor(private productService: ProductService) {
  }

  ngOnInit() {
    this.productData$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.productService.searchProducts(term))
    );
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

}
