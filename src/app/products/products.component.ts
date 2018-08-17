import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  productNames: string[];

  constructor(private router: Router) {
    this.productNames = [];
  }

  ngOnInit() {
  }

  add(foodName: string): void {
    this.productNames.push(foodName);
  }

  delete(name: string) {
    this.productNames = this.productNames.filter(p => p !== name);
  }

  createRecipe(): void {
    this.router.navigate(['recipe/create'], {queryParams: {'ingredients': this.productNames}});
  }
}
