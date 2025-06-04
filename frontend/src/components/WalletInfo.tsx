import React from "react";
import { Wallet, Globe } from "lucide-react";

interface TokenInfo {
  address: string;
  symbol: string;
  balance: string;
}

interface WalletInfoProps {
  address: string;
  tokens: TokenInfo[];
  network: string;
  chainId: number;
}

const WalletInfo: React.FC<WalletInfoProps> = ({
  address,
  tokens,
  network,
  chainId,
}) => (
  <div className="bg-gray-50 rounded-lg p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <Wallet className="w-5 h-5 mr-2" />
      Wallet Information
    </h3>
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address
        </label>
        <div className="bg-white rounded-lg p-3 border">
          <code className="text-sm text-gray-900 break-all">{address}</code>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Token Balances
        </label>
        <div className="bg-white rounded-lg p-3 border">
          <ul className="space-y-1">
            {tokens.map((token) => (
              <li
                key={token.address}
                className="flex items-center justify-start gap-x-2 text-black"
              >
                <span className="font-semibold">{token.symbol}:</span>
                <span>{token.balance}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
          <Globe className="w-4 h-4 mr-1" />
          Network
        </label>
        <div className="bg-white rounded-lg p-3 border">
          <span className="text-sm text-gray-900">{network}</span>
          <div className="text-xs text-gray-500 mt-1">Chain ID: {chainId}</div>
        </div>
      </div>
    </div>
  </div>
);

export default WalletInfo;
