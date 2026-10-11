export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const MAX_INPUT_BYTES = 5 * 1024 * 1024
const OUTPUT_SIZE = 192
// Stays under the 60,000-character limit in the Firestore rules.
const MAX_OUTPUT_CHARS = 50000

export class ImageError extends Error {}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new ImageError('That file could not be read as an image.'))
    }
    image.src = url
  })
}

/**
 * Center-crops the image to a square, resizes it to 192x192, and returns a
 * JPEG data URL small enough to store in Firestore.
 */
export async function fileToAvatarDataUrl(file) {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    throw new ImageError('Choose a JPG, PNG, or WebP image.')
  }
  if (file.size > MAX_INPUT_BYTES) {
    throw new ImageError('That image is too large. Choose one under 5 MB.')
  }

  const image = await loadImage(file)
  const side = Math.min(image.naturalWidth, image.naturalHeight)
  if (!side) throw new ImageError('That file could not be read as an image.')

  const canvas = document.createElement('canvas')
  canvas.width = OUTPUT_SIZE
  canvas.height = OUTPUT_SIZE
  const context = canvas.getContext('2d')

  // JPEG has no transparency, so transparent PNGs get a white background.
  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE)
  context.drawImage(
    image,
    (image.naturalWidth - side) / 2,
    (image.naturalHeight - side) / 2,
    side,
    side,
    0,
    0,
    OUTPUT_SIZE,
    OUTPUT_SIZE
  )

  for (let quality = 0.85; quality >= 0.4; quality -= 0.15) {
    const dataUrl = canvas.toDataURL('image/jpeg', quality)
    if (dataUrl.length <= MAX_OUTPUT_CHARS) return dataUrl
  }
  throw new ImageError('That image could not be shrunk enough. Try a different one.')
}