export interface Plan {
  id: string;
  providerId: string;
  providerName: string;
  name: string;
  description: string;
  price: string; // In ETH
  interval: 'monthly' | 'yearly';
  isActive: boolean;
  subscriberCount: number;
  createdAt: string;
  // Story Protocol IP Integration
  ipAssetId?: string;
  ipMetadataURI?: string;
  hasLicense?: boolean;
  licenseTermsId?: string;
}

export interface Provider {
  id: string;
  name: string;
  email: string;
  walletAddress: string;
  createdAt: string;
  // Story Protocol IP Integration
  totalIPAssets?: number;
  totalRoyaltiesEarned?: string;
}

export interface Subscription {
  id: string;
  planId: string;
  planName: string;
  providerName: string;
  price: string;
  interval: 'monthly' | 'yearly';
  status: 'active' | 'cancelled' | 'expired';
  nextPaymentDate: string;
  subscribedAt: string;
  // Story Protocol IP Integration
  licenseTokenId?: string;
  hasLicense?: boolean;
  contentIPAssetId?: string; // If user created derivative content
}

export interface EscrowBalance {
  total: string;
  withdrawable: string;
  pending: string;
}

export interface PaymentHistory {
  id: string;
  planName: string;
  amount: string;
  date: string;
  status: 'success' | 'failed' | 'pending';
  txHash?: string;
  // Story Protocol IP Integration
  royaltyAmount?: string; // Portion that went to IP royalties
}