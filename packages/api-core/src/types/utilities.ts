import type { ObjectToCamel } from "ts-case-convert/lib/caseConvert.js";

import type { paths } from "./openapi-schema.js";

export type CamelCaseKeys<T> = T extends object ? ObjectToCamel<T> : T;

export type CamelCaseData<T> = T extends { data: infer D }
  ? Omit<T, "data"> & { data: CamelCaseKeys<D> }
  : T;

export type HttpMethod =
  | "get"
  | "put"
  | "post"
  | "delete"
  | "options"
  | "head"
  | "patch"
  | "trace";

type MapNeverTo<T, R> = [T] extends [never] ? R : T;

type PathParameters<Method> = MapNeverTo<
  Method extends { parameters: { path: infer P } } ? P : never,
  object
>;

type QueryParameters<Method> = MapNeverTo<
  Method extends { parameters: { query?: infer Q } }
    ? Q extends object
      ? Q
      : never
    : never,
  object
>;

type RequestBodyParameters<Method> = MapNeverTo<
  Method extends {
    requestBody?: {
      content: {
        "application/json": infer B;
      };
    };
  }
    ? B extends object
      ? B
      : never
    : never,
  object
>;

export type PathParams<
  Path extends keyof paths,
  Method extends HttpMethod,
> = CamelCaseKeys<
  PathParameters<paths[Path][Method]> &
    QueryParameters<paths[Path][Method]> &
    RequestBodyParameters<paths[Path][Method]>
>;