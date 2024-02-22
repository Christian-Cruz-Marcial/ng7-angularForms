import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { map, tap, take, exhaustMap } from "rxjs";

import { Recipe } from '../recipes/recipe.model'
import { RecipeService } from "../recipes/recipe.service";
import { AuthService } from "../auth/auth.service";

@Injectable({providedIn: 'root'})
export class DataStorageService{
  constructor(
    private http: HttpClient,
    private recipesService: RecipeService,
    private authService: AuthService,
    ) {}

  storeRecipes() {
    const recipes = this.recipesService.getRecipes();
    return this.http.put('https://angular-http-ec98c-default-rtdb.firebaseio.com/recipes.json',
     recipes
     ).subscribe(Response => {
      console.log(Response)
    });
  }

fetchRecipes(){
  return this.http
    .get<Recipe[]>(
      'https://angular-http-ec98c-default-rtdb.firebaseio.com/recipes.json'
    ).pipe(
        map(recipes => {
          return recipes.map(recipe => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : []
            };
          });
        }),
        tap(recipes => {
          this.recipesService.setRecipes(recipes);
        })
    );
  }
}
