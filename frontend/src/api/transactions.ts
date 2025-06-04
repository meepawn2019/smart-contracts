import axiosInstance from './axiosInstance';

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  time_stamp?: string;
}

export const fetchTransactions = async (walletAddress: string): Promise<Transaction[]> => {
  try {
    const response = await axiosInstance.get(`/transactions/${walletAddress}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    return [];
  }
}; 