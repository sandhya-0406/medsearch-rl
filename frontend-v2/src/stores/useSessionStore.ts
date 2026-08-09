import { create } from 'zustand';
import { WorkspaceTheme, PredictResponse, getDomainName } from '../types/api';

const HISTORY_STORAGE_KEY = 'medsearch-inference-history';

export interface InferenceHistoryItem {
  id: string;
  timestamp: string;
  fileName: string;
  fileSize?: string;
  domainName: string;
  domainConfidence?: number;
  domainScores?: Record<string, number>;
  localizationBbox: string;
  localizationSteps: number;
  localizationProcessingTime: number;
  classificationName: string;
  classificationConfidence: number;
  totalProcessingTime: number;
  actions?: string[];
}

export interface ActiveAnalysisState {
  file: File | null;
  previewUrl: string | null;
  result: PredictResponse | null;
  stage: 'idle' | 'domain_detection' | 'rl_search' | 'localization' | 'classification' | 'completed' | 'error';
  errorMessage: string | null;
}

interface SessionState {
  workspaceTheme: WorkspaceTheme;
  currentAnalysis: ActiveAnalysisState;
  sessionHistory: InferenceHistoryItem[];

  // Theme actions
  setWorkspaceTheme: (theme: WorkspaceTheme) => void;
  toggleWorkspaceTheme: () => void;

  // Analysis Lifecycle actions
  setCurrentAnalysisFile: (file: File | null, previewUrl: string | null) => void;
  setCurrentAnalysisStage: (stage: ActiveAnalysisState['stage']) => void;
  setCurrentAnalysisError: (errorMessage: string | null) => void;
  setAnalysisResult: (result: PredictResponse) => void;
  startNewAnalysis: () => void;
  clearCurrentAnalysis: () => void;

  // History actions
  addHistoryItem: (item: InferenceHistoryItem) => void;
  clearHistory: () => void;
}

const loadHistoryFromStorage = (): InferenceHistoryItem[] => {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveHistoryToStorage = (history: InferenceHistoryItem[]) => {
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch {
    // Graceful fallback if quota is exceeded
  }
};

export const useSessionStore = create<SessionState>((set, get) => ({
  workspaceTheme: 'ai',

  currentAnalysis: {
    file: null,
    previewUrl: null,
    result: null,
    stage: 'idle',
    errorMessage: null,
  },

  sessionHistory: loadHistoryFromStorage(),

  setWorkspaceTheme: (theme) => {
    if (theme === 'ai') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ workspaceTheme: theme });
  },

  toggleWorkspaceTheme: () =>
    set((state) => {
      const nextTheme = state.workspaceTheme === 'ai' ? 'medical' : 'ai';
      if (nextTheme === 'ai') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { workspaceTheme: nextTheme };
    }),

  setCurrentAnalysisFile: (file, previewUrl) =>
    set((state) => ({
      currentAnalysis: {
        ...state.currentAnalysis,
        file,
        previewUrl,
        stage: 'idle',
        errorMessage: null,
      },
    })),

  setCurrentAnalysisStage: (stage) =>
    set((state) => ({
      currentAnalysis: {
        ...state.currentAnalysis,
        stage,
      },
    })),

  setCurrentAnalysisError: (errorMessage) =>
    set((state) => ({
      currentAnalysis: {
        ...state.currentAnalysis,
        errorMessage,
        stage: 'error',
      },
    })),

  setAnalysisResult: (result) => {
    const state = get();
    const { currentAnalysis } = state;

    const domainObj = typeof result.domain === 'object' && result.domain !== null ? result.domain : null;
    const domainName = getDomainName(result.domain);
    const domainConfidence = domainObj?.confidence;
    const domainScores = domainObj?.scores;

    const historyItem: InferenceHistoryItem = {
      id: `session_${Date.now()}`,
      timestamp: new Date().toISOString(),
      fileName: currentAnalysis.file?.name || 'Medical Scan',
      fileSize: currentAnalysis.file ? `${(currentAnalysis.file.size / 1024).toFixed(1)} KB` : 'Loaded',
      domainName,
      domainConfidence,
      domainScores,
      localizationBbox: JSON.stringify(result.localization?.bbox || []),
      localizationSteps: result.localization?.steps || 0,
      localizationProcessingTime: result.localization?.processing_time || 0,
      classificationName: result.classification?.class_name || 'Unknown',
      classificationConfidence: result.classification?.confidence || 0,
      totalProcessingTime: result.processing_time || 0,
      actions: result.localization?.actions || [],
    };

    const newHistory = [historyItem, ...state.sessionHistory];
    saveHistoryToStorage(newHistory);

    set({
      currentAnalysis: {
        ...currentAnalysis,
        result,
        stage: 'completed',
        errorMessage: null,
      },
      sessionHistory: newHistory,
    });
  },

  startNewAnalysis: () => {
    set((state) => ({
      currentAnalysis: {
        file: null,
        previewUrl: null,
        result: null,
        stage: 'idle',
        errorMessage: null,
      },
    }));
  },

  clearCurrentAnalysis: () => {
    set({
      currentAnalysis: {
        file: null,
        previewUrl: null,
        result: null,
        stage: 'idle',
        errorMessage: null,
      },
    });
  },

  addHistoryItem: (item) => {
    const state = get();
    const updated = [item, ...state.sessionHistory];
    saveHistoryToStorage(updated);
    set({ sessionHistory: updated });
  },

  clearHistory: () => {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
    set({ sessionHistory: [] });
  },
}));