import { Recipe } from "./types/recipe-type";
import { GraphQLSchema, GraphQLInputObjectType, GraphQLObjectType, GraphQLFieldMap } from "graphql";

var path = require('path');
var fs = require('fs');
import { load } from "js-yaml";
import { readFile } from "fs/promises";
import { getSchema } from "./schema";

//joining path of directory
var directoryPath = path.join(__dirname,'..', 'data','recipes');

export async function loadRecipes() {
  var recipes: Recipe[] = [];
  // get the schema so we can introspect the metadata
  // we add as extensions to the recipe type
  const schema = await getSchema();
  const recipeType = schema.getType("Recipe") as GraphQLObjectType;
  console.log("ext.base", recipeType.extensions.base)
  console.log("ext.directory", recipeType.extensions.directory)
  fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    //listing all files using forEach
    files.forEach(async function (file) {
        // Do whatever you want to do with the file
      console.log("file",file)
      const filepath = path.join(directoryPath, file);
      const yaml = load(await readFile(filepath, "utf8")) as Recipe;
      console.log(yaml)
      recipes.push(yaml);
    });
  });
  return recipes;
}

function createRecipe(recipeData: Partial<Recipe>) {
  return Object.assign(new Recipe(), recipeData);
}
