import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProductSearchComponent} from './product-search/product-search.component';
import {RecipeComponent} from './recipe/recipe.component';

const routes: Routes = [
  {path: '', redirectTo: '/products', pathMatch: 'full'},
  {path: 'products', component: ProductSearchComponent},
  {path: 'recipe/create', component: RecipeComponent}
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)],
  declarations: []
})
export class AppRoutingModule {
}
