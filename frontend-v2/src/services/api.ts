import axios from 'axios';
import { BackendStatus, PredictResponse } from '../types/api';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Accept': 'application/json',
  },
  timeout: 60000,
});

export const getBackendStatus = async (): Promise<BackendStatus> => {
  const response = await apiClient.get<BackendStatus>('/status');
  return response.data;
};

export const predictMedicalImage = async (file: File): Promise<PredictResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post<PredictResponse>('/predict', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};