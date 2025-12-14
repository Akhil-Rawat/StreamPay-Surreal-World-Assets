# StreamPay x Story Protocol - Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         StreamPay Frontend                          │
│                    (React + TypeScript + Vite)                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐ │
│  │  IP Registration │  │  Provider        │  │   Marketplace    │ │
│  │      Page        │  │   Dashboard      │  │                  │ │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘ │
│           │                     │                      │           │
│           └─────────────────────┼──────────────────────┘           │
│                                 │                                  │
│  ┌──────────────────────────────┼──────────────────────────────┐  │
│  │         Story Protocol Hooks (OSS/Dev Tooling)              │  │
│  │  • useStoryProtocol()  • useIPRegistration()               │  │
│  │  • useIPLicense()      • useIPRoyalties()                  │  │
│  │  • useIPDerivatives()  • useIPAsset()                      │  │
│  └──────────────────────────────┼──────────────────────────────┘  │
│                                 │                                  │
│  ┌──────────────────────────────┼──────────────────────────────┐  │
│  │         Story Protocol Service Layer                        │  │
│  │  • registerSubscriptionAsIP()                               │  │
│  │  • attachLicenseTerms()                                     │  │
│  │  • mintLicense()                                            │  │
│  │  • collectRoyalties()                                       │  │
│  │  • registerDerivative()                                     │  │
│  └──────────────────────────────┼──────────────────────────────┘  │
│                                 │                                  │
└─────────────────────────────────┼──────────────────────────────────┘
                                  │
                 ┌────────────────┴────────────────┐
                 │                                 │
                 ▼                                 ▼
    ┌────────────────────────┐      ┌────────────────────────┐
    │   Story Protocol       │      │   Arbitrum Stylus      │
    │   (Story Network)      │      │   (Arbitrum Sepolia)   │
    │   Chain ID: 1516       │      │                        │
    ├────────────────────────┤      ├────────────────────────┤
    │                        │      │                        │
    │ • IP Asset Registry    │      │ • Subscription Escrow  │
    │ • Licensing Module     │◄─────┤ • Plan Management      │
    │ • Royalty Module       │      │ • Payment Processing   │
    │ • PIL Template         │      │ • IP Asset Tracking    │
    │                        │      │                        │
    └────────────┬───────────┘      └────────────┬───────────┘
                 │                               │
                 │                               │
                 ▼                               ▼
    ┌────────────────────────┐      ┌────────────────────────┐
    │   IPFS (Pinata)        │      │   The Graph            │
    │                        │      │                        │
    │ • IP Metadata Storage  │      │ • Event Indexing       │
    │ • License Documents    │      │ • Subscription Data    │
    │ • Content Provenance   │      │ • Payment History      │
    └────────────────────────┘      └────────────────────────┘
```

## Data Flow - IP Registration

```
┌─────────────┐
│   Provider  │
│   Creates   │
│    Plan     │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│ 1. Call registerPlan() with plan details               │
│    - name, description, price, interval, category       │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│ 2. Create IP Metadata JSON                             │
│    {                                                    │
│      "title": "Premium Dev Tools",                      │
│      "ipType": "subscription_plan",                     │
│      "creators": [{ name, address, contribution }],     │
│      "attributes": [{ trait_type, value }]              │
│    }                                                    │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│ 3. Upload to IPFS via Pinata                           │
│    → Returns IPFS Hash (QmXxxx...)                      │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│ 4. Register IP Asset on Story Protocol                 │
│    Story.ipAsset.register({                            │
│      nftContract, tokenId, metadataURI                 │
│    })                                                   │
│    → Returns IP Asset ID (0xabc...)                     │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│ 5. Store IP Asset reference in Arbitrum contract       │
│    register_plan_ip_asset(planId, ipAssetId, uri)      │
│    → Emits IPAssetRegistered event                     │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────┐
│ IP Asset    │
│ Registered! │
│ ✓           │
└─────────────┘
```

## Licensing Flow

```
┌──────────────┐
│   Provider   │
│   Attaches   │
│   License    │
└──────┬───────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│ 1. Define License Terms (PIL)                           │
│    {                                                    │
│      commercialUse: true,                               │
│      derivativesAllowed: true,                          │
│      royaltyPolicy: ROYALTY_POLICY_LAP,                 │
│      defaultMintingFee: "0.01 ETH"                      │
│    }                                                    │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│ 2. Attach License to IP Asset                          │
│    Story.license.attachLicenseTerms({                  │
│      ipId, licenseTemplate, licenseTermsId             │
│    })                                                   │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│ 3. Record in Smart Contract                            │
│    record_license_attachment(ipAsset, termsId)         │
│    → Emits IPLicenseAttached event                     │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌──────────────┐
│   Licensed   │
│   IP Asset   │
│   ✓          │
└──────────────┘
```

## Subscription + License Minting Flow

```
┌──────────────┐
│   User       │
│   Subscribes │
└──────┬───────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│ 1. User deposits funds to escrow (Arbitrum)            │
│    deposit() → Stores balance in contract              │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│ 2. Subscribe to plan (Arbitrum)                        │
│    subscribe(planId)                                    │
│    → Deducts price from escrow                          │
│    → Transfers payment to provider                      │
│    → Emits SubscriptionCreated event                    │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│ 3. Mint License NFT (Story Protocol)                   │
│    Story.license.mintLicenseTokens({                   │
│      licensorIpId, receiver, amount                    │
│    })                                                   │
│    → Mints License Token to user                        │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│ 4. Record license mint (Arbitrum)                      │
│    record_license_mint(ipAsset, licensee, tokenId)     │
│    → Emits IPLicenseMinted event                       │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌──────────────┐
│   User has   │
│   License!   │
│   ✓          │
└──────────────┘
```

## Royalty Distribution Flow (IPFi)

```
┌──────────────────┐
│   Revenue        │
│   Generated      │
│   from Usage     │
└────────┬─────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ 1. Collect Royalties from Story Protocol               │
│    Story.royalty.collectRoyaltyTokens({                │
│      parentIpId, snapshotId                            │
│    })                                                   │
│    → Returns amounts claimed                            │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│ 2. Distribute to collaborators (Smart Contract)        │
│    distribute_ip_royalty(ipAsset, recipient, amount)   │
│    → Splits revenue based on contribution %             │
└──────┬──────────────────────────────────────────────────┘
       │
       ├─────────────────┬─────────────────┬──────────────┐
       ▼                 ▼                 ▼              ▼
  ┌─────────┐      ┌─────────┐      ┌─────────┐    ┌─────────┐
  │Creator 1│      │Creator 2│      │Creator 3│    │Platform │
  │  40%    │      │  30%    │      │  20%    │    │  10%    │
  └─────────┘      └─────────┘      └─────────┘    └─────────┘
       │                 │                 │              │
       └─────────────────┴─────────────────┴──────────────┘
                                 │
                                 ▼
                    ┌───────────────────────┐
                    │  IPRoyaltyPaid Events │
                    │  On-chain tracking    │
                    └───────────────────────┘
```

## Derivative Work Flow

```
┌──────────────────┐
│   User creates   │
│   content using  │
│   subscribed     │
│   service        │
└────────┬─────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ 1. User registers their content as IP                  │
│    Story.ipAsset.register({                            │
│      nftContract, tokenId, metadata                    │
│    })                                                   │
│    → Returns Child IP Asset ID                          │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│ 2. Register as derivative of subscription plan IP      │
│    Story.ipAsset.registerDerivative({                  │
│      childIpId, parentIpIds, licenseTermsIds           │
│    })                                                   │
│    → Creates IP lineage relationship                    │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│ 3. Record in smart contract                            │
│    register_content_ip(subscriptionId, contentIpAsset) │
│    → Emits ContentIPRegistered event                   │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│ 4. Royalties from derivative flow to parent           │
│    Automatic revenue share to original plan creator    │
│    Based on PIL license terms                           │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────┐
│   IP Lineage     │
│   Established    │
│   ✓              │
└──────────────────┘
```

## Technology Stack

```
┌────────────────────────────────────────────────┐
│              Frontend Layer                    │
├────────────────────────────────────────────────┤
│ • React 18 + TypeScript                       │
│ • Vite (Build tool)                            │
│ • TailwindCSS (Styling)                        │
│ • Wagmi + RainbowKit (Wallet)                  │
│ • React Router (Navigation)                    │
│ • React Hot Toast (Notifications)              │
└────────────────┬───────────────────────────────┘
                 │
┌────────────────┴───────────────────────────────┐
│         Story Protocol Integration             │
├────────────────────────────────────────────────┤
│ • @story-protocol/core-sdk                     │
│ • @story-protocol/react-sdk                    │
│ • Custom hooks (OSS contribution)              │
│ • Service layer abstraction                    │
│ • TypeScript interfaces                        │
└────────────────┬───────────────────────────────┘
                 │
┌────────────────┴───────────────────────────────┐
│           Blockchain Layer                     │
├────────────────────────────────────────────────┤
│ • Story Protocol (IP Registry)                 │
│   - IP Asset Registry                          │
│   - Licensing Module (PIL)                     │
│   - Royalty Module (LAP)                       │
│                                                │
│ • Arbitrum Stylus (Smart Contracts)            │
│   - Rust-based contracts                       │
│   - Subscription management                    │
│   - IP tracking                                │
│   - Escrow system                              │
└────────────────┬───────────────────────────────┘
                 │
┌────────────────┴───────────────────────────────┐
│          Storage & Indexing                    │
├────────────────────────────────────────────────┤
│ • IPFS (Pinata) - Metadata storage            │
│ • The Graph - Event indexing                   │
│ • On-chain storage - Critical data             │
└────────────────────────────────────────────────┘
```

## Key Features by Track

### OSS/Dev Tooling Track

```
├── src/hooks/useStoryProtocol.ts
│   ├── useStoryProtocol()       → Client initialization
│   ├── useIPRegistration()      → Register IP assets
│   ├── useIPLicense()           → Manage licenses
│   ├── useIPDerivatives()       → Track derivatives
│   ├── useIPRoyalties()         → Collect royalties
│   ├── useIPAsset()             → Fetch IP data
│   └── useHasLicense()          → Verify ownership
│
├── src/services/storyProtocolService.ts
│   ├── registerSubscriptionAsIP()
│   ├── attachLicenseTerms()
│   ├── mintLicense()
│   ├── collectRoyalties()
│   └── registerDerivative()
│
└── Documentation
    ├── STORY_PROTOCOL_INTEGRATION.md
    ├── QUICKSTART.md
    └── Code examples
```

### IPFi Track

```
├── Smart Contract (lib.rs)
│   ├── register_plan_ip_asset()     → Link IP to plans
│   ├── distribute_ip_royalty()      → Revenue splits
│   ├── record_license_mint()        → Track licenses
│   └── register_content_ip()        → Derivative tracking
│
├── Royalty System
│   ├── Automated collection
│   ├── Multi-recipient splits
│   ├── On-chain accounting
│   └── Transparent distribution
│
└── Licensing Framework
    ├── PIL integration
    ├── Commercial rights
    ├── Derivative permissions
    └── Custom terms
```

---

**Built for Story Protocol Buildathon**
Tracks: OSS/Dev Tooling + IPFi
