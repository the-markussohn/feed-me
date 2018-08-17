import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ProductService} from '../product.service';
import {Product} from '../product';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy, AfterViewInit {

  products: Product[] = [];

  constructor(private router: Router,
              private productService: ProductService) {
  }

  ngOnInit() {
    this.getProductNames();
  }

  ngOnDestroy() {
    this.productService.productEvent$.unsubscribe();
  }

  ngAfterViewInit() {
    this.productService.productEvent$.subscribe(ingredient => {
      console.log(`productEvent$ ${JSON.stringify(ingredient)}`);
      this.products.push(ingredient);
    });
  }

  getProductNames(): void {
    console.log('init start ' + JSON.stringify(this.products));
    this.productService.getIngredients().subscribe(res => {
      this.products = res;
      console.log(`getIngredients ${JSON.stringify(res)}`);
    });
  }

  add(foodName: string): void {
    this.productService.addProductName(foodName);
  }

  delete(name: string) {
    this.products = this.products.filter(p => p.name !== name);
    this.productService.delete(name).subscribe();
  }

  createRecipe(): void {
    this.router.navigateByUrl('/recipe/create');
  }
}
