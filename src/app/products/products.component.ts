import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ProductService} from '../product.service';
import {Product} from '../product';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<Product> = new Subject();

  products: Product[] = [];

  constructor(private router: Router,
              private productService: ProductService) {
  }

  ngOnInit() {
    this.getProductNames();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.unsubscribe();
  }

  getProductNames(): void {
    this.productService.productList$.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(p => this.products.push(p));
    console.log('init start ' + JSON.stringify(this.products));
    this.productService.ingredientEvent$.pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(ingredient => {
      console.log(`productEvent$ ${JSON.stringify(ingredient)}`);
      this.products.push(ingredient);
    });
  }

  add(foodName: string): void {
    this.productService.addIngredient(foodName);
  }

  delete(name: string) {
    this.products = this.products.filter(p => p.name !== name);
    this.productService.delete(name);
  }

  createRecipe(): void {
    this.productService.setIngredients(this.products);
    this.router.navigateByUrl('/recipe/create');
  }
}
