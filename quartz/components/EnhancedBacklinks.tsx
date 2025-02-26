import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative } from "../util/path"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import style from "./styles/backlinks.scss"

interface Options {
  title?: string
  hideWhenEmpty?: boolean
  showContext?: boolean
  contextCharLimit?: number
  groupByCategory?: boolean
  limit?: number
}

export default ((opts?: Options) => {
  const EnhancedBacklinks: QuartzComponent = ({ fileData, allFiles, displayClass, cfg }: QuartzComponentProps) => {
    const title = opts?.title ?? i18n(cfg.locale).components.backlinks.title
    const hideWhenEmpty = opts?.hideWhenEmpty ?? true
    const showContext = opts?.showContext ?? true
    const contextCharLimit = opts?.contextCharLimit ?? 100
    const groupByCategory = opts?.groupByCategory ?? false
    const limit = opts?.limit ?? 100

    // Find pages that link to the current page
    const slug = fileData.slug
    const backlinkPages = allFiles.filter((file) => {
      if (!file.links) {
        return false
      }

      return file.links.some((link) => link.slug === slug)
    })

    // Process backlinks with context if needed
    const backlinksWithContext = backlinkPages.map(page => {
      let context = ""
      let containingFolder = page.slug.split("/").slice(0, -1).join("/")
      
      if (showContext && page.content) {
        // Find where the link occurs in the content
        const linkRegex = new RegExp(`\\[\\[.*?\\b${slug.split("/").pop()?.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b.*?\\]\\]`, 'i')
        const match = page.content.match(linkRegex)
        
        if (match && match.index !== undefined) {
          // Extract surrounding context
          const startIndex = Math.max(0, match.index - contextCharLimit / 2)
          const endIndex = Math.min(page.content.length, match.index + match.length + contextCharLimit / 2)
          context = page.content.substring(startIndex, endIndex)
          
          // Add ellipses if truncated
          if (startIndex > 0) context = "..." + context
          if (endIndex < page.content.length) context = context + "..."
        }
      }

      return {
        ...page,
        context,
        category: containingFolder
      }
    })

    // Sort backlinks by category if grouping is enabled
    let processedBacklinks = backlinksWithContext
    if (groupByCategory) {
      processedBacklinks.sort((a, b) => a.category.localeCompare(b.category))
    } else {
      processedBacklinks.sort((a, b) => a.title.localeCompare(b.title))
    }

    // Apply limit
    if (limit > 0) {
      processedBacklinks = processedBacklinks.slice(0, limit)
    }

    if (hideWhenEmpty && processedBacklinks.length === 0) {
      return null
    }

    // Group by category if needed
    let backlinksByCategory: Record<string, typeof processedBacklinks> = {}
    if (groupByCategory) {
      backlinksByCategory = processedBacklinks.reduce((acc, page) => {
        const category = page.category || "Uncategorized"
        if (!acc[category]) {
          acc[category] = []
        }
        acc[category].push(page)
        return acc
      }, {} as Record<string, typeof processedBacklinks>)
    }

    return (
      <div class={classNames(displayClass, "enhanced-backlinks")}>
        <h3>{title}</h3>
        <ul class="backlinks-list">
          {groupByCategory ? (
            Object.entries(backlinksByCategory).map(([category, pages]) => (
              <>
                <li class="backlink-category">{category || 'Uncategorized'}</li>
                {pages.map((page) => (
                  <li class="backlink-item">
                    <a href={resolveRelative(fileData.slug, page.slug)} class="internal">
                      {page.title}
                    </a>
                    {showContext && page.context && (
                      <div class="backlink-context">{page.context}</div>
                    )}
                  </li>
                ))}
              </>
            ))
          ) : (
            processedBacklinks.map((page) => (
              <li class="backlink-item">
                <a href={resolveRelative(fileData.slug, page.slug)} class="internal">
                  {page.title}
                </a>
                {showContext && page.context && (
                  <div class="backlink-context">{page.context}</div>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    )
  }

  EnhancedBacklinks.css = style
  return EnhancedBacklinks
}) satisfies QuartzComponentConstructor
