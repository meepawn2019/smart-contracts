import React from "react";
import { Wallet, AlertCircle, CheckCircle } from "lucide-react";
import WalletInfo from "./WalletInfo";
import { useWallet } from "../hooks/useWallet";
import { fetchTransactions } from "../api/transactions";
import type { Transaction } from "../api/transactions";
import { useQuery } from "@tanstack/react-query";

const EthereumWeb3App: React.FC = () => {
  const { userInfo, loading, error, connected, connectWallet, disconnect } =
    useWallet();

  const {
    data: transactions = [],
    isLoading: transactionsLoading,
    isError: transactionsIsError,
  } = useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: () => fetchTransactions(userInfo?.address || ""),
    enabled: !!userInfo?.address,
    refetchInterval: 10000,
    refetchOnWindowFocus: false,
    retry: false,
  });

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Wallet className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Ethereum Web3 Connector
            </h1>
            <p className="text-gray-600">
              Connect to view your Ethereum wallet information
            </p>
          </div>

          {!connected && (
            <div className="text-center">
              <button
                onClick={connectWallet}
                disabled={loading}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="w-5 h-5 mr-2" />
                    Connect Wallet
                  </>
                )}
              </button>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}

          {connected && userInfo && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-green-700 font-medium">
                    Connected to Ethereum
                  </span>
                </div>
              </div>
              <WalletInfo
                address={userInfo.address}
                tokens={userInfo.tokens}
                network={userInfo.network}
                chainId={userInfo.chainId}
              />
              <div>
                <h2 className="text-lg font-semibold mb-2 text-black">
                  Most recent transactions
                </h2>
                {transactionsLoading && <div>Loading transactions...</div>}
                {transactionsIsError && (
                  <div className="text-red-600">
                    Failed to load transactions
                  </div>
                )}
                {!transactionsLoading &&
                  !transactionsIsError &&
                  transactions.length === 0 && (
                    <div>No transactions found.</div>
                  )}
                {!transactionsLoading &&
                  !transactionsIsError &&
                  transactions.length > 0 && (
                    <ul className="divide-y divide-gray-200 text-black">
                      {transactions.map((tx) => (
                        <li key={tx.hash} className="py-2 text-sm">
                          <div>
                            <span className="font-medium">Hash:</span> {tx.hash}
                          </div>
                          <div>
                            <span className="font-medium">From:</span>
                            {tx.from}
                          </div>
                          <div>
                            <span className="font-medium">To:</span>
                            {tx.to}
                          </div>
                          <div>
                            <span className="font-medium">Value:</span>
                            {tx.from === userInfo.address ? "-" : "+"}
                            {tx.value} TEK
                          </div>
                          {tx.time_stamp && (
                            <div>
                              <span className="font-medium">Time:</span>
                              {new Date(
                                parseInt(tx.time_stamp) * 1000
                              ).toLocaleString()}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
              </div>
              <div className="text-center">
                <button
                  onClick={disconnect}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Disconnect
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EthereumWeb3App;
