import {Component, OnInit} from '@angular/core';
import {Product} from '../product';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Food, NutrientData} from '../nutrient-data';
import {ProductService} from '../product.service';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent implements OnInit {

  ingredients: Product[];
  names: string[];
  nutrientData: NutrientData;

  constructor(private productService: ProductService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.names = params['ingredients'];
    });
    console.log(this.names);
    /*this.route.params.subscribe(params => {
      for (let foodName in params) {
        this.productService.getNutrients(foodName).subscribe(
          data => {
            this.nutrientData = data;
            this.extractData(this.nutrientData.foods).map(product => this.ingredients.push(product));
            console.log(JSON.stringify(this.ingredients));
          }
        );
      }
    });*/
  }

  empty(): void {
    if (!this.ingredients || this.ingredients.length === 0) {
      this.home();
    }
  }

  home(): void {
    this.router.navigateByUrl('');
    console.log('empty list. Redirected');
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
