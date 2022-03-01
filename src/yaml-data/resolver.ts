import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { load } from "js-yaml";
import { Query, Resolver, ClassType } from "type-graphql";
import { readdir } from "node:fs";
import { readFile } from "node:fs/promises";
import { promisify } from "node:util";
import { Repository } from "./repository.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dataDirectory = resolve(__dirname, "../../data");

export function createYamlResolver<T extends ClassType>(
  objectTypeCls: T,
  name: string,
  plural: string
) {
  @Resolver()
  class YamlResolver {
    protected typeName: string;
    protected typePlural: string;
    protected dataPath: string;
    protected data: T[];
    protected initialized: boolean;
    protected repository: Repository<T>;

    protected constructor() {
      this.initialized = false;
      this.typeName = name.toLowerCase();
      this.typePlural = plural.toLowerCase();
      this.dataPath = dataDirectory + "/" + this.typePlural;
      this.repository = new Repository<T>(this.dataPath);
    }


    @Query((type) => [objectTypeCls], { name: `get${plural}` })
    public async getAll(): Promise<T[]> {
      const all = await this.repository.getAll();
      return all;
    }
  }

  return YamlResolver;
}
