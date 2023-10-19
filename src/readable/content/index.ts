import { Activity } from '../../data/client.js'
import { handleMetadata } from '../../metadata/index.js'
import { components } from '../../types/data.js'
import { getActions } from '../../utils.js'

export type Content = {
  author_url?: string
  handle?: string
  profile_id?: string
  title?: string
  body?: string
  media?: components['schemas']['Media'][]
}

export type PostContent = Content & {
  target?: Content
}

export function formatContent(activity: Activity) {
  const action = getActions(activity)
  if (action.length > 0) {
    return extractContent(action[0])
  }
  return undefined
}

export function extractContent(action: components['schemas']['Action']): PostContent | undefined {
  let content: PostContent | undefined
  handleMetadata(action, {
    'social-post': (m) => {
      content = extractSocialPost(m)
    },
    'social-comment': (m) => {
      content = extractSocialPost(m)
    },
    'social-mint': (m) => {
      content = extractSocialPost(m)
    },
    'social-share': (m) => {
      content = extractSocialPost(m)
    },
    'social-revise': (m) => {
      content = extractSocialPost(m)
    },
    'social-delete': (m) => {
      content = extractSocialPost(m)
    },
    'governance-propose': (m) => {
      content = extractGovernanceProposal(m)
    },
    'governance-vote': (m) => {
      content = extractGovernanceVote(m)
    },
  })
  return content
}

/**
 * The special case for lens post, which will use the first sentence of the body as the title
 */
export function formatTitle(title?: string, body?: string) {
  if (!title) return title
  title = title.replaceAll('…', '')
  if (body?.startsWith(title)) return undefined
  return title
}

export function checkTargetExist(target?: Content) {
  if (!target) return false
  if (!!target.body || !!target.media || !!target.title) return true
  return false
}

function extractSocialPost(metadata: components['schemas']['SocialPost']): PostContent {
  let target = metadata.target
  target = target
    ? {
        author_url: target.author_url,
        handle: target.handle,
        profile_id: target.profile_id,
        title: formatTitle(target.title, target.body),
        body: target.body,
        media: target.media,
      }
    : undefined
  return {
    author_url: metadata.author_url,
    handle: metadata.handle,
    profile_id: metadata.profile_id,
    title: formatTitle(metadata.title, metadata.body),
    body: metadata.body,
    media: metadata.media,
    target: target,
  }
}

function extractGovernanceProposal(metadata: components['schemas']['GovernanceProposal']) {
  return {
    title: metadata.title,
    body: metadata.body,
  }
}

function extractGovernanceVote(metadata: components['schemas']['GovernanceVote']) {
  return {
    title: metadata.proposal?.title,
    body: metadata.proposal?.body,
  }
}
