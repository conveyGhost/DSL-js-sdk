import type { FetchResponse, MaybeOptionalInit } from "openapi-fetch";
import { objectToCamel, objectToSnake } from "ts-case-convert";
import type { CamelCasedPropertiesDeep, SetRequired } from "type-fest";

import { type Client, getDefaultClient } from "../client.js";
import type { paths } from "../schema.js";
import type { HttpMethod, PathParams } from "../types/utilities.js";

type MarkRequired<T> = {
  [P in keyof T]-?: Exclude<T[P], undefined>;
};

type DefaultFetchInit<
  Path extends keyof paths,
  Method extends HttpMethod,
> = MaybeOptionalInit<MarkRequired<paths[Path]>, Method>;

type CreateRequestResult<
  Path extends keyof paths,
  Method extends HttpMethod,
  FetchInit extends DefaultFetchInit<Path, Method>,
> = CamelCasedPropertiesDeep<
  Required<
    FetchResponse<paths[Path][Method], FetchInit, `${string}/${string}`>
  >["data"]
>;

function buildRequest<Path extends keyof paths, Method extends HttpMethod>(
  path: Path,
  method: Method,
) {
  const _request = async <
    Result,
    FetchInit extends DefaultFetchInit<Path, Method>,
  >(
    client: Client,
    init?: FetchInit | null,
    mapResult?: (data: CreateRequestResult<Path, Method, FetchInit>) => Result,
  ): Promise<Result> => {
    // biome-ignore lint/suspicious/noExplicitAny: Too complex to type
    const { data, error } = await (client as any)[
      method.toUpperCase() as Uppercase<Method>
    ](path, init);

    if (error || !data) {
      throw new Error(
        [
          "Request failed:",
          `path: ${path}`,
          `error: ${error}`,
          `data: ${data}`,
        ].join("\n  "),
      );
    }

    const result = objectToCamel(data) as CreateRequestResult<
      Path,
      Method,
      FetchInit
    >;

    return (mapResult?.(result) ?? result) as Result;
  };

  return {
    withParams<
      FetchInit extends DefaultFetchInit<Path, Method>,
      Params = PathParams<Path, Method>,
      Result = CreateRequestResult<Path, Method, FetchInit>,
    >(
      getInit: (params: Params) => FetchInit,
      mapResult?: (res: CreateRequestResult<Path, Method, FetchInit>) => Result,
    ) {
      return async (
        params: Params,
        init?: Omit<DefaultFetchInit<Path, Method>, "params"> | null,
        client: Client = getDefaultClient(),
      ): Promise<Result> =>
        _request(client, { ...getInit(params), ...init }, mapResult);
    },

    withoutParams<
      FetchInit extends DefaultFetchInit<Path, Method>,
      Result = CreateRequestResult<Path, Method, FetchInit>,
    >(
      mapResult?: (res: CreateRequestResult<Path, Method, FetchInit>) => Result,
    ) {
      return async (
        init?: FetchInit | null,
        client: Client = getDefaultClient(),
      ) => _request(client, init, mapResult);
    },
  };
}

// biome-ignore lint/suspicious/noExplicitAny: Need any here
type RequestParams<T extends (...args: any) => any> =
  Parameters<T>[2] extends undefined ? never : Parameters<T>[0];

// biome-ignore lint/suspicious/noExplicitAny: Need any here
type RequestResult<T extends (...args: any) => Promise<any>> = Exclude<
  Awaited<ReturnType<T>>,
  undefined
>;

export type GetActivityParams = RequestParams<typeof getActivity>;
export type GetActivityResult = RequestResult<typeof getActivity>;
export const getActivity = buildRequest(
  "/decentralized/tx/{id}",
  "get",
).withParams(({ id, ...query }) => ({
  params: objectToSnake({ path: { id }, query: query }),
}));

export type GetActivitiesParams = RequestParams<typeof getActivities>;
export type GetActivitiesResult = RequestResult<typeof getActivities>;
export const getActivities = buildRequest(
  "/decentralized/{account}",
  "get",
).withParams(
  ({ account, ...query }) => ({
    params: objectToSnake({ path: { account }, query: query }),
  }),
  ({ data, meta }) => ({
    data,
    cursor: meta?.cursor,
  }),
);

export type GetActivitiesByAccountsParams = SetRequired<
  Partial<PathParams<"/decentralized/accounts", "post">>,
  "accounts"
>;
export type GetActivitiesByAccountsResult = RequestResult<
  typeof getActivitiesByAccounts
>;
export const getActivitiesByAccounts = buildRequest(
  "/decentralized/accounts",
  "post",
).withParams(
  (body: GetActivitiesByAccountsParams) => ({
    body: objectToSnake({
      limit: 20,
      actionLimit: 10,
      ...body,
    }),
  }),
  ({ data, meta }) => ({
    data,
    cursor: meta?.cursor,
  }),
);

export type GetRSSActivityParams = RequestParams<typeof getRSSActivity>;
export type GetRSSActivityResult = RequestResult<typeof getRSSActivity>;
export const getRSSActivity = buildRequest("/rss/{path}", "get").withParams(
  (path) => ({
    params: objectToSnake({ path }),
  }),
  ({ data, meta }) => ({
    data,
    cursor: meta?.cursor,
  }),
);

export type GetNetworkActivityParams = RequestParams<typeof getNetworkActivity>;
export type GetNetworkActivityResult = RequestResult<typeof getNetworkActivity>;
export const getNetworkActivity = buildRequest(
  "/decentralized/network/{network}",
  "get",
).withParams(
  (path) => ({
    params: objectToSnake({ path }),
  }),
  ({ data, meta }) => ({
    data,
    cursor: meta?.cursor,
  }),
);

export type GetPlatformActivityParams = RequestParams<
  typeof getPlatformActivity
>;
export type GetPlatformActivityResult = RequestResult<
  typeof getPlatformActivity
>;
export const getPlatformActivity = buildRequest(
  "/decentralized/platform/{platform}",
  "get",
).withParams(
  (path) => ({
    params: objectToSnake({ path }),
  }),
  ({ data, meta }) => ({
    data,
    cursor: meta?.cursor,
  }),
);

export type GetBridgingTransactionsParams = RequestParams<
  typeof getBridgingTransactions
>;
export type GetBridgingTransactionsResult = RequestResult<
  typeof getBridgingTransactions
>;
export const getBridgingTransactions = buildRequest(
  "/nta/bridgings/transactions",
  "get",
).withParams((query) => ({
  params: objectToSnake({ query }),
}));

export type GetBridgingTransactionParams = RequestParams<
  typeof getBridgingTransaction
>;
export type GetBridgingTransactionResult = RequestResult<
  typeof getBridgingTransaction
>;
export const getBridgingTransaction = buildRequest(
  "/nta/bridgings/transactions/{transaction_hash}",
  "get",
).withParams((path) => ({
  params: objectToSnake({ path }),
}));

export type GetStakingTransactionsParams = RequestParams<
  typeof getStakingTransactions
>;
export type GetStakingTransactionsResult = RequestResult<
  typeof getStakingTransactions
>;
export const getStakingTransactions = buildRequest(
  "/nta/stakings/transactions",
  "get",
).withParams((query) => ({
  params: objectToSnake({ query }),
}));

export type GetStakingTransactionParams = RequestParams<
  typeof getStakingTransaction
>;
export type GetStakingTransactionResult = RequestResult<
  typeof getStakingTransaction
>;
export const getStakingTransaction = buildRequest(
  "/nta/stakings/transactions/{transaction_hash}",
  "get",
).withParams((path) => ({
  params: objectToSnake({ path }),
}));

export type GetStakingsParams = RequestParams<typeof getStakings>;
export type GetStakingsResult = RequestResult<typeof getStakings>;
export const getStakings = buildRequest(
  "/nta/stakings/stakings",
  "get",
).withParams((query) => ({
  params: objectToSnake({ query }),
}));

export type GetStakingProfitParams = RequestParams<typeof getStakingProfit>;
export type GetStakingProfitResult = RequestResult<typeof getStakingProfit>;
export const getStakingProfit = buildRequest(
  "/nta/stakings/{staker_address}/profit",
  "get",
).withParams((path) => ({
  params: objectToSnake({ path }),
}));

export type GetChipsParams = RequestParams<typeof getChips>;
export type GetChipsResult = RequestResult<typeof getChips>;
export const getChips = buildRequest("/nta/chips", "get").withParams(
  (query) => ({
    params: objectToSnake({ query }),
  }),
);

export type GetChipParams = RequestParams<typeof getChip>;
export type GetChipResult = RequestResult<typeof getChip>;
export const getChip = buildRequest("/nta/chips/{chip_id}", "get").withParams(
  (path) => ({
    params: objectToSnake({ path }),
  }),
);

export type GetChipSvgParams = RequestParams<typeof getChipSvg>;
export type GetChipSvgResult = RequestResult<typeof getChipSvg>;
export const getChipSvgURL = (
  params: GetChipSvgParams,
  client: Client = getDefaultClient(),
) => new URL(`/nta/chips/${params.chipId}/image.svg`, client.baseUrl);
export const getChipSvgSrc = (
  params: GetChipSvgParams,
  client: Client = getDefaultClient(),
) => getChipSvgURL(params, client).href;
export const getChipSvg = buildRequest(
  "/nta/chips/{chip_id}/image.svg",
  "get",
).withParams((path) => ({
  params: objectToSnake({ path }),
}));

export type GetNodeCountSnapshotParams = RequestParams<
  typeof getNodeCountSnapshot
>;
export type GetNodeCountSnapshotResult = RequestResult<
  typeof getNodeCountSnapshot
>;
export const getNodeCountSnapshot = buildRequest(
  "/nta/snapshots/nodes/count",
  "get",
).withoutParams();

export type GetStakerCountSnapshotParams = RequestParams<
  typeof getStakerCountSnapshot
>;
export type GetStakerCountSnapshotResult = RequestResult<
  typeof getStakerCountSnapshot
>;
export const getStakerCountSnapshot = buildRequest(
  "/nta/snapshots/stakers/count",
  "get",
).withoutParams();

export type GetStakerProfitSnapshotParams = RequestParams<
  typeof getStakerProfitSnapshot
>;
export type GetStakerProfitSnapshotResult = RequestResult<
  typeof getStakerProfitSnapshot
>;
export const getStakerProfitSnapshot = buildRequest(
  "/nta/snapshots/stakers/profit",
  "get",
).withParams((query) => ({
  params: objectToSnake({ query }),
}));

export type GetStakerParams = RequestParams<typeof getStaker>;
export type GetStakerResult = RequestResult<typeof getStaker>;
export const getStaker = buildRequest(
  "/nta/stakers/{staker_address}",
  "get",
).withParams((path) => ({
  params: objectToSnake({ path }),
}));

export type GetOperationProfitSnapshotParams = RequestParams<
  typeof getOperationProfitSnapshot
>;
export type GetOperationProfitSnapshotResult = RequestResult<
  typeof getOperationProfitSnapshot
>;
export const getOperationProfitSnapshot = buildRequest(
  "/nta/snapshots/nodes/operation/profit",
  "get",
).withParams((query) => ({
  params: objectToSnake({ query }),
}));

export type GetEpochsApySnapshotParams = RequestParams<
  typeof getEpochsApySnapshot
>;
export type GetEpochsApySnapshotResult = RequestResult<
  typeof getEpochsApySnapshot
>;
export const getEpochsApySnapshot = buildRequest(
  "/nta/snapshots/epochs/apy",
  "get",
).withoutParams();

export type GetAllNodesParams = RequestParams<typeof getAllNodes>;
export type GetAllNodesResult = RequestResult<typeof getAllNodes>;
export const getAllNodes = buildRequest("/nta/nodes", "get").withParams(
  (query) => ({
    params: objectToSnake({ query }),
  }),
);

export type GetNodeParams = RequestParams<typeof getNode>;
export type GetNodeResult = RequestResult<typeof getNode>;
export const getNode = buildRequest("/nta/nodes/{address}", "get").withParams(
  (path) => ({
    params: objectToSnake({ path }),
  }),
);

export type GetNodeAvatarSvgParams = RequestParams<typeof getNodeAvatarSvg>;
export type GetNodeAvatarSvgResult = RequestResult<typeof getNodeAvatarSvg>;
export const getNodeAvatarSvgURL = (
  params: GetNodeAvatarSvgParams,
  client: Client = getDefaultClient(),
) => new URL(`/nta/nodes/${params.address}/avatar.svg`, client.baseUrl);
export const getNodeAvatarSvgSrc = (
  params: GetNodeAvatarSvgParams,
  client: Client = getDefaultClient(),
) => getNodeAvatarSvgURL(params, client).href;
export const getNodeAvatarSvg = buildRequest(
  "/nta/nodes/{address}/avatar.svg",
  "get",
).withParams((path) => ({
  params: objectToSnake({ path }),
}));

export type GetNodeEventsParams = RequestParams<typeof getNodeEvents>;
export type GetNodeEventsResult = RequestResult<typeof getNodeEvents>;
export const getNodeEvents = buildRequest(
  "/nta/nodes/{address}/events",
  "get",
).withParams(({ address, ...query }) => ({
  params: objectToSnake({ path: { address }, query }),
}));

export type GetNodeOperationProfitParams = RequestParams<
  typeof getNodeOperationProfit
>;
export type GetNodeOperationProfitResult = RequestResult<
  typeof getNodeOperationProfit
>;
export const getNodeOperationProfit = buildRequest(
  "/nta/nodes/{address}/operation/profit",
  "get",
).withParams((path) => ({
  params: objectToSnake({ path }),
}));

export type GetEpochsParams = RequestParams<typeof getEpochs>;
export type GetEpochsResult = RequestResult<typeof getEpochs>;
export const getEpochs = buildRequest("/nta/epochs", "get").withParams(
  (query) => ({
    params: objectToSnake({ query }),
  }),
);

export type GetEpochParams = RequestParams<typeof getEpoch>;
export type GetEpochResult = RequestResult<typeof getEpoch>;
export const getEpoch = buildRequest(
  "/nta/epochs/{epoch_id}",
  "get",
).withParams((path) => ({
  params: objectToSnake({ path }),
}));

export type GetEpochTransactionParams = RequestParams<
  typeof getEpochTransaction
>;
export type GetEpochTransactionResult = RequestResult<
  typeof getEpochTransaction
>;
export const getEpochTransaction = buildRequest(
  "/nta/epochs/distributions/{transaction_hash}",
  "get",
).withParams((path) => ({
  params: objectToSnake({ path }),
}));

export type GetNodeRewardsParams = RequestParams<typeof getNodeRewards>;
export type GetNodeRewardsResult = RequestResult<typeof getNodeRewards>;
export const getNodeRewards = buildRequest(
  "/nta/epochs/{address}/rewards",
  "get",
).withParams(({ address, ...query }) => ({
  params: objectToSnake({ path: { address }, query }),
}));

export type GetAverageEpochsApyParams = RequestParams<
  typeof getAverageEpochsApy
>;
export type GetAverageEpochsApyResult = RequestResult<
  typeof getAverageEpochsApy
>;
export const getAverageEpochsApy = buildRequest(
  "/nta/epochs/apy",
  "get",
).withoutParams();

export type GetCompatibleNetworksParams = RequestParams<
  typeof getCompatibleNetworks
>;
export type GetCompatibleNetworksResult = RequestResult<
  typeof getCompatibleNetworks
>;
export const getCompatibleNetworks = buildRequest(
  "/nta/networks",
  "get",
).withoutParams();

export type GetAvailableWorkersParams = RequestParams<
  typeof getAvailableWorkers
>;
export type GetAvailableWorkersResult = RequestResult<
  typeof getAvailableWorkers
>;
export const getAvailableWorkers = buildRequest(
  "/nta/networks/{network_name}/list_workers",
  "get",
).withParams((path) => ({
  params: objectToSnake({ path }),
}));

export type GetWorkerConfigParams = RequestParams<typeof getWorkerConfig>;
export type GetWorkerConfigResult = RequestResult<typeof getWorkerConfig>;
export const getWorkerConfig = buildRequest(
  "/nta/networks/{network_name}/workers/{worker_name}",
  "get",
).withParams((path) => ({
  params: objectToSnake({ path }),
}));
