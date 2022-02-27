import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { getSchema } from "./schema";

async function bootstrap() {
  // build TypeGraphQL executable schema
  const schema = await getSchema();

  // Create GraphQL server
  const server = new ApolloServer({
    schema

  });

  // Start the server
  const { url } = await server.listen(4000);
  console.log(`Server is running, GraphQL Playground available at ${url}`);
}

bootstrap();
