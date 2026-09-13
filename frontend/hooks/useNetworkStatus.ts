import { useState, useEffect } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

export type NetworkStatusType = 'online' | 'offline' | 'checking';

export interface NetworkStatus {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
  isOffline: boolean;
  status: NetworkStatusType;
}

export function useNetworkStatus(): NetworkStatus {
  const [networkState, setNetworkState] = useState<NetworkStatus>({
    isConnected: true,
    isInternetReachable: true,
    isOffline: false,
    status: 'online',
  });

  useEffect(() => {
    // Initial fetch
    NetInfo.fetch().then((state: NetInfoState) => {
      updateState(state);
    }).catch(() => {
      // In case of error (e.g. test environment) default to online
    });

    // Subscribe to changes
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      updateState(state);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const updateState = (state: NetInfoState) => {
    const isConnected = state.isConnected;
    const isInternetReachable = state.isInternetReachable;

    let status: NetworkStatusType = 'online';
    let isOffline = false;

    if (isConnected === null) {
      status = 'checking';
      isOffline = false;
    } else if (isConnected === false) {
      status = 'offline';
      isOffline = true;
    } else if (isInternetReachable === false) {
      status = 'offline';
      isOffline = true;
    } else {
      status = 'online';
      isOffline = false;
    }

    setNetworkState({
      isConnected,
      isInternetReachable,
      isOffline,
      status,
    });
  };

  return networkState;
}
