/* eslint-disable @typescript-eslint/no-explicit-any */

import { spawnSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { DEFAULT_DATA_SERVER, DEFAULT_SEARCH_SERVER } from '../constants'

main()

async function main() {
  await generate(
    'data',
    DEFAULT_DATA_SERVER + '/openapi.json',
    (schema) => {
      genMetadataDoc(schema['x-extension']['metadataTypes'])
      return schema
    },
    (schema) => {
      return schema
    },
  )

  await generate(
    'search-external',
    DEFAULT_SEARCH_SERVER + '/v3/api-docs/External API',
    (schema) => {
      return schema
    },
    (schema) => {
      schema = schema
        .replace(/\*\/\*/g, 'application/json')
        .replace(/innerMap\?: \{[\s\S]+?\};/g, '')
        .replace(/Record<string, never>/g, 'Record<string, any>')
        .replace(/empty\?: boolean;/g, '')
        .replace(/JSONObject: {[^{}]+}/g, 'JSONObject: any')
        .replace(/metadata\?: {[^{}]+}/g, "metadata?: data['schemas']['Metadata']")

      return (schema = `import {components as data} from './data'\n${schema}`)
    },
  )

  await generate(
    'search-internal',
    DEFAULT_SEARCH_SERVER + '/v3/api-docs/Internal API',
    (schema) => {
      return schema
    },
    (schema) => {
      schema = schema
        .replace(/\*\/\*/g, 'application/json')
        .replace(/innerMap\?: \{[\s\S]+?\};/g, '')
        .replace(/Record<string, never>/g, 'Record<string, any>')
        .replace(/empty\?: boolean;/g, '')
        .replace(/JSONObject: {[^{}]+}/g, 'JSONObject: any')
        .replace(/metadata\?: {[^{}]+}/g, "metadata?: data['schemas']['Metadata']")

      return (schema = `import {components as data} from './data'\n${schema}`)
    },
  )
}

async function generate(
  name: string,
  url: string,
  jsonFn: null | ((schema: any) => any),
  tsFn: (schema: string) => string,
) {
  let schema = await (await fetch(url, { headers: { Accept: 'application/json' } })).json()
  schema = jsonFn ? jsonFn(schema) : schema
  writeFileSync(`tmp/${name}.json`, JSON.stringify(schema))
  spawnSync('npx', ['--yes', 'openapi-typescript@6.3.9', `tmp/${name}.json`, '--output', `src/types/${name}.ts`], {
    stdio: 'inherit',
  })

  schema = readFileSync(`src/types/${name}.ts`).toString()
  schema = tsFn ? tsFn(schema) : schema

  writeFileSync(`src/types/${name}.ts`, `// generated by src/types/generate.ts\n\n` + schema)
}

function genMetadataDoc(data: any) {
  let doc = `import { components } from './types/data'\n\n`

  const map = {} as any

  data.forEach((t: any) => {
    map[`${t.tag}-${t.type}`] = t
  })

  delete map['exchange-staking']

  doc += 'export const metadataDoc = ' + JSON.stringify(map, null, 2) + '\n'

  doc = doc.replace(/"metadataRef": "#\/components\/schemas\/([^/"]+)"/g, `'ref': {} as components['schemas']['$1']`)

  writeFileSync('src/metadata-doc.ts', doc)
}
