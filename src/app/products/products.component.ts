import { Component, OnInit } from '@angular/core';
import {Product} from '../product';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products: Product[];

  constructor() {
  }

  ngOnInit() {
  }

  delete(product: Product) {
    this.products = this.products.filter(p => p !== product);
  }

}
