import { marked } from 'marked'

// Configure marked
marked.setOptions({
    breaks: true, // Convert \n to <br>
    gfm: true, // GitHub Flavored Markdown
})

export const parseMarkdown = (text) => {
    if (!text) return ''

    // Parse markdown to HTML
    let html = marked.parse(text)

    // Clean up excessive spacing
    html = html.replace(/<p><\/p>/g, '')

    return html
}