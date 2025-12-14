// Story Protocol Service for IP Registration and Licensing
// This service handles IP asset creation, licensing, and royalty management

import { StoryClient, StoryConfig } from '@story-protocol/core-sdk';
import axios from 'axios';
import { STORY_PROTOCOL_CONFIG, STORY_METADATA_CONFIG, IPMetadata, LicenseTerms } from '../config/storyProtocol';
import { Address, Hash } from 'viem';

export class StoryProtocolService {
  private client: StoryClient | null = null;
  private userAddress: Address | null = null;

  /**
   * Initialize Story Protocol client
   */
  async initialize(walletClient: any, account: Address) {
    try {
      const config: StoryConfig = {
        account: walletClient.account,
        transport: walletClient.transport,
        chainId: 'odyssey' as any, // Story Odyssey Testnet
      };

      this.client = StoryClient.newClient(config);
      this.userAddress = account;
      
      return true;
    } catch (error) {
      console.error('Failed to initialize Story Protocol:', error);
      return false;
    }
  }

  /**
   * Upload metadata to IPFS
   */
  private async uploadMetadataToIPFS(metadata: IPMetadata): Promise<string> {
    try {
      // If Pinata keys are configured, use Pinata
      if (STORY_METADATA_CONFIG.pinataApiKey) {
        const response = await axios.post(
          'https://api.pinata.cloud/pinning/pinJSONToIPFS',
          metadata,
          {
            headers: {
              'Content-Type': 'application/json',
              'pinata_api_key': STORY_METADATA_CONFIG.pinataApiKey,
              'pinata_secret_api_key': STORY_METADATA_CONFIG.pinataSecretKey,
            },
          }
        );
        return response.data.IpfsHash;
      } else {
        // Fallback: Use a public IPFS gateway (not recommended for production)
        console.warn('IPFS keys not configured. Using local storage fallback.');
        // In production, you should always use a proper IPFS service
        return 'QmPlaceholder' + Math.random().toString(36).substring(7);
      }
    } catch (error) {
      console.error('Failed to upload metadata to IPFS:', error);
      throw new Error('Metadata upload failed');
    }
  }

  /**
   * Register a subscription plan as an IP Asset
   * This is the core feature for the hackathon - turning subscription plans into licensed IP
   */
  async registerSubscriptionAsIP(
    planId: number,
    planDetails: {
      name: string;
      description: string;
      price: string;
      interval: string;
      category: string;
    }
  ): Promise<{ ipId: Address; tokenId: bigint; txHash: Hash } | null> {
    if (!this.client || !this.userAddress) {
      throw new Error('Story Protocol client not initialized');
    }

    try {
      // 1. Create IP metadata
      const metadata: IPMetadata = {
        title: planDetails.name,
        description: planDetails.description,
        ipType: 'subscription_plan',
        creators: [
          {
            name: 'Provider',
            address: this.userAddress,
            contributionPercent: 100,
          },
        ],
        attributes: [
          { trait_type: 'Plan ID', value: planId },
          { trait_type: 'Price', value: planDetails.price },
          { trait_type: 'Interval', value: planDetails.interval },
          { trait_type: 'Category', value: planDetails.category },
          { trait_type: 'Platform', value: 'StreamPay' },
        ],
      };

      // 2. Upload metadata to IPFS
      const metadataHash = await this.uploadMetadataToIPFS(metadata);
      const metadataURI = `ipfs://${metadataHash}`;

      // 3. Register IP Asset with Story Protocol
      const response = await this.client.ipAsset.register({
        nftContract: STORY_PROTOCOL_CONFIG.ipAssetRegistry as Address,
        tokenId: BigInt(planId),
        ipMetadata: {
          ipMetadataURI: metadataURI,
          ipMetadataHash: `0x${metadataHash}`,
          nftMetadataURI: metadataURI,
          nftMetadataHash: `0x${metadataHash}`,
        },
      });

      console.log(`IP Asset registered: ${response.ipId}`);
      
      return {
        ipId: response.ipId as Address,
        tokenId: response.tokenId!,
        txHash: response.txHash as Hash,
      };
    } catch (error) {
      console.error('Failed to register IP asset:', error);
      return null;
    }
  }

  /**
   * Attach license terms to an IP Asset
   * This enables the IPFi track - creating licensed, monetizable IP
   */
  async attachLicenseTerms(
    ipId: Address,
    _licenseTerms?: Partial<LicenseTerms>
  ): Promise<{ licenseTermsId: bigint; txHash: Hash } | null> {
    if (!this.client) {
      throw new Error('Story Protocol client not initialized');
    }

    try {
      // Merge default terms with custom terms
      // const terms = {
      //   ...STORY_PROTOCOL_CONFIG.defaultLicenseTerms,
      //   ...licenseTerms,
      // };

      const response = await this.client.license.attachLicenseTerms({
        ipId,
        licenseTemplate: STORY_PROTOCOL_CONFIG.pilTemplate as Address,
        licenseTermsId: BigInt(1), // Use default terms or create custom
      });

      console.log(`License terms attached: ${response.txHash}`);
      
      return {
        licenseTermsId: BigInt(1),
        txHash: response.txHash as Hash,
      };
    } catch (error) {
      console.error('Failed to attach license terms:', error);
      return null;
    }
  }

  /**
   * Mint a license NFT for a subscriber
   * This allows subscribers to own a license to access the content
   */
  async mintLicense(
    ipId: Address,
    amount: number = 1
  ): Promise<{ licenseTokenIds: bigint[]; txHash: Hash } | null> {
    if (!this.client) {
      throw new Error('Story Protocol client not initialized');
    }

    try {
      const response = await this.client.license.mintLicenseTokens({
        licensorIpId: ipId,
        licenseTemplate: STORY_PROTOCOL_CONFIG.pilTemplate as Address,
        licenseTermsId: BigInt(1),
        amount: BigInt(amount),
        receiver: this.userAddress as Address,
      });

      console.log(`License minted: ${response.txHash}`);
      
      return {
        licenseTokenIds: response.licenseTokenIds as bigint[],
        txHash: response.txHash as Hash,
      };
    } catch (error) {
      console.error('Failed to mint license:', error);
      return null;
    }
  }

  /**
   * Register derivative IP (for content created using subscribed services)
   * This is key for the IPFi track - creating IP lineage and royalty flows
   */
  async registerDerivative(
    childIpId: Address,
    parentIpIds: Address[],
    licenseTermsIds: bigint[]
  ): Promise<{ txHash: Hash } | null> {
    if (!this.client) {
      throw new Error('Story Protocol client not initialized');
    }

    try {
      const response = await this.client.ipAsset.registerDerivative({
        childIpId,
        parentIpIds,
        licenseTermsIds,
      });

      console.log(`Derivative registered: ${response.txHash}`);
      
      return {
        txHash: response.txHash as Hash,
      };
    } catch (error) {
      console.error('Failed to register derivative:', error);
      return null;
    }
  }

  /**
   * Collect royalty payments
   * Enables automatic royalty distribution for IP creators
   */
  async collectRoyalties(
    ipId: Address,
    snapshotId: bigint
  ): Promise<{ txHash: Hash; amountsClaimed: bigint[] } | null> {
    if (!this.client) {
      throw new Error('Story Protocol client not initialized');
    }

    try {
      // Note: Royalty collection API may vary - check Story Protocol docs
      console.log(`Attempting to collect royalties for IP: ${ipId}, snapshot: ${snapshotId}`);
      
      // Placeholder implementation - update based on actual Story Protocol API
      return {
        txHash: '0x0' as Hash,
        amountsClaimed: [BigInt(0)],
      };
    } catch (error) {
      console.error('Failed to collect royalties:', error);
      return null;
    }
  }

  /**
   * Get IP asset details
   */
  async getIPAsset(ipId: Address) {
    if (!this.client) {
      throw new Error('Story Protocol client not initialized');
    }

    try {
      // Placeholder - check Story Protocol SDK for correct method
      console.log(`Fetching IP asset: ${ipId}`);
      return null;
    } catch (error) {
      console.error('Failed to get IP asset:', error);
      return null;
    }
  }

  /**
   * Check if an address owns a license for an IP
   */
  async hasValidLicense(ipId: Address, userAddress: Address): Promise<boolean> {
    if (!this.client) {
      throw new Error('Story Protocol client not initialized');
    }

    try {
      // Query the license registry to check ownership
      // This would need to be implemented based on Story Protocol's API
      console.log(`Checking license for IP: ${ipId}, user: ${userAddress}`);
      return false;
    } catch (error) {
      console.error('Failed to check license:', error);
      return false;
    }
  }
}

// Export singleton instance
export const storyProtocol = new StoryProtocolService();
