## Story Protocol Integration Guide

This document provides step-by-step instructions for integrating Story Protocol into your own subscription or content platform.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Using the Hooks](#using-the-hooks)
5. [Smart Contract Integration](#smart-contract-integration)
6. [Examples](#examples)

## Prerequisites

- Node.js 18+
- React 18+
- TypeScript
- Wagmi + Viem for Web3 integration
- Story Protocol account (Odyssey Testnet)

## Installation

```bash
npm install @story-protocol/core-sdk @story-protocol/react-sdk axios
```

## Configuration

### 1. Create Story Protocol Config

Copy `src/config/storyProtocol.ts` to your project. This file contains:
- Story Protocol contract addresses
- Default license terms (PIL)
- IPFS configuration
- TypeScript interfaces

### 2. Environment Variables

Add to your `.env` file:

```env
# IPFS Storage (Pinata)
VITE_PINATA_API_KEY=your_pinata_api_key
VITE_PINATA_SECRET_KEY=your_pinata_secret_key

# Story Network
VITE_STORY_RPC_URL=https://odyssey.storyrpc.io/
VITE_STORY_CHAIN_ID=1516
```

## Using the Hooks

### Initialize Story Protocol

```typescript
import { useStoryProtocol } from './hooks/useStoryProtocol';

function MyComponent() {
  const { isInitialized, isInitializing } = useStoryProtocol();
  
  if (!isInitialized) {
    return <div>Initializing Story Protocol...</div>;
  }
  
  // Use Story Protocol features
}
```

### Register IP Assets

```typescript
import { useIPRegistration } from './hooks/useStoryProtocol';

function CreatePlan() {
  const { registerPlan, isRegistering, error } = useIPRegistration();
  
  const handleCreate = async () => {
    const result = await registerPlan(planId, {
      name: "My Premium Plan",
      description: "Advanced features",
      price: "0.05",
      interval: "30",
      category: "saas"
    });
    
    if (result) {
      console.log('IP Asset ID:', result.ipId);
      console.log('Transaction:', result.txHash);
    }
  };
  
  return (
    <button onClick={handleCreate} disabled={isRegistering}>
      {isRegistering ? 'Registering...' : 'Register IP'}
    </button>
  );
}
```

### Attach License Terms

```typescript
import { useIPLicense } from './hooks/useStoryProtocol';

function AttachLicense({ ipId }) {
  const { attachLicense, isProcessing } = useIPLicense();
  
  const handleAttach = async () => {
    const result = await attachLicense(ipId, {
      commercialUse: true,
      derivativesAllowed: true,
      royaltyPolicy: '0x...', // Your royalty policy address
      defaultMintingFee: '0.01'
    });
  };
}
```

### Mint Licenses for Users

```typescript
import { useIPLicense } from './hooks/useStoryProtocol';

function MintLicense({ ipId }) {
  const { mintLicense, isProcessing } = useIPLicense();
  
  const handleMint = async () => {
    const result = await mintLicense(ipId, 1); // Mint 1 license
    
    if (result) {
      console.log('License Token ID:', result.licenseTokenIds[0]);
    }
  };
}
```

### Track Royalties

```typescript
import { useIPRoyalties } from './hooks/useStoryProtocol';

function RoyaltyTracker({ ipId }) {
  const { royalties, collectRoyalties, isCollecting } = useIPRoyalties(ipId);
  
  return (
    <div>
      <p>Total Earned: {royalties.totalEarned} ETH</p>
      <p>Claimable: {royalties.claimable} ETH</p>
      <p>Claimed: {royalties.claimed} ETH</p>
      
      {parseFloat(royalties.claimable) > 0 && (
        <button 
          onClick={() => collectRoyalties(BigInt(1))}
          disabled={isCollecting}
        >
          Collect Royalties
        </button>
      )}
    </div>
  );
}
```

### Register Derivatives

```typescript
import { useIPDerivatives } from './hooks/useStoryProtocol';

function RegisterDerivative() {
  const { registerDerivative, isProcessing } = useIPDerivatives();
  
  const handleRegister = async () => {
    const result = await registerDerivative(
      childIpId,
      [parentIpId1, parentIpId2], // Parent IP assets
      [BigInt(1), BigInt(1)] // License terms IDs
    );
  };
}
```

## Smart Contract Integration

### Add IP Events to Your Contract

```rust
sol! {
    event IPAssetRegistered(uint256 indexed planId, address indexed ipAsset, string metadataURI);
    event IPLicenseAttached(address indexed ipAsset, uint256 indexed licenseTermsId);
    event IPLicenseMinted(address indexed ipAsset, address indexed licensee, uint256 indexed tokenId);
    event IPRoyaltyPaid(address indexed ipAsset, address indexed recipient, uint256 amount);
}
```

### Add IP Storage Mappings

```rust
sol_storage! {
    #[entrypoint]
    pub struct YourContract {
        // ... existing storage
        
        // Story Protocol IP Integration
        mapping(uint256 => address) plan_ip_asset;
        mapping(uint256 => string) plan_metadata_uri;
        mapping(address => uint256) ip_asset_royalty_balance;
    }
}
```

### Implement IP Registration Function

```rust
pub fn register_plan_ip_asset(
    &mut self, 
    plan_id: U256, 
    ip_asset_address: Address, 
    metadata_uri: String
) -> Result<bool, YourError> {
    let caller = self.vm().msg_sender();
    
    // Verify ownership
    require!(self.is_plan_owner(caller, plan_id), "Not plan owner");
    
    // Store IP asset reference
    self.plan_ip_asset.insert(plan_id, ip_asset_address);
    self.plan_metadata_uri.insert(plan_id, metadata_uri.clone());
    
    // Emit event
    evm::log(IPAssetRegistered {
        planId: plan_id,
        ipAsset: ip_asset_address,
        metadataURI: metadata_uri
    });
    
    Ok(true)
}
```

## Examples

### Complete Registration Flow

```typescript
// 1. Initialize
const { isInitialized } = useStoryProtocol();

// 2. Register IP
const { registerPlan } = useIPRegistration();
const ipResult = await registerPlan(1, planDetails);

// 3. Attach License
const { attachLicense } = useIPLicense();
await attachLicense(ipResult.ipId);

// 4. Mint License for User
const { mintLicense } = useIPLicense();
await mintLicense(ipResult.ipId, 1);

// 5. Track Royalties
const { royalties, collectRoyalties } = useIPRoyalties(ipResult.ipId);
await collectRoyalties(BigInt(1));
```

### Error Handling

```typescript
const { registerPlan, error } = useIPRegistration();

try {
  const result = await registerPlan(planId, details);
  
  if (!result) {
    console.error('Registration failed:', error);
    // Handle error
  }
} catch (err) {
  console.error('Unexpected error:', err);
}
```

### Loading States

```typescript
function IPComponent() {
  const { isRegistering } = useIPRegistration();
  const { isProcessing } = useIPLicense();
  const { isCollecting } = useIPRoyalties();
  
  const isLoading = isRegistering || isProcessing || isCollecting;
  
  return (
    <div>
      {isLoading && <Spinner />}
      {/* Your component */}
    </div>
  );
}
```

## Best Practices

1. **Always Check Initialization**
   ```typescript
   if (!isInitialized) return <InitializingView />;
   ```

2. **Handle Errors Gracefully**
   ```typescript
   if (error) {
     toast.error(`Failed to register IP: ${error}`);
   }
   ```

3. **Use Loading States**
   ```typescript
   <Button disabled={isRegistering}>
     {isRegistering ? 'Registering...' : 'Register'}
   </Button>
   ```

4. **Store IP References On-Chain**
   - Link IP asset addresses to your entities
   - Emit events for indexing
   - Store metadata URIs

5. **Metadata Best Practices**
   - Use IPFS for decentralized storage
   - Include comprehensive attributes
   - Follow JSON schema standards

## Common Issues

### Issue: "Story Protocol client not initialized"
**Solution**: Ensure `useStoryProtocol()` hook is called and `isInitialized` is true

### Issue: Metadata upload fails
**Solution**: Check Pinata API keys in environment variables

### Issue: Transaction reverts
**Solution**: Verify you're on Story Odyssey Testnet (Chain ID: 1516)

## Resources

- [Story Protocol Documentation](https://docs.story.foundation/)
- [PIL License Documentation](https://docs.story.foundation/docs/pil-flavors)
- [Story Protocol SDK](https://github.com/storyprotocol/sdk)
- [StreamPay Example](https://github.com/Vipul-045/StreamPay-arbitrum)

## Support

For issues or questions:
- GitHub Issues: [StreamPay Repository](https://github.com/Vipul-045/StreamPay-arbitrum/issues)
- Story Protocol Discord: [Join Community](https://discord.gg/storyprotocol)

---

Built for Story Protocol Buildathon - OSS/Dev Tooling Track
