import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { recipeSchema, registrySchema } from '../src/domain/schema';
import { projectRoot } from './content';

for (const [name, schema] of [['recipe', recipeSchema], ['ingredients', registrySchema]] as const) {
  await writeFile(resolve(projectRoot, `content/${name}.schema.json`), JSON.stringify(zodToJsonSchema(schema, name), null, 2) + '\n');
}
console.log('Editor schemas generated from src/domain/schema.ts. Runtime checks also validate references and publication rules.');
