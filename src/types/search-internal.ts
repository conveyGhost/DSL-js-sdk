// generated by src/types/generate.ts

import {components as data} from './data-v1'
/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */


export interface paths {
  "/api/nft/v2/searchNftCollection": {
    /** NFT collection搜索 */
    post: operations["searchNftCollectionV2"];
  };
  "/api/Feed/v2/search": {
    /** Feed搜索 */
    post: operations["searchFeedV2"];
  };
  "/api/wiki/search": {
    /** 搜索wiki */
    get: operations["search"];
  };
  "/api/wiki/profile": {
    /** 查询wiki profile */
    get: operations["profile"];
  };
  "/api/search/unifiedSearch": {
    /** 搜索统一API（搜索第一页使用，包含wiki，nft，feed，coin等，减少RPC call） */
    get: operations["unifiedSearch"];
  };
  "/api/search/spellCorrection": {
    /** 纠错 (did-you-mean) */
    get: operations["spellCorrection"];
  };
  "/api/search/fullTextSearch": {
    /** 搜索 */
    get: operations["fullTextSearch"];
  };
  "/api/search/detail": {
    /** 详情 */
    get: operations["detail"];
  };
  "/api/search/autoComplete": {
    /** 自动补全 */
    get: operations["autoComplete"];
  };
  "/api/search/activityRec": {
    /** Activity推荐 */
    get: operations["activityRec"];
  };
  "/api/nft/nftImages": {
    /** NFT图片列表 */
    get: operations["nftImages"];
  };
  "/api/nft/nftImageDetail": {
    /** NFT图片详情 */
    get: operations["nftImageDetail"];
  };
  "/api/nft/autocomplete": {
    /** NFT自动补全 */
    get: operations["autocomplete"];
  };
  "/api/news/today-in-history": {
    /** today in history */
    get: operations["todayInHistory"];
  };
  "/api/dapp/search": {
    /** 搜索dapp */
    get: operations["search_1"];
  };
  "/api/coin/search": {
    /** 币价搜索 */
    get: operations["search_2"];
  };
  "/api/coin/priceChart": {
    /** 走势图 */
    get: operations["priceChart"];
  };
}

export type webhooks = Record<string, any>;

export interface components {
  schemas: {
    CollectionSearchReqDTO: {
      /** @example azuki */
      keyword: string;
      /**
       * Format: int32
       * @example 1
       */
      page: number;
      /**
       * Format: int32
       * @example 12
       */
      size: number;
      /**
       * @example NONE
       * @enum {string}
       */
      sortType?: "NONE" | "_6H_VOLUME_RANK" | "_6H_SALES_RANK" | "_1D_VOLUME_RANK" | "_1D_SALES_RANK" | "_7D_VOLUME_RANK" | "_7D_SALES_RANK" | "_30D_VOLUME_RANK" | "_30D_SALES_RANK" | "_6H_MINT_RANK" | "_1D_MINT_RANK" | "_3D_MINT_RANK" | "_GAS_FEE_1H_RANK" | "GAS_FEE_12H_RANK" | "GAS_FEE_24H_RANK" | "VOLUME_TOTAL_RANK" | "MARKET_CAP_RANK";
      /**
       * @example [
       *   "ALL"
       * ]
       */
      networks?: ("ALL" | "AVAX" | "ETHEREUM" | "ARBITRUM" | "OPTIMISM" | "POLYGON" | "EIP1577" | "BINANCE_SMART_CHAIN" | "ARWEAVE" | "AVALANCHE" | "XDAI" | "ZKSYNC")[];
    };
    CollectionDocDTO: {
      id?: string;
      /** Format: int32 */
      itemsTotal?: number;
      contractAddress?: string;
      network?: string;
      name?: string;
      symbol?: string;
      description?: string;
      standard?: string;
      logoUrl?: string;
      priceSymbol?: string;
      officialUrl?: string;
      officialDiscord?: string;
      officialTwitter?: string;
      officialTelegram?: string;
      nftScanUrl?: string;
      /** Format: double */
      floorPrice?: number;
      top3images?: components["schemas"]["NftImageDTO"][];
    };
    CollectionSearchRespDTO: {
      collections?: components["schemas"]["CollectionDocDTO"][];
      /** Format: int64 */
      total?: number;
    };
    NftCollectionDTO: {
      description?: string;
      contract_name?: string;
      contract_address?: string;
    };
    NftImageDTO: {
      id?: string;
      collection?: components["schemas"]["NftCollectionDTO"];
      tokenId?: string;
      tokenUrl?: string;
      name?: string;
      imageUrl?: string;
      attributes?: string;
      /** Format: date-time */
      timestamp?: string;
      /** Format: double */
      rarityScore?: number;
      prompt?: string;
      standard?: string;
      owner?: string;
      network?: string;
      /** Format: double */
      latestTradePrice?: number;
      /** Format: double */
      mintPrice?: number;
      nftScanUrl?: string;
      latestTradeSymbol?: string;
    };
    FeedSearchFactorDTO: {
      /**
       * Format: float
       * @description >=0, author的match因子
       * @default 2
       * @example 2
       */
      authorMatch?: number;
      /**
       * Format: float
       * @description >=0, owner的match因子
       * @default 2
       * @example 2
       */
      ownerMatch?: number;
      /**
       * Format: float
       * @description >=0, title的match因子
       * @default 2
       * @example 2
       */
      titleMatch?: number;
      /**
       * Format: float
       * @description >=0, body的match因子
       * @default 1
       * @example 1
       */
      bodyMatch?: number;
      /**
       * Format: float
       * @description >=0, title的matchPhrase因子
       * @default 3
       * @example 3
       */
      titleMatchPhrase?: number;
      /**
       * Format: float
       * @description >=0, body的matchPhrase因子
       * @default 1
       * @example 1
       */
      bodyMatchPhrase?: number;
      /**
       * Format: float
       * @description >=0, 不存在的title的match因子
       * @default 1
       * @example 1
       */
      notExistTitleMatch?: number;
      /**
       * Format: float
       * @description >=0, 不存在的title的matchPhrase因子
       * @default 2
       * @example 2
       */
      notExistTitleMatchPhrase?: number;
      /**
       * Format: float
       * @description >=0, 文本长度因子
       * @default 2
       * @example 2
       */
      textLength?: number;
      /**
       * Format: float
       * @description >=0, 语言因子, 依赖query语种
       * @default 2
       * @example 2
       */
      lang?: number;
      /**
       * Format: float
       * @description >=0, 文本质量因子
       * @default 2
       * @example 2
       */
      contentScore?: number;
      /**
       * Format: float
       * @description >=0, 时间因子
       * @default 2
       * @example 2
       */
      time?: number;
    };
    /**
     * @description date range
     * @example null
     */
    FeedSearchReqBetweenDTO: {
      /**
       * Format: int64
       * @description Timestamp, -1 represents non-existence
       * @default -1
       * @example -1
       */
      lte?: number;
      /**
       * Format: int64
       * @description Timestamp, -1 represents non-existence
       * @default -1
       * @example -1
       */
      gte?: number;
    };
    FeedSearchReqDTO: {
      /** @default vitalik */
      keyword: string;
      /**
       * Format: int32
       * @default 1
       * @example 1
       */
      page: number;
      /**
       * Format: int32
       * @default 12
       * @example 12
       */
      size: number;
      /**
       * @example [
       *   "ALL"
       * ]
       */
      platform?: ("ALL" | "MIRROR" | "FARCASTER" | "XLOG" | "CROSSBELL" | "LENS" | "MATTERS" | "MASTODON")[];
      /**
       * @example [
       *   "ALL"
       * ]
       */
      network?: ("ALL" | "EIP1577" | "BINANCE_SMART_CHAIN" | "ARBITRUM" | "ARWEAVE" | "AVALANCHE" | "ETHEREUM" | "OPTIMISM" | "POLYGON" | "XDAI" | "ZKSYNC" | "CROSSBELL" | "AVAX" | "FARCASTER")[];
      /**
       * @default NONE
       * @example NONE
       * @enum {string}
       */
      sort?: "NONE" | "TIMESTAMP_DESC";
      /**
       * @default ALL
       * @example ALL
       * @enum {string}
       */
      lang?: "ALL" | "ENGLISH" | "CHINESE" | "JAPANESE";
      between?: components["schemas"]["FeedSearchReqBetweenDTO"];
      author?: string;
      factor?: components["schemas"]["FeedSearchFactorDTO"];
    };
    FeedRankDocDTO: {
      id?: string;
      transactionHash?: string;
      /** Format: int64 */
      timestamp?: number;
      tag?: string;
      type?: string;
      /** Format: int64 */
      index?: number;
      addressFrom?: string;
      addressTo?: string;
      author?: string;
      network?: string;
      platform?: string;
      relatedUrls?: string[];
      metadata?: data['schemas']['Transfer']['metadata'];
      owner?: string;
      /** Format: float */
      score?: number;
      highlighting?: components["schemas"]["FeedRankDocHighlightingDTO"];
    };
    FeedRankDocHighlightingDTO: {
      title?: string;
      author?: string;
      body?: string;
    };
    FeedSearchNetworkAggDTO: {
      /** @enum {string} */
      network?: "ALL" | "EIP1577" | "BINANCE_SMART_CHAIN" | "ARBITRUM" | "ARWEAVE" | "AVALANCHE" | "ETHEREUM" | "OPTIMISM" | "POLYGON" | "XDAI" | "ZKSYNC" | "CROSSBELL" | "AVAX" | "FARCASTER";
      /** Format: int64 */
      count?: number;
    };
    FeedSearchPlatformAggDTO: {
      /** @enum {string} */
      platform?: "ALL" | "MIRROR" | "FARCASTER" | "XLOG" | "CROSSBELL" | "LENS" | "MATTERS" | "MASTODON";
      /** Format: int64 */
      count?: number;
    };
    FeedSearchRespDTO: {
      /** Format: int32 */
      total?: number;
      feeds?: components["schemas"]["FeedRankDocDTO"][];
      networkAgg?: components["schemas"]["FeedSearchNetworkAggDTO"][];
      platformAgg?: components["schemas"]["FeedSearchPlatformAggDTO"][];
    };
    JSONObject: any;
    WikiActionDTO: {
      tag?: string;
      type?: string;
      platform?: string;
      /** Format: int64 */
      index?: number;
      metadata?: data['schemas']['Transfer']['metadata'];
      address_from?: string;
      address_to?: string;
      related_urls?: string[];
      search_extension?: components["schemas"]["WikiExDTO"];
    };
    WikiDocDTO: {
      id?: string;
      owner?: string;
      /** Format: int64 */
      timestamp?: number;
      tag?: string;
      type?: string;
      network?: string;
      platform?: string;
      actions?: components["schemas"]["WikiActionDTO"][];
      transaction_hash?: string;
    };
    WikiExDTO: {
      /** Format: float */
      score?: number;
    };
    WikiSearchRespDTO: {
      docs?: components["schemas"]["WikiDocDTO"][];
      /** Format: int64 */
      total?: number;
    };
    WikiProfileRespDTO: {
      url?: string;
      /** @enum {string} */
      type?: "UNKNOWN" | "YOUTUBE" | "GITHUB" | "TWITTER" | "EMAIL" | "FACEBOOK" | "INSTAGRAM" | "LINKEDIN" | "REDDIT" | "TELEGRAM" | "COINMARKETCAP" | "COINGECKO" | "DISCORD";
    };
    /** @description 币价模块响应 */
    CoinSearchRespDTO: {
      market?: components["schemas"]["JSONObject"];
      coin_vs_currency?: components["schemas"]["CoinVsCurrencyDTO"];
      coin_vs_coin?: components["schemas"]["CoinVsCoinDTO"];
      price_chart_of_1_day?: components["schemas"]["PriceChartDTO"];
      coin_metadata?: components["schemas"]["JSONObject"];
      similar_coins?: components["schemas"]["JSONObject"][];
    };
    /** @description 币价转换(币与币) */
    CoinVsCoinDTO: {
      coin_id?: string;
      exchange_rate?: components["schemas"]["CoinVsCoinRateDTO"];
    };
    CoinVsCoinRateDTO: {
      /** Format: double */
      usdt?: number;
      /** Format: double */
      usdc?: number;
      /** Format: double */
      eth?: number;
      /** Format: double */
      wbtc?: number;
      /** Format: double */
      dai?: number;
      /** Format: double */
      busd?: number;
      /** Format: double */
      bnb?: number;
      /** Format: double */
      cake?: number;
      /** Format: double */
      btcb?: number;
    };
    /** @description 币价转换(币与法币) */
    CoinVsCurrencyDTO: {
      /** @enum {string} */
      direction?: "COIN_TO_CURRENCY" | "CURRENCY_TO_COIN";
      currency?: string;
      /** Format: int32 */
      num?: number;
      /** Format: double */
      rate?: number;
      coin_id?: string;
    };
    /** @description 1天走势图 */
    PriceChartDTO: {
      ohlc?: Record<string, any>;
    };
    /** @description 项目 */
    ProjectDocDTO: {
      id?: string;
      name?: string;
      cgId?: string;
      symbol?: string;
      twitter?: string;
      telegram?: string;
      git?: string;
      description?: string;
      url?: string;
      /** Format: float */
      score?: number;
    };
    /** @description 统一搜索响应 */
    UnifiedSearchRespDTO: {
      /**
       * Format: int64
       * @description feed总页数
       */
      feedTotalPage?: number;
      /** @description feeds */
      feeds?: components["schemas"]["FeedRankDocDTO"][];
      /**
       * Format: int64
       * @description nft总页数
       */
      nftTotalPage?: number;
      /** @description nfts */
      nfts?: components["schemas"]["CollectionDocDTO"][];
      wiki?: components["schemas"]["WikiDocDTO"];
      project?: components["schemas"]["ProjectDocDTO"];
      coin?: components["schemas"]["CoinSearchRespDTO"];
      /** @description 纠错 */
      spellCorrection?: string[];
    };
    /** @description 搜索响应 */
    FullTextSearchRespDTO: {
      /**
       * Format: int64
       * @description 总页数
       */
      totalPage?: number;
      /** @description docs */
      docs?: components["schemas"]["Rss3DocDTO"][];
      /** @description nft collections */
      collections?: components["schemas"]["Rss3CollectionRecord"][];
      /** @description nft images */
      images?: components["schemas"]["Rss3ImageRecord"][];
      /** @description intention type */
      intentions?: ("PEOPLE" | "NFT" | "TRADE" | "TOKEN" | "DAPP" | "NEWS" | "TIME" | "TREND" | "QUESTION")[];
      coin?: components["schemas"]["CoinSearchRespDTO"];
    };
    JSON: Record<string, any>;
    /** @description nft collections */
    Rss3CollectionRecord: {
      contract?: string;
      network?: string;
      name?: string;
      description?: string;
      symbol?: string;
      logoURL?: string;
      /** Format: double */
      marketCap?: number;
      /** Format: double */
      volume?: number;
      /** Format: double */
      sales?: number;
      /** Format: int32 */
      itemTotal?: number;
      /** Format: int32 */
      ownerTotal?: number;
      /** Format: int32 */
      avgPrice?: number;
      imageListJSON?: components["schemas"]["JSON"];
      attributes?: string;
      propmt?: string;
    };
    /** @description docs */
    Rss3DocDTO: {
      /** @enum {string} */
      docType?: "FEED" | "NFT" | "WIKI" | "FEED_MATTERS" | "PROJECT";
      /** Format: float */
      score?: number;
      doc?: Record<string, any>;
    };
    /** @description nft images */
    Rss3ImageRecord: {
      /** Format: int64 */
      id?: number;
      contractAddress?: string;
      contractName?: string;
      tokenId?: string;
      tokenUrl?: string;
      name?: string;
      imageUrl?: string;
      attributes?: string;
      /** Format: date-time */
      timestamp?: string;
      /** Format: double */
      rarityScore?: number;
      prompt?: string;
      standard?: string;
      owner?: string;
      network?: string;
      /** Format: double */
      latestTradePrice?: number;
      /** Format: double */
      mintPrice?: number;
      nftScanUrl?: string;
      latestTradeSymbol?: string;
    };
    /** @description 自动补全响应 */
    AutoCompleteRespDTO: {
      option?: string;
      /** @enum {string} */
      type?: "DOMAIN" | "NFT" | "FEED" | "WIKI";
      /** @description nft collection logoUrl */
      thumb?: string;
      address?: string;
    };
    NFTImageRespDTO: {
      images?: components["schemas"]["NftImageDTO"][];
      /** Format: int64 */
      total?: number;
    };
    /** @description NFT自动补全响应 */
    NFTAutoCompleteRespDTO: {
      option?: string;
      thumb?: string;
    };
    Event: {
      /** Format: int64 */
      id?: number;
      dayStr?: string;
      monthDay?: string;
      title?: string;
      body?: string;
      catalog?: string;
      link?: string;
      coin?: string;
      images?: string;
    };
    DaapDocDTO: {
      id?: string;
      name?: string;
      icon?: string;
      type?: string;
      url?: string;
      status?: string;
      description?: string;
      /** Format: float */
      score?: number;
      last_edited_time?: string;
      app_entry_url?: string;
      similar_items?: string[];
    };
    DaapDocDTO0: {
      id?: string;
      name?: string;
      icon?: string;
      type?: string;
      url?: string;
      status?: string;
      description?: string;
      /** Format: float */
      score?: number;
      last_edited_time?: string;
      app_entry_url?: string;
      similar_items?: components["schemas"]["DaapDocDTO"][];
    };
    DaapSearchRespDTO: {
      docs?: components["schemas"]["DaapDocDTO0"][];
      /** Format: int64 */
      total?: number;
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}

export type external = Record<string, any>;

export interface operations {

  /** NFT collection搜索 */
  searchNftCollectionV2: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["CollectionSearchReqDTO"];
      };
    };
    responses: {
      /** @description OK */
      200: {
        content: {
          "application/json": components["schemas"]["CollectionSearchRespDTO"];
        };
      };
      /** @description Bad Request */
      400: {
        content: {
          "application/json": Record<string, any>;
        };
      };
    };
  };
  /** Feed搜索 */
  searchFeedV2: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["FeedSearchReqDTO"];
      };
    };
    responses: {
      /** @description OK */
      200: {
        content: {
          "application/json": components["schemas"]["FeedSearchRespDTO"];
        };
      };
      /** @description Bad Request */
      400: {
        content: {
          "application/json": Record<string, any>;
        };
      };
    };
  };
  /** 搜索wiki */
  search: {
    parameters: {
      query: {
        keyword: string;
        page: number;
        size: number;
      };
    };
    responses: {
      /** @description OK */
      200: {
        content: {
          "application/json": components["schemas"]["WikiSearchRespDTO"];
        };
      };
      /** @description Bad Request */
      400: {
        content: {
          "application/json": Record<string, any>;
        };
      };
    };
  };
  /** 查询wiki profile */
  profile: {
    parameters: {
      query: {
        url: string;
      };
    };
    responses: {
      /** @description OK */
      200: {
        content: {
          "application/json": components["schemas"]["WikiProfileRespDTO"][];
        };
      };
      /** @description Bad Request */
      400: {
        content: {
          "application/json": Record<string, any>;
        };
      };
    };
  };
  /** 搜索统一API（搜索第一页使用，包含wiki，nft，feed，coin等，减少RPC call） */
  unifiedSearch: {
    parameters: {
      query: {
        keyword: string;
        pageSize?: number;
        /** @description 客户端语言，window.navigator.language */
        lang?: string;
      };
    };
    responses: {
      /** @description OK */
      200: {
        content: {
          "application/json": components["schemas"]["UnifiedSearchRespDTO"];
        };
      };
      /** @description Bad Request */
      400: {
        content: {
          "application/json": Record<string, any>;
        };
      };
    };
  };
  /** 纠错 (did-you-mean) */
  spellCorrection: {
    parameters: {
      query: {
        keyword: string;
        /** @description 纠错返回数量 */
        count?: number;
        /** @description 补全类型 */
        typeParam?: "ALL" | "DOMAIN" | "FEED" | "NFT" | "WIKI" | "DAPP";
      };
    };
    responses: {
      /** @description OK */
      200: {
        content: {
          "application/json": string[];
        };
      };
      /** @description Bad Request */
      400: {
        content: {
          "application/json": Record<string, any>;
        };
      };
    };
  };
  /** 搜索 */
  fullTextSearch: {
    parameters: {
      query: {
        keyword: string;
        page?: number;
        size?: number;
        docType?: "FEED" | "NFT" | "WIKI" | "COIN" | "PROJECT";
        /** @description 客户端语言，window.navigator.language */
        lang?: string;
      };
    };
    responses: {
      /** @description OK */
      200: {
        content: {
          "application/json": components["schemas"]["FullTextSearchRespDTO"];
        };
      };
      /** @description Bad Request */
      400: {
        content: {
          "application/json": Record<string, any>;
        };
      };
    };
  };
  /** 详情 */
  detail: {
    parameters: {
      query: {
        id: string;
        docType?: "FEED" | "NFT" | "WIKI";
      };
    };
    responses: {
      /** @description OK */
      200: {
        content: {
          "application/json": components["schemas"]["Rss3DocDTO"];
        };
      };
      /** @description Bad Request */
      400: {
        content: {
          "application/json": Record<string, any>;
        };
      };
    };
  };
  /** 自动补全 */
  autoComplete: {
    parameters: {
      query: {
        keyword: string;
        /** @description 自动补全返回数量 */
        count?: number;
        /** @description 补全类型 */
        typeParam?: "ALL" | "DOMAIN" | "FEED" | "NFT" | "WIKI" | "DAPP";
      };
    };
    responses: {
      /** @description OK */
      200: {
        content: {
          "application/json": components["schemas"]["AutoCompleteRespDTO"][];
        };
      };
      /** @description Bad Request */
      400: {
        content: {
          "application/json": Record<string, any>;
        };
      };
    };
  };
  /** Activity推荐 */
  activityRec: {
    parameters: {
      query: {
        keyword: string;
        /** @description 返回数量 */
        count?: number;
      };
    };
    responses: {
      /** @description OK */
      200: {
        content: {
          "application/json": components["schemas"]["AutoCompleteRespDTO"][];
        };
      };
      /** @description Bad Request */
      400: {
        content: {
          "application/json": Record<string, any>;
        };
      };
    };
  };
  /** NFT图片列表 */
  nftImages: {
    parameters: {
      query: {
        contractAddress: string;
        page?: number;
        size?: number;
      };
    };
    responses: {
      /** @description OK */
      200: {
        content: {
          "application/json": components["schemas"]["NFTImageRespDTO"];
        };
      };
      /** @description Bad Request */
      400: {
        content: {
          "application/json": Record<string, any>;
        };
      };
    };
  };
  /** NFT图片详情 */
  nftImageDetail: {
    parameters: {
      query: {
        contractAddress: string;
        network: "ALL" | "AVAX" | "ETHEREUM" | "ARBITRUM" | "OPTIMISM" | "POLYGON" | "EIP1577" | "BINANCE_SMART_CHAIN" | "ARWEAVE" | "AVALANCHE" | "XDAI" | "ZKSYNC";
        tokenId: string;
      };
    };
    responses: {
      /** @description OK */
      200: {
        content: {
          "application/json": components["schemas"]["NftImageDTO"];
        };
      };
      /** @description Bad Request */
      400: {
        content: {
          "application/json": Record<string, any>;
        };
      };
    };
  };
  /** NFT自动补全 */
  autocomplete: {
    parameters: {
      query: {
        keyword: string;
        /** @description 自动补全返回数量 */
        count?: number;
      };
    };
    responses: {
      /** @description OK */
      200: {
        content: {
          "application/json": components["schemas"]["NFTAutoCompleteRespDTO"][];
        };
      };
      /** @description Bad Request */
      400: {
        content: {
          "application/json": Record<string, any>;
        };
      };
    };
  };
  /** today in history */
  todayInHistory: {
    parameters: {
      query?: {
        /** @example 11-11 */
        month_day?: string;
      };
    };
    responses: {
      /** @description OK */
      200: {
        content: {
          "application/json": components["schemas"]["Event"][];
        };
      };
      /** @description Bad Request */
      400: {
        content: {
          "application/json": Record<string, any>;
        };
      };
    };
  };
  /** 搜索dapp */
  search_1: {
    parameters: {
      query: {
        keyword?: string;
        page: number;
        size: number;
      };
    };
    responses: {
      /** @description OK */
      200: {
        content: {
          "application/json": components["schemas"]["DaapSearchRespDTO"];
        };
      };
      /** @description Bad Request */
      400: {
        content: {
          "application/json": Record<string, any>;
        };
      };
    };
  };
  /** 币价搜索 */
  search_2: {
    parameters: {
      query: {
        /** @description keyword */
        keyword: string;
        /** @description 客户端语言，window.navigator.language */
        lang?: string;
      };
    };
    responses: {
      /** @description OK */
      200: {
        content: {
          "application/json": components["schemas"]["CoinSearchRespDTO"];
        };
      };
      /** @description Bad Request */
      400: {
        content: {
          "application/json": Record<string, any>;
        };
      };
    };
  };
  /** 走势图 */
  priceChart: {
    parameters: {
      query: {
        /** @description coinId */
        coinId: string;
        /** @description currency */
        currency: string;
        /** @description days, 1/7/14/30/90/180/365/max */
        days: string;
      };
    };
    responses: {
      /** @description OK */
      200: {
        content: {
          "application/json": components["schemas"]["PriceChartDTO"];
        };
      };
      /** @description Bad Request */
      400: {
        content: {
          "application/json": Record<string, any>;
        };
      };
    };
  };
}
