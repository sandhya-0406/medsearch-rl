export interface ImageDimensions {
  naturalWidth: number;
  naturalHeight: number;
}

export interface PixelPoint {
  x: number;
  y: number;
}

export interface PixelBox {
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;
  width: number;
  height: number;
}

/**
 * Converts mouse/client event coordinates to the original image's un-scaled pixel space (0,0 at top-left).
 * Handles CSS object-contain letterboxing, container offsets, and element scaling.
 */
export function displayToImageCoordinates(
  clientX: number,
  clientY: number,
  imgElement: HTMLImageElement | null
): PixelPoint | null {
  if (!imgElement) return null;

  const rect = imgElement.getBoundingClientRect();
  const naturalWidth = imgElement.naturalWidth || 1;
  const naturalHeight = imgElement.naturalHeight || 1;

  if (rect.width === 0 || rect.height === 0) return null;

  // Account for CSS object-contain letterboxing if present
  const imageAspect = naturalWidth / naturalHeight;
  const elementAspect = rect.width / rect.height;

  let renderedWidth = rect.width;
  let renderedHeight = rect.height;
  let offsetX = 0;
  let offsetY = 0;

  if (elementAspect > imageAspect) {
    renderedWidth = rect.height * imageAspect;
    offsetX = (rect.width - renderedWidth) / 2;
  } else {
    renderedHeight = rect.width / imageAspect;
    offsetY = (rect.height - renderedHeight) / 2;
  }

  const relativeX = clientX - rect.left - offsetX;
  const relativeY = clientY - rect.top - offsetY;

  // If outside the actual rendered image boundaries
  if (relativeX < 0 || relativeX > renderedWidth || relativeY < 0 || relativeY > renderedHeight) {
    return null;
  }

  const pixelX = Math.round((relativeX / renderedWidth) * naturalWidth);
  const pixelY = Math.round((relativeY / renderedHeight) * naturalHeight);

  return {
    x: Math.max(0, Math.min(naturalWidth, pixelX)),
    y: Math.max(0, Math.min(naturalHeight, pixelY)),
  };
}

/**
 * Normalizes any trajectory point into absolute original pixel coordinates.
 */
export function toPixelCoordinates(
  point: { x: number; y: number },
  dimensions: ImageDimensions
): PixelPoint {
  const { naturalWidth, naturalHeight } = dimensions;
  const isNorm = point.x <= 1.0 && point.y <= 1.0;

  return {
    x: Math.round(isNorm ? point.x * naturalWidth : point.x),
    y: Math.round(isNorm ? point.y * naturalHeight : point.y),
  };
}

/**
 * Normalizes raw bounding box formats ([ymin, xmin, ymax, xmax] or [xmin, ymin, xmax, ymax])
 * into clean pixel-space bounding coordinates: xmin, ymin, xmax, ymax, width, height.
 */
export function toPixelBoundingBox(
  rawBbox: any,
  dimensions: ImageDimensions
): PixelBox | null {
  if (!rawBbox) return null;
  const { naturalWidth, naturalHeight } = dimensions;

  let xmin = 0;
  let ymin = 0;
  let xmax = 0;
  let ymax = 0;

  if (Array.isArray(rawBbox) && rawBbox.length === 4) {
    const isNormalized = rawBbox.every((v) => typeof v === 'number' && v >= 0 && v <= 1.0);

    // Standard detection format: [ymin, xmin, ymax, xmax] vs [xmin, ymin, xmax, ymax]
    if (isNormalized) {
      if (rawBbox[0] <= rawBbox[2] && rawBbox[1] <= rawBbox[3]) {
        // [ymin, xmin, ymax, xmax]
        ymin = rawBbox[0] * naturalHeight;
        xmin = rawBbox[1] * naturalWidth;
        ymax = rawBbox[2] * naturalHeight;
        xmax = rawBbox[3] * naturalWidth;
      } else {
        xmin = rawBbox[0] * naturalWidth;
        ymin = rawBbox[1] * naturalHeight;
        xmax = rawBbox[2] * naturalWidth;
        ymax = rawBbox[3] * naturalHeight;
      }
    } else {
      // Pixel coordinates directly
      if (rawBbox[0] > naturalWidth && rawBbox[1] <= naturalWidth) {
        ymin = rawBbox[0];
        xmin = rawBbox[1];
        ymax = rawBbox[2];
        xmax = rawBbox[3];
      } else {
        xmin = rawBbox[0];
        ymin = rawBbox[1];
        xmax = rawBbox[2];
        ymax = rawBbox[3];
      }
    }
  } else if (typeof rawBbox === 'object') {
    xmin = rawBbox.x1 ?? rawBbox.xmin ?? rawBbox.x ?? 0;
    ymin = rawBbox.y1 ?? rawBbox.ymin ?? rawBbox.y ?? 0;
    xmax = rawBbox.x2 ?? rawBbox.xmax ?? (xmin + (rawBbox.width || 0));
    ymax = rawBbox.y2 ?? rawBbox.ymax ?? (ymin + (rawBbox.height || 0));

    if (xmin <= 1.0 && xmax <= 1.0 && (xmax - xmin) > 0) {
      xmin *= naturalWidth;
      ymin *= naturalHeight;
      xmax *= naturalWidth;
      ymax *= naturalHeight;
    }
  }

  xmin = Math.round(Math.max(0, Math.min(naturalWidth, xmin)));
  ymin = Math.round(Math.max(0, Math.min(naturalHeight, ymin)));
  xmax = Math.round(Math.max(xmin, Math.min(naturalWidth, xmax)));
  ymax = Math.round(Math.max(ymin, Math.min(naturalHeight, ymax)));

  return {
    xmin,
    ymin,
    xmax,
    ymax,
    width: Math.max(0, xmax - xmin),
    height: Math.max(0, ymax - ymin),
  };
}