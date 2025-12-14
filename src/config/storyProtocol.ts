// Story Protocol Configuration
// This enables IP registration and licensing for subscription content

export const STORY_PROTOCOL_CONFIG = {
  // Story Protocol is deployed on Story Network (Odyssey Testnet)
  chainId: 1516, // Story Odyssey Testnet
  rpcUrl: 'https://odyssey.storyrpc.io/',
  
  // Story Protocol core contracts
  ipAssetRegistry: '0x292639452A975630802C17c9267169D93BD5a793',
  licensingModule: '0x5a7D9Fa17DE09350F481A53B470D798c1c1b7832',
  royaltyModule: '0xEa6eD700b11DfF703665CCAF55887ca56134Ae3B',
  
  // PIL (Programmable IP License) Templates
  pilTemplate: '0x260B6CB6284c89dbE660c0004233f7bB99B5edE7',
  
  // Default license configuration for subscription content
  defaultLicenseTerms: {
    transferable: true,
    royaltyPolicy: '0x793eC5E8508d4883958C4715d3bEf8630A03a71a', // Royalty Policy LAP
    defaultMintingFee: '0', // Can be customized per plan
    expiration: 0, // No expiration
    commercialUse: true,
    commercialAttribution: true,
    derivativesAllowed: true,
    derivativesAttribution: true,
    derivativesApproval: false,
    derivativesReciprocal: true,
    currency: '0x0000000000000000000000000000000000000000', // ETH
  }
};

export const STORY_METADATA_CONFIG = {
  // IPFS gateway for IP metadata
  ipfsGateway: 'https://ipfs.io/ipfs/',
  
  // Pinata for IPFS pinning (add your keys in .env)
  pinataApiKey: import.meta.env.VITE_PINATA_API_KEY || '',
  pinataSecretKey: import.meta.env.VITE_PINATA_SECRET_KEY || '',
};

export interface IPMetadata {
  title: string;
  description: string;
  ipType: 'subscription_plan' | 'content' | 'service';
  creators: {
    name: string;
    address: string;
    contributionPercent: number;
  }[];
  attributes: {
    trait_type: string;
    value: string | number;
  }[];
  externalUrl?: string;
  image?: string;
}

export interface LicenseTerms {
  transferable: boolean;
  royaltyPolicy: string;
  defaultMintingFee: string;
  expiration: number;
  commercialUse: boolean;
  commercialAttribution: boolean;
  derivativesAllowed: boolean;
  derivativesAttribution: boolean;
  derivativesApproval: boolean;
  derivativesReciprocal: boolean;
  currency: string;
}
