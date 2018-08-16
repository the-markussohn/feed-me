import {Component, OnInit} from '@angular/core';
import {ProductService} from '../product.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  productNames: string[];

  constructor(private productService: ProductService,
              private router: Router) {
    this.productNames = [];
  }

  ngOnInit() {
  }

  add(foodName: string): void {
    this.productNames.push(foodName);
  }

  sendIngredients(): void {
    this.router.navigate(['/recipe/new', {'ingredients': this.productNames}]);
  }

  delete(name: string) {
    this.productNames = this.productNames.filter(p => p !== name);
  }
}
