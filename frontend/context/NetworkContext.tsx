import React, { createContext, useContext } from 'react';
import { useNetworkStatus, NetworkStatus } from '../hooks/useNetworkStatus';

const NetworkContext = createContext<NetworkStatus>({
  isConnected: true,
  isInternetReachable: true,
  isOffline: false,
  status: 'online',
});

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const networkStatus = useNetworkStatus();

  return (
    <NetworkContext.Provider value={networkStatus}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = (): NetworkStatus => {
  return useContext(NetworkContext);
};
