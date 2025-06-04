import { useState, useEffect } from 'react';
import Web3 from 'web3';

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string }) => Promise<string[]>;
      on: (event: string, callback: (accounts: string[]) => void) => void;
      removeListener: (
        event: string,
        callback: (accounts: string[]) => void
      ) => void;
    };
  }
}

const tokenList = [
  {
    address: '0xEf30389B78C17303dffc144Eb45De839f7F8C49f',
    symbol: 'TEK',
  },
];

const abi = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function',
  },
];

export interface TokenInfo {
  address: string;
  symbol: string;
  balance: string;
}

export interface UserInfo {
  address: string;
  tokens: TokenInfo[];
  balance: string;

  network: string;
  chainId: number;
}

export const useWallet = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  const getNetworkName = (chainId: number): string => {
    const networks: { [key: number]: string } = {
      11155111: 'Sepolia Testnet',
    };
    return networks[chainId] || `Chain ID: ${chainId}`;
  };

  const fetchTokenBalances = async (web3: Web3, address: string) => {
    return Promise.all(
      tokenList.map(async (token) => {
        const contract = new web3.eth.Contract(abi, token.address);
        const balanceWei = await contract.methods.balanceOf(address).call();
        const decimals = await contract.methods.decimals().call();
        const balance = Number(balanceWei) / 10 ** Number(decimals);
        console.log('balance', balance);
        return {
          address: token.address,
          symbol: token.symbol,
          balance: balance.toString(),
        };
      })
    );
  };

  const connectWallet = async () => {
    setLoading(true);
    setError(null);
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      }
      const web3 = new Web3(
        window.ethereum || `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`
      );
      const accounts = await web3.eth.getAccounts();
      if (accounts.length === 0) {
        throw new Error('No accounts found. Please connect your wallet.');
      }
      const address = accounts[0];
      const tokens = await fetchTokenBalances(web3, address);
      const chainId = await web3.eth.net.getId();
      const network = getNetworkName(Number(chainId));
      setUserInfo({
        address,
        tokens,
        balance: tokens[0]?.balance || '0',
        network,
        chainId: Number(chainId),
      });
      setConnected(true);
      localStorage.setItem('walletConnected', 'true');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to connect to Ethereum'
      );
    } finally {
      setLoading(false);
    }
  };

  const disconnect = () => {
    setUserInfo(null);
    setConnected(false);
    setError(null);
    localStorage.removeItem('walletConnected');
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (!(typeof window !== 'undefined' && window.ethereum)) {
        return;
      }
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      const wasConnected = localStorage.getItem('walletConnected') === 'true';
      if ((accounts && accounts.length > 0) || wasConnected) {
        connectWallet();
      }
    };
    checkConnection();
  }, []);

  useEffect(() => {
    if (!(typeof window !== 'undefined' && window.ethereum)) {
      return;
    }
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        connectWallet();
      }
    };
    const handleChainChanged = () => {
      connectWallet();
    };
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  return {
    userInfo,
    loading,
    error,
    connected,
    connectWallet,
    disconnect,
  };
}; 