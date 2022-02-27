import {
  Resolver,
  Query,
  FieldResolver,
  Arg,
  Root,
  Mutation,
  Int,
  ResolverInterface,
} from "type-graphql";

import { Recipe } from "./types/recipe-type";
import { RecipeInput } from "./recipe-input";
import { loadRecipes } from "./recipe-loader";

@Resolver(of => Recipe)
export class RecipeResolver implements ResolverInterface<Recipe> {
     //constructor
     constructor() {
       loadRecipes().then(recipes => {
          this.items = recipes;
        });
   }
  private  items: Recipe[] ;

  @Query(returns => Recipe, { nullable: true })
  async recipe(@Arg("title") title: string): Promise<Recipe | undefined> {
    return await this.items.find(recipe => recipe.title === title);
  }

  @Query(returns => [Recipe], { description: "Get all the recipes from around the world " })
  async recipes(): Promise<Recipe[]> {
    console.log(this.items)
    return await this.items;
  }

  @Mutation(returns => Recipe)
  async addRecipe(@Arg("recipe") recipeInput: RecipeInput): Promise<Recipe> {
    const recipe = Object.assign(new Recipe(), {
      description: recipeInput.description,
      title: recipeInput.title,
      ratings: [],
      creationDate: new Date(),
    });
    await this.items.push(recipe);
    return recipe;
  }

  @FieldResolver()
  ratingsCount(
    @Root() recipe: Recipe,
    @Arg("minRate", type => Int, { defaultValue: 0.0 }) minRate: number,
  ): number {
    return recipe.ratings.filter(rating => rating >= minRate).length;
  }
}
