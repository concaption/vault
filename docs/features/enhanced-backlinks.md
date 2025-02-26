---
title: Enhanced Backlinks
tags:
  - component
  - feature
---

# Enhanced Backlinks

Enhanced backlinks provide a more powerful way to view connections between your notes, with features beyond the standard [[backlinks]] component.

## Features

- **Context snippets**: See the text surrounding each link to understand the relationship
- **Category grouping**: Organize backlinks by folder/category
- **Customizable limits**: Control how many backlinks are displayed
- **Better styling**: Improved visual presentation for easier reading

## Usage

Replace the standard Backlinks component in your `quartz.layout.ts` file:

```typescript
import * as Component from "./quartz/components"

// Replace standard backlinks with enhanced backlinks
export const defaultContentPageLayout: PageLayout = {
  // ...other components
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
    Component.EnhancedBacklinks({
      showContext: true,
      groupByCategory: true,
      limit: 15
    }),
  ],
}
```

## Configuration Options

| Option | Description | Default |
| ------ | ----------- | ------- |
| `title` | Custom heading for the backlinks section | "Backlinks" |
| `hideWhenEmpty` | Hide the component when there are no backlinks | `true` |
| `showContext` | Display text surrounding each backlink | `true` |
| `contextCharLimit` | Maximum characters to show in context | `100` |
| `groupByCategory` | Group backlinks by their folder categories | `false` |
| `limit` | Maximum number of backlinks to display | `100` |

## Example

```typescript
Component.EnhancedBacklinks({
  title: "Mentioned in",
  showContext: true,
  contextCharLimit: 150,
  groupByCategory: true,
  limit: 20
})
```

This configuration would:
- Change the heading to "Mentioned in"
- Show context snippets around each link
- Expand the context to 150 characters
- Group backlinks by their containing folders
- Limit the display to 20 backlinks
