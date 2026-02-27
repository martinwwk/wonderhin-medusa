/**
 * Transforms localhost image URLs to use the image proxy
 * This is needed because Next.js image optimization doesn't allow private IPs
 * @param imageUrl - The original image URL
 * @returns The proxied URL if it's a localhost URL, otherwise the original URL
 */
export function getProxiedImageUrl(imageUrl: string | undefined | null): string {
  if (!imageUrl) {
    return "/assets/placeholder.png"
  }

  // Check if it's a localhost or 127.0.0.1 URL
  const isLocalhost = 
    imageUrl.includes("localhost:") || 
    imageUrl.includes("127.0.0.1:") ||
    imageUrl.includes("http://localhost") ||
    imageUrl.includes("http://127.0.0.1")

  // In development, proxy localhost images
  if (isLocalhost && process.env.NODE_ENV === "development") {
    return `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`
  }

  return imageUrl
}
