import { Contact } from '@/types/contact';
import http from '../utils/http'
import { PagedResult } from '@/types/pagedResult';

export const getContacts = async (page: number | string, limit: number | string, signal?: AbortSignal) => {
    const res = await http.get<PagedResult<Contact>>('contact', {
      params: {
        pageSize: limit,
        pageIndex: page
      },
      signal
    });
  
    return res.data;
  };

  export const getFilteredContacts = async (page: number | string, limit: number | string, search: string, region: string, signal?: AbortSignal) => {
    const res = await http.get<PagedResult<Contact>>('contact/filtered-contact', {
      params: {
        pageSize: limit,
        pageIndex: page,
        search: search,
        region: region
      },
      signal
    });
  
    return res.data;
  };


export const getContact = async (id: number | string) => http.get<Contact>(`contact/${id}`)

export const addContact = async (data: Contact) => {
  const response = await http.post('/contact', data);
  return response.data;
};

export const updateContact = async (id: number, data: Contact) => {
  const response = await http.put(`/contact/${id}`, data);
  return response.data;
};

export const deleteContact = (id: number | string) => http.delete<object>(`contact/${id}`)

