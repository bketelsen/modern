import { load } from "js-yaml";
import { readdir } from "node:fs";
import { readFile } from "node:fs/promises";
import { promisify } from "node:util";
import { join } from "node:path";


export class Repository<T>{
    //field
    private records: Map<string,T>;
    private path: string
    private initialized: boolean = false
    //constructor
    constructor(path: string) {
        this.records = new Map<string,T>();
        this.path = path
    }
    protected async loadData(): Promise<void> {
        const awaitReaddir = promisify(readdir);
        const files = await awaitReaddir(this.path);

        for (const file of files) {
            const filepath = join(this.path, file);
            const yaml: T = load(await readFile(filepath, "utf8")) as T;
            const id = file.replace(".yaml", "");
            yaml["id"] = id;
            this.records.set(id, yaml);
        }
        this.initialized = true;
        return;
    }

    public async getAll(): Promise<T[]> {
        if (this.initialized === false) {
            await this.loadData();
        }
        return Array.from(this.records.values());
    }

    public async getByID(id:string): Promise<T> {
        if (this.initialized === false) {
            await this.loadData();
        }
        return this.records[id];
    }

}
