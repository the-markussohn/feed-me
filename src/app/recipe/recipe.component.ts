import {Component, OnDestroy, OnInit} from '@angular/core';
import {Product} from '../product';
import {Router} from '@angular/router';
import {ProductService} from '../product.service';
import {Location} from '@angular/common';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  ingredients: Product[];

  constructor(private productService: ProductService,
              private router: Router,
              private location: Location) {
  }

  ngOnInit() {
    this.ingredients = [];
    this.subscription = this.productService.productList$.subscribe(
      product => this.ingredients.push(product),
      (err) => console.error(err),
      () => {
        if (!this.ingredients || this.ingredients.length === 0) {
          this.router.navigateByUrl('/products');
        }
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    console.log('saved');
    this.productService.clear();
    this.router.navigateByUrl('/products');
  }

}
