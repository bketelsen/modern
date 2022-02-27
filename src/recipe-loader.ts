import { Recipe } from "./types/recipe-type";
var path = require('path');
var fs = require('fs');
import { load } from "js-yaml";
import { readFile } from "fs/promises";

//joining path of directory
var directoryPath = path.join(__dirname,'..', 'data','recipes');

export async function loadRecipes() {
  var recipes: Recipe[] = [];

  fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    //listing all files using forEach
    files.forEach(async function (file) {
        // Do whatever you want to do with the file
      const filepath = path.join(directoryPath, file);
      const yaml = load(await readFile(filepath, "utf8")) as Recipe;
      recipes.push(yaml);
    });
  });
  return recipes;
}

function createRecipe(recipeData: Partial<Recipe>) {
  return Object.assign(new Recipe(), recipeData);
}
