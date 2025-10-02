import { marked } from 'marked'

// Configure marked to use GFM and stable IDs
marked.use({ gfm: true })
marked.setOptions({ headerIds: true, mangle: false })

function splitAbstract(markdown) {
  if (!markdown) return { abstractMd: '', bodyMd: '' }
  const lines = markdown.split(/\r?\n/)
  const startIdx = lines.findIndex((l) => /^#{1,6}\s*Abstract\b/i.test(l.trim()))
  if (startIdx === -1) {
    return { abstractMd: '', bodyMd: markdown }
  }
  let endIdx = lines.length
  for (let i = startIdx + 1; i < lines.length; i++) {
    if (/^#{1,6}\s+/.test(lines[i])) {
      endIdx = i
      break
    }
  }
  const abstractMd = lines.slice(startIdx + 1, endIdx).join('\n').trim()
  const bodyMd = [...lines.slice(0, startIdx), ...lines.slice(endIdx)].join('\n')
  return { abstractMd, bodyMd }
}

export async function renderFulltextFromMarkdown(markdown) {
  const { abstractMd, bodyMd } = splitAbstract(markdown)
  const bodyHtml = marked.parse(bodyMd || markdown)
  const abstractHtml = abstractMd ? marked.parse(abstractMd) : ''

  let html = '<div class="fulltext">\n'
  if (abstractHtml) {
    html += `<div class="abstract">\n<p><strong>Abstract.</strong></p>\n${abstractHtml}\n</div>\n`
  }
  html += `${bodyHtml}\n</div>`
  return html
}

