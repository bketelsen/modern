import "reflect-metadata";

import { buildSchema } from "type-graphql";

import { RecipeResolver } from "./recipe-resolver";

export async function getSchema() {
  // build TypeGraphQL executable schema
  const schema = await buildSchema({
    resolvers: [RecipeResolver],
  });

    return schema;

}

