export type WorkspaceTheme = 'medical' | 'ai';

export interface BackendStatus {
  status: string;
  version?: string;
  models_loaded?: boolean;
  gpu_available?: boolean;
  active_device?: string;
}

export interface DomainInfo {
  name: string;
  confidence: number;
  scores?: Record<string, number>;
}

export type DomainType = string | DomainInfo;

export type BBoxObject = {
  x: number;
  y: number;
  width: number;
  height: number;
  x2?: number;
  y2?: number;
};

export type BBoxArray = [number, number, number, number];

export type BBoxType = BBoxObject | BBoxArray;

export type TrajectoryPoint = [number, number] | { x: number; y: number };

export type SearchWindow =
  | [number, number, number, number]
  | { x1?: number; y1?: number; x2?: number; y2?: number; x?: number; y?: number; width?: number; height?: number };

export interface LocalizationResult {
  bbox: BBoxType;
  trajectory: TrajectoryPoint[];
  actions: string[];
  windows: SearchWindow[];
  steps: number;
  processing_time: number;
}

export interface TopPrediction {
  class_id: number | string;
  class_name: string;
  confidence: number;
}

export interface ClassificationResult {
  class_id: number | string;
  class_name: string;
  confidence: number;
  top_5: TopPrediction[];
}

export interface PredictResponse {
  success: boolean;
  processing_time: number;
  domain: DomainType;
  localization: LocalizationResult;
  classification: ClassificationResult;
  file?: string;
}

export interface InferenceSession {
  id: string;
  timestamp: string;
  imageUrl: string;
  imageName: string;
  imageSize?: string;
  result: PredictResponse;
}

export interface ParsedBBox {
  x: number;
  y: number;
  w: number;
  h: number;
  x2: number;
  y2: number;
  displayText: string;
  isNormalized: boolean;
}

export const getDomainName = (domain?: DomainType): string => {
  if (!domain) return 'N/A';
  if (typeof domain === 'string') return domain;
  if (typeof domain === 'object' && domain !== null && 'name' in domain) {
    return domain.name || 'N/A';
  }
  return 'N/A';
};

export const parseBBox = (rawBBox?: BBoxType): ParsedBBox => {
  if (!rawBBox) {
    return { x: 0, y: 0, w: 0, h: 0, x2: 0, y2: 0, displayText: '[0, 0, 0, 0]', isNormalized: true };
  }

  if (Array.isArray(rawBBox)) {
    const [ymin, xmin, ymax, xmax] = rawBBox;
    const w = xmax - xmin;
    const h = ymax - ymin;
    const isNormalized = xmax <= 1.0 && ymax <= 1.0;
    return {
      x: xmin,
      y: ymin,
      w,
      h,
      x2: xmax,
      y2: ymax,
      displayText: `[${xmin}, ${ymin}, ${xmax}, ${ymax}]`,
      isNormalized,
    };
  }

  const x = rawBBox.x ?? 0;
  const y = rawBBox.y ?? 0;
  const w = rawBBox.width ?? 0;
  const h = rawBBox.height ?? 0;
  const x2 = rawBBox.x2 ?? x + w;
  const y2 = rawBBox.y2 ?? y + h;
  const isNormalized = x2 <= 1.0 && y2 <= 1.0;

  return {
    x,
    y,
    w,
    h,
    x2,
    y2,
    displayText: `x: ${x}, y: ${y}, w: ${w}, h: ${h}`,
    isNormalized,
  };
};

export const parseTrajectoryPoint = (p?: TrajectoryPoint): { x: number; y: number } => {
  if (!p) return { x: 0, y: 0 };
  if (Array.isArray(p)) return { x: p[0] ?? 0, y: p[1] ?? 0 };
  return { x: p.x ?? 0, y: p.y ?? 0 };
};

export const parseSearchWindow = (w?: SearchWindow): { x1: number; y1: number; x2: number; y2: number } => {
  if (!w) return { x1: 0, y1: 0, x2: 0, y2: 0 };

  if (Array.isArray(w)) {
    const [y1, x1, y2, x2] = w;
    return { x1: x1 ?? 0, y1: y1 ?? 0, x2: x2 ?? 0, y2: y2 ?? 0 };
  }

  const x1 = w.x1 ?? w.x ?? 0;
  const y1 = w.y1 ?? w.y ?? 0;
  const x2 = w.x2 ?? (w.x !== undefined && w.width !== undefined ? w.x + w.width : 0);
  const y2 = w.y2 ?? (w.y !== undefined && w.height !== undefined ? w.y + w.height : 0);

  return { x1, y1, x2, y2 };
};