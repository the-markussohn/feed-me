import {Component, OnInit} from '@angular/core';
import {ProductService} from '../product.service';
import {Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, switchMap} from 'rxjs/operators';
import {ProductData} from '../product-data';
import {Food, NutrientData} from '../nutrient-data';
import {Product} from '../product';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.css']
})
export class ProductSearchComponent implements OnInit {

  productData$: Observable<ProductData>;
  nutrientData: NutrientData;
  products: Product[];

  private searchTerms = new Subject<string>();

  constructor(private productService: ProductService) {
    this.products = [];
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

  add(foodName: string): void {
    this.productService.getNutrients(foodName).subscribe(
      data => {
        this.nutrientData = data;
        this.extractData(this.nutrientData.foods).map(product => this.products.push(product));
      }
    );
  }

  delete(product: Product): void {
    this.products = this.products.filter(p => p !== product);
  }

  private extractData(foods: Food[]): Product[] {
    return foods.map(food => {
      const product = new Product();
      product.name = food.food_name;
      product.calories = food.nf_calories;
      product.caloriesWeight = food.serving_weight_grams;
      product.carbs = food.nf_total_carbohydrate;
      product.protein = food.nf_protein;
      product.fat = food.nf_protein;
      console.log(`returned ${JSON.stringify(product)}`);
      return product;
    });
  }
}
