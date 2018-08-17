import {Component, OnInit} from '@angular/core';
import {Product} from '../product';
import {Router} from '@angular/router';
import {ProductService} from '../product.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent implements OnInit {

  ingredients: Product[];

  constructor(private productService: ProductService,
              private router: Router,
              private location: Location) {
  }

  ngOnInit() {
    this.productService.getIngredients().subscribe(
      products => this.ingredients = products,
      (err) => console.log(err),
      () => {
        if (!this.ingredients || this.ingredients.length === 0) {
          this.router.navigateByUrl('/products');
        }
      }
    );
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
