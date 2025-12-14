// React hooks for Story Protocol integration
// OSS/Dev Tooling Track - Reusable developer tools for IP management

import { useState, useEffect, useCallback } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { storyProtocol } from '../services/storyProtocolService';
import { Address } from 'viem';
import { IPMetadata } from '../config/storyProtocol';

export interface IPAsset {
  ipId: Address;
  tokenId: bigint;
  owner: Address;
  metadata?: IPMetadata;
  licenses: License[];
  royalties: RoyaltyInfo;
}

export interface License {
  licenseId: bigint;
  ipId: Address;
  licenseTermsId: bigint;
  holder: Address;
  active: boolean;
}

export interface RoyaltyInfo {
  totalEarned: string;
  claimable: string;
  claimed: string;
}

/**
 * Hook for Story Protocol client initialization
 */
export function useStoryProtocol() {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  const initialize = useCallback(async () => {
    if (!walletClient || !address || isInitialized || isInitializing) return;

    setIsInitializing(true);
    try {
      const success = await storyProtocol.initialize(walletClient, address);
      setIsInitialized(success);
    } catch (error) {
      console.error('Failed to initialize Story Protocol:', error);
      setIsInitialized(false);
    } finally {
      setIsInitializing(false);
    }
  }, [walletClient, address, isInitialized, isInitializing]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return {
    isInitialized,
    isInitializing,
    initialize,
  };
}

/**
 * Hook for registering subscription plans as IP assets
 */
export function useIPRegistration() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerPlan = useCallback(
    async (
      planId: number,
      planDetails: {
        name: string;
        description: string;
        price: string;
        interval: string;
        category: string;
      }
    ) => {
      setIsRegistering(true);
      setError(null);

      try {
        const result = await storyProtocol.registerSubscriptionAsIP(planId, planDetails);
        
        if (!result) {
          throw new Error('Failed to register IP asset');
        }

        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        return null;
      } finally {
        setIsRegistering(false);
      }
    },
    []
  );

  return {
    registerPlan,
    isRegistering,
    error,
  };
}

/**
 * Hook for managing IP licenses
 */
export function useIPLicense() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const attachLicense = useCallback(async (ipId: Address, customTerms?: any) => {
    setIsProcessing(true);
    setError(null);

    try {
      const result = await storyProtocol.attachLicenseTerms(ipId, customTerms);
      
      if (!result) {
        throw new Error('Failed to attach license terms');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const mintLicense = useCallback(async (ipId: Address, amount: number = 1) => {
    setIsProcessing(true);
    setError(null);

    try {
      const result = await storyProtocol.mintLicense(ipId, amount);
      
      if (!result) {
        throw new Error('Failed to mint license');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    attachLicense,
    mintLicense,
    isProcessing,
    error,
  };
}

/**
 * Hook for managing IP derivatives
 */
export function useIPDerivatives() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerDerivative = useCallback(
    async (childIpId: Address, parentIpIds: Address[], licenseTermsIds: bigint[]) => {
      setIsProcessing(true);
      setError(null);

      try {
        const result = await storyProtocol.registerDerivative(
          childIpId,
          parentIpIds,
          licenseTermsIds
        );
        
        if (!result) {
          throw new Error('Failed to register derivative');
        }

        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        return null;
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  return {
    registerDerivative,
    isProcessing,
    error,
  };
}

/**
 * Hook for managing IP royalties (IPFi track)
 */
export function useIPRoyalties(ipId?: Address) {
  const [royalties, setRoyalties] = useState<RoyaltyInfo>({
    totalEarned: '0',
    claimable: '0',
    claimed: '0',
  });
  const [isCollecting, setIsCollecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const collectRoyalties = useCallback(async (snapshotId: bigint) => {
    if (!ipId) return null;

    setIsCollecting(true);
    setError(null);

    try {
      const result = await storyProtocol.collectRoyalties(ipId, snapshotId);
      
      if (!result) {
        throw new Error('Failed to collect royalties');
      }

      // Update royalties info after collection
      // In production, you'd fetch this from the blockchain
      setRoyalties(prev => ({
        ...prev,
        claimed: (BigInt(prev.claimed) + result.amountsClaimed[0]).toString(),
        claimable: '0',
      }));

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return null;
    } finally {
      setIsCollecting(false);
    }
  }, [ipId]);

  return {
    royalties,
    collectRoyalties,
    isCollecting,
    error,
  };
}

/**
 * Hook for fetching IP asset details
 */
export function useIPAsset(ipId?: Address) {
  const [ipAsset, setIPAsset] = useState<IPAsset | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIPAsset = useCallback(async () => {
    if (!ipId) return;

    setIsLoading(true);
    setError(null);

    try {
      const asset = await storyProtocol.getIPAsset(ipId);
      
      if (asset) {
        setIPAsset(asset as any); // Type conversion needed based on actual API response
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [ipId]);

  useEffect(() => {
    fetchIPAsset();
  }, [fetchIPAsset]);

  return {
    ipAsset,
    isLoading,
    error,
    refetch: fetchIPAsset,
  };
}

/**
 * Hook for checking license ownership
 */
export function useHasLicense(ipId?: Address, userAddress?: Address) {
  const [hasLicense, setHasLicense] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const checkLicense = useCallback(async () => {
    if (!ipId || !userAddress) {
      setHasLicense(false);
      return;
    }

    setIsChecking(true);

    try {
      const valid = await storyProtocol.hasValidLicense(ipId, userAddress);
      setHasLicense(valid);
    } catch (error) {
      console.error('Failed to check license:', error);
      setHasLicense(false);
    } finally {
      setIsChecking(false);
    }
  }, [ipId, userAddress]);

  useEffect(() => {
    checkLicense();
  }, [checkLicense]);

  return {
    hasLicense,
    isChecking,
    refetch: checkLicense,
  };
}
