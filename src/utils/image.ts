// Transforms a Google Drive share URL to a direct-view URL.
// Handles /d/FILE_ID/ pattern → https://drive.google.com/uc?export=view&id=FILE_ID
export function resolveImageUrl(url: string): string {
  if (!url) return ''
  const match = url.match(/\/d\/([^/]+)/)
  if (match) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`
  }
  return url
}
