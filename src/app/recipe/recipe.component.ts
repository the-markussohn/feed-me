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
  nutrientData: NutrientData;

  constructor(private productService: ProductService,
              private router: Router,
              private route: ActivatedRoute) {
    this.ingredients = [];
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      params.getAll('ingredients').map(name => {
        this.productService.getNutrients(name).subscribe(res => {
          this.nutrientData = res;
          this.extractData(this.nutrientData.foods).map(product => this.ingredients.push(product));
        });
      });
    });
  }

  empty(): void {
    if (!this.ingredients || this.ingredients.length === 0) {
      this.home();
    }
  }

  home(): void {
    this.router.navigateByUrl('/products');
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
