import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';

function mdastText(node) {
  if (!node) return '';
  if (node.type === 'text') return node.value || '';
  if (!node.children) return '';
  return node.children.map(mdastText).join('');
}

function extractAbstractMdast(mdastRoot) {
  const root = mdastRoot && mdastRoot.type === 'root' ? mdastRoot : { type: 'root', children: [] };
  const children = root.children || [];
  let start = -1;
  for (let i = 0; i < children.length; i++) {
    const n = children[i];
    if (n && n.type === 'heading' && n.depth === 1) {
      const txt = (mdastText(n) || '').trim().toLowerCase();
      if (/^abstract\b/.test(txt)) {
        start = i;
        break;
      }
    }
  }
  if (start === -1) {
    return { body: root, abstract: { type: 'root', children: [] }, hasAbstract: false };
  }
  let end = children.length;
  for (let j = start + 1; j < children.length; j++) {
    const n = children[j];
    if (n && n.type === 'heading' && n.depth === 1) {
      end = j;
      break;
    }
  }
  // abstract nodes exclude the heading itself
  const abstractNodes = children.slice(start + 1, end);
  const bodyChildren = children.slice(0, start).concat(children.slice(end));
  return {
    body: { type: 'root', children: bodyChildren },
    abstract: { type: 'root', children: abstractNodes },
    hasAbstract: abstractNodes.length > 0,
  };
}

function toClassList(v) {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') return v.split(/\s+/).filter(Boolean);
  return [];
}

function setClassList(props, list) {
  const uniq = Array.from(new Set(list.filter(Boolean)));
  if (uniq.length) props.className = uniq; else delete props.className;
}

function hasClass(props, cls) {
  return toClassList(props && props.className).includes(cls);
}

function addClass(props, cls) {
  const list = toClassList(props && props.className);
  if (!list.includes(cls)) list.push(cls);
  setClassList(props, list);
}

function extractNumFromRef(href, id) {
  const tryHref = typeof href === 'string' ? href : '';
  const tryId = typeof id === 'string' ? id : '';
  const m1 = tryHref.match(/#fn-?(\d+)/);
  if (m1) return m1[1];
  const m2 = tryId.match(/fnref-?(\d+)/);
  if (m2) return m2[1];
  const m3 = tryId.match(/fn-?(\d+)/);
  if (m3) return m3[1];
  return null;
}

function extractNumFromItemId(id) {
  const s = typeof id === 'string' ? id : '';
  const m = s.match(/fn-?(\d+)/);
  return m ? m[1] : null;
}

function rehypeNormalizeFootnotes() {
  return (tree) => {
    // Simple recursive traversal with parent/index tracking
    function visit(node, parent, index) {
      if (!node || typeof node !== 'object') return;
      if (node.type === 'element') {
        const { tagName, properties = {}, children = [] } = node;

        // Normalize footnote refs
        if (tagName === 'sup' && children && children.length === 1 && children[0].type === 'element' && children[0].tagName === 'a') {
          const a = children[0];
          const n = extractNumFromRef(a.properties && a.properties.href, a.properties && a.properties.id);
          if (n) {
            const anchor = {
              type: 'element',
              tagName: 'a',
              properties: { href: `#fn${n}`, id: `fnref${n}`, className: ['footnote-ref'] },
              children: [{ type: 'element', tagName: 'sup', properties: {}, children: [{ type: 'text', value: String(n) }] }],
            };
            if (parent && Array.isArray(parent.children) && typeof index === 'number') {
              parent.children[index] = anchor;
            }
            // no need to descend into the old sup
            return;
          }
        }

        if (tagName === 'a' && (hasClass(properties, 'footnote-ref') || /#fn-?\d+/.test(properties?.href || ''))) {
          const n = extractNumFromRef(properties.href, properties.id) || '1';
          // Ensure structure: <a class=footnote-ref id=fnrefN href=#fnN><sup>N</sup></a>
          node.properties = { ...properties, href: `#fn${n}`, id: `fnref${n}` };
          addClass(node.properties, 'footnote-ref');
          // Wrap its text in <sup>
          if (!(children.length === 1 && children[0].type === 'element' && children[0].tagName === 'sup')) {
            const sup = { type: 'element', tagName: 'sup', properties: {}, children: [{ type: 'text', value: String(n) }] };
            node.children = [sup];
          }
        }

        // Normalize footnotes section
        if ((tagName === 'section' || tagName === 'div') && (properties.id === 'footnotes' || hasClass(properties, 'footnotes'))) {
          node.properties = { ...properties, id: 'footnotes' };
          addClass(node.properties, 'footnotes');
          addClass(node.properties, 'footnotes-end-of-document');

          // Walk li items under this section
          const ol = children.find((c) => c.type === 'element' && c.tagName === 'ol');
          if (ol && Array.isArray(ol.children)) {
            for (const li of ol.children) {
              if (!(li && li.type === 'element' && li.tagName === 'li')) continue;
              const liProps = li.properties || (li.properties = {});
              const n = extractNumFromItemId(liProps.id) || '1';
              liProps.id = `fn${n}`;

              // Find back link (various emitters use different markers)
              function findBackLink(node) {
                if (!node || typeof node !== 'object') return null;
                if (node.type === 'element' && node.tagName === 'a') {
                  const p = node.properties || {};
                  if (hasClass(p, 'footnote-back') || hasClass(p, 'footnote-backref') || hasClass(p, 'data-footnote-backref') || 'data-footnote-backref' in p) {
                    return node;
                  }
                }
                const kids = node.children || [];
                for (let k = 0; k < kids.length; k++) {
                  const found = findBackLink(kids[k]);
                  if (found) return found;
                }
                return null;
              }
              let backLink = findBackLink(li);
              if (!backLink) {
                // Append a back link
                li.children = (li.children || []).concat([
                  { type: 'text', value: ' ' },
                  { type: 'element', tagName: 'a', properties: { href: `#fnref${n}`, className: ['footnote-back'], 'aria-label': 'Back to content' }, children: [{ type: 'text', value: '↩︎' }] },
                ]);
              } else {
                backLink.properties = { ...(backLink.properties || {}), href: `#fnref${n}`, 'aria-label': 'Back to content' };
                // Normalize classes: ensure footnote-back present; remove legacy variants
                const cls = toClassList(backLink.properties.className)
                  .filter((c) => c !== 'footnote-backref' && c !== 'data-footnote-backref');
                if (!cls.includes('footnote-back')) cls.push('footnote-back');
                setClassList(backLink.properties, cls);
                // Remove legacy attribute flags if present
                if ('data-footnote-backref' in backLink.properties) delete backLink.properties['data-footnote-backref'];
                if ('dataFootnoteBackref' in backLink.properties) delete backLink.properties['dataFootnoteBackref'];
                if ('ariaLabel' in backLink.properties) delete backLink.properties['ariaLabel'];
                // Ensure symbol
                backLink.children = [{ type: 'text', value: '↩︎' }];
              }
            }
          }
        }
      }
      if (node.children && Array.isArray(node.children)) {
        for (let i = 0; i < node.children.length; i++) {
          visit(node.children[i], node, i);
        }
      }
    }

    visit(tree, null, null);
  };
}

async function mdastToHtml(mdastRoot) {
  const processor = unified()
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeKatex)
    .use(rehypeNormalizeFootnotes)
    .use(rehypeStringify);

  const tree = await processor.run(JSON.parse(JSON.stringify(mdastRoot)));
  return String(processor.stringify(tree));
}

function prefixAbstractLabel(html) {
  // Insert "Abstract." at the start of the first paragraph if present
  return html.replace(/<p>/i, '<p><strong>Abstract.</strong> ');
}

export async function renderFulltextFromMarkdown(markdown) {
  const mdProcessor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkPandocInlineSpans);
  const parsed = mdProcessor.parse(markdown);
  const mdast = await mdProcessor.run(parsed);

  const { body, abstract, hasAbstract } = extractAbstractMdast(mdast);

  const [bodyHtml, abstractHtmlRaw] = await Promise.all([
    mdastToHtml(body),
    hasAbstract ? mdastToHtml(abstract) : Promise.resolve(''),
  ]);

  const abstractHtml = hasAbstract && abstractHtmlRaw.trim()
    ? `<div class="abstract">${prefixAbstractLabel(abstractHtmlRaw)}</div>`
    : '';

  const finalHtml = `<div class="fulltext">${abstractHtml}${bodyHtml}</div>`;
  return finalHtml;
}

// remark plugin: transform Pandoc inline attribute spans like {#id .class}
function remarkPandocInlineSpans() {
  return (tree) => {
    const RE_ATTR_ONLY = /\{\s*([^}]+)\s*\}/g;
    const RE_BRACKETED = /\[([^\]]+)\]\{\s*([^}]+)\s*\}/g;
    const BLOCK_SKIP = new Set(['code']);
    const INLINE_SKIP = new Set(['inlineCode', 'link', 'image', 'definition']);

    const escapeHtml = (s) => String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

    function parseAttrList(attr) {
      const tokens = String(attr).trim().split(/\s+/).filter(Boolean);
      let id = null;
      const classes = [];
      for (const t of tokens) {
        if (t.startsWith('#') && t.length > 1) id = t.slice(1);
        else if (t.startsWith('.') && t.length > 1) classes.push(t.slice(1));
      }
      return { id, classes };
    }

    function splitTextToNodes(value) {
      const nodes = [];
      let i = 0;
      const len = value.length;
      while (i < len) {
        RE_BRACKETED.lastIndex = i;
        RE_ATTR_ONLY.lastIndex = i;
        const mb = RE_BRACKETED.exec(value);
        const ma = RE_ATTR_ONLY.exec(value);
        // choose earliest match, prefer bracketed if same index
        let m = null, kind = null;
        if (mb && ma) {
          if (mb.index <= ma.index) { m = mb; kind = 'bracketed'; }
          else { m = ma; kind = 'attr'; }
        } else if (mb) { m = mb; kind = 'bracketed'; }
        else if (ma) { m = ma; kind = 'attr'; }
        if (!m) {
          nodes.push({ type: 'text', value: value.slice(i) });
          break;
        }
        // preceding text
        if (m.index > i) nodes.push({ type: 'text', value: value.slice(i, m.index) });

        if (kind === 'bracketed') {
          const text = m[1];
          const { id, classes } = parseAttrList(m[2]);
          if (!id && classes.length === 0) {
            // no meaningful attrs; keep literal
            nodes.push({ type: 'text', value: m[0] });
          } else {
            const idAttr = id ? ` id=\"${id}\"` : '';
            const classAttr = classes.length ? ` class=\"${classes.join(' ')}\"` : '';
            nodes.push({ type: 'html', value: `<span${idAttr}${classAttr}>${escapeHtml(text)}</span>` });
          }
          i = m.index + m[0].length;
        } else {
          // attr-only
          const { id, classes } = parseAttrList(m[1]);
          if (!id && classes.length === 0) {
            nodes.push({ type: 'text', value: m[0] });
          } else {
            const idAttr = id ? ` id=\"${id}\"` : '';
            const classAttr = classes.length ? ` class=\"${classes.join(' ')}\"` : '';
            nodes.push({ type: 'html', value: `<span${idAttr}${classAttr}></span>` });
          }
          i = m.index + m[0].length;
        }
      }
      return nodes;
    }

    function visit(node) {
      if (!node || typeof node !== 'object') return;
      if (BLOCK_SKIP.has(node.type)) return; // skip code blocks
      const children = node.children;
      if (Array.isArray(children) && !INLINE_SKIP.has(node.type)) {
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          if (child && child.type === 'text' && typeof child.value === 'string' && child.value.includes('{')) {
            const replacement = splitTextToNodes(child.value);
            // splice in place
            children.splice(i, 1, ...replacement);
            i += replacement.length - 1;
            continue;
          }
          visit(child);
        }
      }
    }

    visit(tree);
  };
}
