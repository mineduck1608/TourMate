export function formatNumber(num: number): string {
    // Split the number into integral and fractional parts
    const [integralPart, fractionalPart] = num.toString().split('.');
    
    // Format the integral part with thousands separators
    const formattedIntegral = integralPart
        .split('')
        .reverse()
        .join('')
        .replace(/(\d{3})(?=\d)/g, '$1.')
        .split('')
        .reverse()
        .join('');
    
    // Combine the parts with the appropriate separators
    return fractionalPart 
        ? `${formattedIntegral},${fractionalPart}` 
        : formattedIntegral;
}

export function extractRawContentFromHTML(html: string, preserveLineBreaks: boolean = true): string {
  // Replace <br> tags with newlines if requested
  if (preserveLineBreaks) {
    html = html.replace(/<br\s*\/?>/gi, '\n');
  }

  // Remove script and style tags with their content
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  html = html.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  // Remove all other HTML tags
  html = html.replace(/<[^>]+>/g, '');

  // Decode HTML entities
  html = html.replace(/&nbsp;/g, ' ');
  html = html.replace(/&amp;/g, '&');
  html = html.replace(/&lt;/g, '<');
  html = html.replace(/&gt;/g, '>');
  html = html.replace(/&quot;/g, '"');
  html = html.replace(/&apos;/g, "'");

  // Replace multiple whitespace characters with a single space
  html = html.replace(/\s+/g, ' ').trim();

  return html;
}