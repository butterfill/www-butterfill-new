#!/usr/bin/env node
// Ensure public/md has a .md per writing slug, resolving via cite2md <key>
import { readdir, readFile, access, mkdir, copyFile } from 'node:fs/promises'
import { constants as fsConstants } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import matter from 'gray-matter'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const cwd = process.cwd()
const writingDir = path.resolve(cwd, 'src/content/writing')
const targetDir = path.resolve(cwd, 'public/md')

function fileExists(p) {
  return access(p, fsConstants.F_OK).then(() => true).catch(() => false)
}

function parseBibtexKey(bibtexStr) {
  if (typeof bibtexStr !== 'string') return null
  const m = /@\w+\{\s*([^,\s]+)\s*,/m.exec(bibtexStr)
  return m ? m[1] : null
}

function runCite2md(key) {
  const res = spawnSync('cite2md', [key], { encoding: 'utf8' })
  if (res.error) return { ok: false, error: res.error }
  const codeOk = res.status === 0
  const out = (res.stdout || '').trim()
  if (!codeOk || !out) return { ok: false, stdout: out, status: res.status }
  return { ok: true, path: out }
}

function isMarkdownFile(p) {
  return path.extname(p).toLowerCase() === '.md'
}

async function ensureDir(p) {
  await mkdir(p, { recursive: true })
}

async function main() {
  const entries = await readdir(writingDir, { withFileTypes: true })
  const files = entries.filter(e => e.isFile() && e.name.endsWith('.md')).map(e => path.join(writingDir, e.name))

  const already = []
  const copied = []
  const missingBib = []
  const keyParseFail = []
  const notFound = []
  const errors = []
  const missingTargets = []

  for (const file of files) {
    const slug = path.basename(file, '.md')
    const target = path.join(targetDir, `${slug}.md`)
    if (await fileExists(target)) {
      already.push(slug)
      continue
    }
    missingTargets.push(slug)
  }

  if (missingTargets.length) {
    console.log(`[get-md-for-writing] Missing full-text for slugs: ${missingTargets.join(', ')}`)
  } else {
    console.log('[get-md-for-writing] All writing slugs have corresponding public/md files.')
  }

  for (const slug of missingTargets) {
    try {
      const srcPath = path.join(writingDir, `${slug}.md`)
      const raw = await readFile(srcPath, 'utf8')
      const fm = matter(raw)
      const bibtex = fm.data?.bibtex
      if (!bibtex) {
        missingBib.push(slug)
        continue
      }
      const key = parseBibtexKey(bibtex)
      if (!key) {
        keyParseFail.push(slug)
        continue
      }
      const result = runCite2md(key)
      if (!result.ok) {
        notFound.push(slug)
        continue
      }
      const resolvedPath = path.isAbsolute(result.path) ? result.path : path.resolve(cwd, result.path)
      if (!isMarkdownFile(resolvedPath) || !(await fileExists(resolvedPath))) {
        notFound.push(slug)
        continue
      }
      await ensureDir(targetDir)
      const dest = path.join(targetDir, `${slug}.md`)
      await copyFile(resolvedPath, dest)
      copied.push(slug)
      console.log(`[get-md-for-writing] Copied: ${slug} ← ${resolvedPath}`)
    } catch (err) {
      errors.push({ slug, err: String(err?.message || err) })
    }
  }

  const summary = {
    already: already.length,
    copied: copied.length,
    missingBib: missingBib.length,
    keyParseFail: keyParseFail.length,
    notFound: notFound.length,
    errors: errors.length,
    totalWriting: files.length,
  }

  console.log('[get-md-for-writing] Summary:', summary)
  if (already.length) console.log(`[get-md-for-writing] Already present: ${already.join(', ')}`)
  if (copied.length) console.log(`[get-md-for-writing] Copied: ${copied.join(', ')}`)
  if (missingBib.length) console.log(`[get-md-for-writing] Missing bibtex: ${missingBib.join(', ')}`)
  if (keyParseFail.length) console.log(`[get-md-for-writing] Key parse failed: ${keyParseFail.join(', ')}`)
  if (notFound.length) console.log(`[get-md-for-writing] Not found via cite2md: ${notFound.join(', ')}`)
  if (errors.length) console.log(`[get-md-for-writing] Errors: ${errors.map(e => `${e.slug}(${e.err})`).join(', ')}`)

  // Do not fail the build for unresolved items
  return 0
}

main().catch(err => {
  console.error('[get-md-for-writing] Fatal error:', err)
  // Don't fail hard: exit 0 to keep build going, but surface message
  process.exit(0)
})

