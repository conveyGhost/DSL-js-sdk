import { components } from '../../types/data'
import { getActions } from '../../utils'
import { handleMetadata } from '../../metadata'
import { Theme, themePlain } from './theme'
import {
  Token,
  tokenSeparator,
  tokenText,
  tokenValue,
  join,
  tokenPlatform,
  tokenPost,
  tokenAddr,
  tokenName,
  tokenImage,
  tokenNetwork,
  tokenSocialProfile,
  tokenTime,
  tokenSpace,
} from './token'
import { Activity } from '../../data/client'

export function formatPlain(activity: Activity): string {
  const list = format(activity, themePlain).filter((s) => s !== '')

  const clean: string[] = []
  for (let i = 0; i < list.length; i++) {
    if (list[i] === ' ' && list[i + 1] === ' ') continue
    clean.push(list[i])
  }

  return clean.join('')
}

/**
 * Format an activity into a list of tokens that can be used to custom render the output of a activity, such as CLI output.
 */
export function format<T>(activity: Activity, theme: Theme<T>): T[] {
  const ts = tokenizeActivity(activity)
  return ts.map((t) => theme[t.type](t.content))
}

/**
 * Returns a list of tokens that can be used to custom render the output of a activity, such as CLI output
 * all the symbols in blue color.
 */
export function tokenizeActivity(activity: Activity): Token[] {
  const actions = getActions(activity)

  const ts = actions.reduce((acc, action) => {
    if (acc.length === 0) {
      return tokenizeAction(activity, action)
    }

    return [...acc, tokenSeparator, ...tokenizeAction(activity, action)]
  }, [] as Token[])

  ts.push(tokenSpace, tokenTime(activity.timestamp))

  return ts
}

/**
 * Returns a list of tokens that can be used to custom render the output of an action, such as CLI output
 */
export function tokenizeAction(activity: Activity, action: components['schemas']['Action']): Token[] {
  const owner = activity.owner
  let res = [tokenText('Carried out an activity')]
  handleMetadata(action, {
    'transaction-transfer': (m) => {
      if (owner === action.from) {
        res = join([tokenAddr(action.from), tokenText('sent'), ...tokenValue(m), tokenText('to'), tokenAddr(action.to)])
      } else {
        res = join([
          tokenAddr(action.to),
          tokenText('claimed'),
          ...tokenValue(m),
          tokenText('from'),
          tokenAddr(action.from),
        ])
      }
    },
    'transaction-approval': (m) => {
      if (m.action === 'approve') {
        res = join([
          tokenAddr(action.from),
          tokenText('approved'),
          ...tokenValue(m),
          tokenText('to'),
          tokenAddr(action.to),
        ])
      } else {
        res = join([
          tokenAddr(action.from),
          tokenText('revoked the approval of'),
          ...tokenValue(m),
          tokenText('to'),
          tokenAddr(action.to),
        ])
      }
    },
    'transaction-mint': (m) => {
      res = join([tokenAddr(action.from), tokenText('minted'), ...tokenValue(m)])
    },
    'transaction-burn': (m) => {
      res = join([tokenAddr(action.from), tokenText('burned'), ...tokenValue(m)])
    },
    // todo need to double check the multisig action
    'transaction-multisig': (m) => {
      if (m.action === 'create') {
        res = join([
          tokenText('Created a multisig transaction'),
          tokenText('to'),
          tokenAddr(action.to),
          ...tokenPlatform(activity),
        ])
      } else if (m.action === 'add_owner') {
        res = join([
          tokenText('Added'),
          tokenAddr(m.owner),
          tokenText('to'),
          tokenAddr(m.vault.address),
          ...tokenPlatform(activity),
        ])
      } else if (m.action === 'remove_owner') {
        res = join([
          tokenText('Removed'),
          tokenAddr(m.owner),
          tokenText('from'),
          tokenAddr(m.vault.address),
          ...tokenPlatform(activity),
        ])
      } else if (m.action === 'change_threshold') {
        res = join([tokenText('Changed the threshold of'), tokenAddr(m.vault.address), ...tokenPlatform(activity)])
      } else if (m.action === 'execution') {
        res = join([tokenText('Executed a multisig transaction'), ...tokenPlatform(activity)])
      }
    },
    'transaction-bridge': (m) => {
      let network: Token[] = []
      if (m.source_network && m.source_network.name) {
        network = [
          tokenText('from'),
          tokenNetwork(m.source_network.name),
          tokenText('to'),
          tokenNetwork(m.target_network.name),
        ]
      }
      if (m.action === 'deposit') {
        res = join([tokenText('Deposited'), ...tokenValue(m.token), ...network, ...tokenPlatform(activity)])
      } else {
        res = join([tokenText('Withdrew'), ...tokenValue(m.token), ...network, ...tokenPlatform(activity)])
      }
    },
    'transaction-deploy': (m) => {
      res = join([tokenText('Deployed a contract'), tokenAddr(m.address)])
    },
    // for collectible or nft related action, it will use image_url as the image link
    'collectible-transfer': (m) => {
      res = join([
        tokenAddr(action.from),
        tokenText('transferred'),
        tokenImage(m.image_url),
        tokenName(m.name || m.title || 'NFT'),
        tokenText('to'),
        tokenAddr(action.to),
      ])
    },
    'collectible-approval': (m) => {
      if (m.action === 'approve') {
        res = join([
          tokenText('Approved'),
          tokenImage(m.image_url),
          tokenName(`${m.name} collection`),
          tokenText('to'),
          tokenAddr(action.to),
        ])
      } else {
        res = join([
          tokenText('Revoked the approval of'),
          tokenImage(m.image_url),
          tokenName(`${m.name} collection`),
          tokenText('to'),
          tokenAddr(action.to),
        ])
      }
    },
    'collectible-mint': (m) => {
      res = join([
        tokenAddr(owner),
        tokenText('minted'),
        tokenImage(m.image_url),
        tokenName(m.name || m.title || 'NFT'),
      ])
    },
    'collectible-burn': (m) => {
      res = join([tokenText('Burned'), tokenImage(m.image_url), tokenName(m.name || m.title || 'NFT')])
    },
    'collectible-trade': (m) => {
      if (m.action === 'buy') {
        res = join([
          tokenText('Bought'),
          tokenImage(m.image_url),
          tokenName(m.name || m.title || 'NFT'),
          tokenText('from'),
          tokenAddr(action.from),
          ...tokenPlatform(action),
        ])
      } else {
        res = join([
          tokenText('Sold'),
          tokenImage(m.image_url),
          tokenName(m.name || m.title || 'NFT'),
          tokenText('to'),
          tokenAddr(action.to),
          ...tokenPlatform(action),
        ])
      }
    },
    'collectible-auction': (m) => {
      if (m.action === 'create') {
        res = join([
          tokenText('Created an auction for'),
          tokenImage(m.image_url),
          tokenName(m.name || m.title || 'NFT'),
          ...tokenPlatform(action),
        ])
      } else if (m.action === 'bid') {
        res = join([
          tokenText('Made a bid for'),
          tokenImage(m.image_url),
          tokenName(m.name || m.title || 'NFT'),
          ...tokenPlatform(action),
        ])
      } else if (m.action === 'cancel') {
        res = join([
          tokenText('Canceled an auction for'),
          tokenImage(m.image_url),
          tokenName(m.name || m.title || 'NFT'),
          ...tokenPlatform(action),
        ])
      } else if (m.action === 'update') {
        res = join([
          tokenAddr(owner),
          tokenText('updated an auction for'),
          tokenImage(m.image_url),
          tokenName(m.name || m.title || 'NFT'),
          ...tokenPlatform(action),
        ])
      } else if (m.action === 'finalize') {
        res = join([
          tokenAddr(owner),
          tokenText('won an auction for'),
          tokenImage(m.image_url),
          tokenName(m.name || m.title || 'NFT'),
          ...tokenPlatform(action),
        ])
      } else {
        res = join([
          tokenAddr(owner),
          tokenText('invalidated an auction for'),
          tokenImage(m.image_url),
          tokenName(m.name || m.title || 'NFT'),
          ...tokenPlatform(action),
        ])
      }
    },
    'exchange-swap': (m) => {
      res = join([
        tokenAddr(owner),
        tokenText('swapped'),
        ...tokenValue(m.from),
        tokenText('to'),
        ...tokenValue(m.to),
        ...tokenPlatform(action),
      ])
    },
    'exchange-liquidity': (m) => {
      const tokens = m.tokens.flatMap((t) => join([...tokenValue(t), tokenText(',')])).slice(0, -1)
      if (m.action === 'add') {
        res = join([tokenText('Added'), ...tokens, tokenText('to liquidity'), ...tokenPlatform(action)])
      } else if (m.action === 'remove') {
        res = join([tokenText('Removed'), ...tokens, tokenText('from liquidity'), ...tokenPlatform(action)])
      } else if (m.action === 'collect') {
        res = join([tokenText('Collected'), ...tokens, tokenText('from liquidity'), ...tokenPlatform(action)])
      } else if (m.action === 'borrow') {
        res = join([tokenText('Borrowed'), ...tokens, tokenText('from liquidity'), ...tokenPlatform(action)])
      } else if (m.action === 'repay') {
        res = join([tokenText('Repaid'), ...tokens, tokenText('to liquidity'), ...tokenPlatform(action)])
      } else if (m.action === 'supply') {
        res = join([tokenText('Supplied'), ...tokens, tokenText('to liquidity'), ...tokenPlatform(action)])
      } else if (m.action === 'withdraw') {
        res = join([tokenText('WithDrew'), ...tokens, tokenText('from liquidity'), ...tokenPlatform(action)])
      }
    },
    'exchange-loan': (m) => {
      if (m.action === 'create') {
        res = join([tokenText('Created loan'), ...tokenValue(m.amount), ...tokenPlatform(action)])
      } else if (m.action === 'liquidate') {
        res = join([tokenText('liquidated loan'), ...tokenValue(m.amount), ...tokenPlatform(action)])
      } else if (m.action === 'refinance') {
        res = join([tokenText('Refinanced loan'), ...tokenValue(m.amount), ...tokenPlatform(action)])
      } else if (m.action === 'repay') {
        res = join([tokenText('Repaid loan'), ...tokenValue(m.amount), ...tokenPlatform(action)])
      } else if (m.action === 'seize') {
        res = join([tokenText('Seized loan'), ...tokenValue(m.amount), ...tokenPlatform(action)])
      }
    },
    'donation-donate': (m) => {
      res = join([
        tokenAddr(owner),
        tokenText('donated'),
        tokenImage(m.logo),
        tokenName(m.title || ''),
        ...tokenPlatform(action),
      ])
    },
    'governance-propose': (m) => {
      res = join([tokenAddr(owner), tokenText('proposed for'), tokenName(m.title || ''), ...tokenPlatform(action)])
    },
    'governance-vote': (m) => {
      res = join([
        tokenAddr(owner),
        tokenText('voted for'),
        tokenName(m.proposal?.options?.join(',') || ''),
        ...tokenPlatform(action),
      ])
    },
    'social-post': () => {
      res = join([tokenAddr(owner), tokenText('published a post'), tokenPost(action), ...tokenPlatform(action)])
    },
    'social-comment': () => {
      res = join([tokenAddr(action.to), tokenText('commented'), tokenPost(action), ...tokenPlatform(action)])
    },
    'social-share': () => {
      res = join([tokenAddr(owner), tokenText('shared'), tokenPost(action), ...tokenPlatform(action)])
    },
    'social-mint': () => {
      res = join([tokenAddr(owner), tokenText('minted'), tokenPost(action), ...tokenPlatform(action)])
    },
    'social-follow': (m) => {
      res = join([
        tokenSocialProfile(m.to),
        tokenText('followed'),
        tokenSocialProfile(m.from),
        ...tokenPlatform(action),
      ])
    },
    'social-unfollow': (m) => {
      res = join([
        tokenSocialProfile(m.from),
        tokenText('unfollowed'),
        tokenSocialProfile(m.to),
        ...tokenPlatform(action),
      ])
    },
    'social-revise': () => {
      res = join([tokenText('Revised'), tokenPost(action), ...tokenPlatform(action)])
    },
    'social-profile': (m) => {
      if (m.action === 'create') {
        res = join([tokenText('Created a profile'), ...tokenPlatform(action)])
      } else if (m.action === 'update') {
        res = join([
          tokenText('Updated a profile'),
          tokenImage(m.image_uri),
          tokenName(m.name || m.handle || ''),
          ...tokenPlatform(action),
        ])
      } else if (m.action === 'renew') {
        res = join([
          tokenText('Renewed a profile'),
          tokenImage(m.image_uri),
          tokenName(m.name || m.handle || ''),
          ...tokenPlatform(action),
        ])
      } else if (m.action === 'wrap') {
        res = join([
          tokenText('Wrapped a profile'),
          tokenImage(m.image_uri),
          tokenName(m.name || m.handle || ''),
          ...tokenPlatform(action),
        ])
      } else if (m.action === 'unwrap') {
        res = join([
          tokenText('Unwrapped a profile'),
          tokenImage(m.image_uri),
          tokenName(m.name || m.handle || ''),
          ...tokenPlatform(action),
        ])
      }
    },
    'social-proxy': (m) => {
      if (m.action === 'appoint') {
        res = join([tokenText('Approved a proxy'), ...tokenPlatform(action)])
      } else {
        res = join([tokenText('Removed a proxy'), ...tokenPlatform(action)])
      }
    },
    'social-delete': () => {
      res = join([tokenText('Deleted'), tokenPost(action), ...tokenPlatform(action)])
    },
    'metaverse-transfer': (m) => {
      res = join([
        tokenAddr(owner),
        tokenText('transferred'),
        tokenImage(m.image_url),
        tokenName(m.name || m.title || 'NFT'),
        tokenText('to'),
        tokenAddr(action.to),
      ])
    },
    'metaverse-mint': (m) => {
      res = join([
        tokenAddr(owner),
        tokenText('minted'),
        tokenImage(m.image_url),
        tokenName(m.name || m.title || 'NFT'),
        ...tokenPlatform(action),
      ])
    },
    'metaverse-burn': (m) => {
      res = join([
        tokenAddr(owner),
        tokenText('burned'),
        tokenImage(m.image_url),
        tokenName(m.name || m.title || 'NFT'),
        ...tokenPlatform(action),
      ])
    },
    'metaverse-trade': (m) => {
      if (m.action === 'buy') {
        res = join([
          tokenAddr(owner),
          tokenText('bought'),
          tokenImage(m.image_url),
          tokenName(m.name || m.title || 'NFT'),
          tokenText('from'),
          tokenAddr(action.from),
          ...tokenPlatform(action),
        ])
      } else if (m.action === 'sell') {
        res = join([
          tokenAddr(owner),
          tokenText('sold'),
          tokenImage(m.image_url),
          tokenName(m.name || m.title || 'NFT'),
          tokenText('from'),
          tokenAddr(action.from),
          ...tokenPlatform(action),
        ])
      } else if (m.action === 'list') {
        res = join([
          tokenAddr(owner),
          tokenText('listed'),
          tokenImage(m.image_url),
          tokenName(m.name || m.title || 'NFT'),
          tokenText('from'),
          tokenAddr(action.from),
          ...tokenPlatform(action),
        ])
      }
    },
  })
  return res
}
