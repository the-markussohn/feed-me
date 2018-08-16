import {Component, OnInit} from '@angular/core';
import {Product} from '../product';
import {Food, NutrientData} from '../nutrient-data';
import {ProductService} from '../product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products: Product[];
  nutrientData: NutrientData;

  constructor(private productService: ProductService) {
    this.products = [];
  }

  ngOnInit() {
  }

  add(foodName: string): void {
    this.productService.getNutrients(foodName).subscribe(
      data => {
        this.nutrientData = data;
        this.extractData(this.nutrientData.foods).map(product => this.products.push(product));
      }
    );
  }

  delete(product: Product) {
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
