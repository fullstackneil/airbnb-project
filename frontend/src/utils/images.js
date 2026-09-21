const CLOUDINARY_UPLOAD = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.*)$/;

// Ask Cloudinary for a resized, auto-format/quality copy of an image so pages
// don't download multi-megabyte originals for small thumbnails. URLs from any
// other host are returned unchanged.
export function sizedImage(url, width) {
  if (typeof url !== "string") return url;
  const match = url.match(CLOUDINARY_UPLOAD);
  if (!match) return url;
  return `${match[1]}f_auto,q_auto,w_${width}/${match[2]}`;
}

// onError handler: if a resized copy fails to load (Cloudinary can briefly
// error while generating a new size), fall back to the original image.
export function fallbackToOriginal(originalUrl) {
  return (e) => {
    const img = e.currentTarget;
    if (originalUrl && img.src !== originalUrl) img.src = originalUrl;
  };
}
