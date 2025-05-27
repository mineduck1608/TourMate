import { Applications } from '@/types/applications';
import http from '../utils/http';

export const createCVApplication = async (data: Partial<Applications>) => {
    const response = await http.post('/cv-applications', data);
    return response.data;
}