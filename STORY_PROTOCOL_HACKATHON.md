# StreamPay x Story Protocol - IP-Powered Subscriptions

## 🏆 Story Protocol Hackathon Submission

**Tracks**: OSS/Dev Tooling + IPFi (Intellectual Property Finance)

StreamPay transforms subscription-based payments into a comprehensive IP licensing and monetization platform by integrating Story Protocol. We're exploring the future of IP in an AI-driven world where digital services, content, and tools need programmable licensing and automated royalty distribution.

---

## 🎯 Hackathon Alignment

### **OSS/Dev Tooling Track**
We've built reusable, open-source developer tools for integrating Story Protocol into subscription platforms:

- **Reusable React Hooks** (`useStoryProtocol.ts`) - Production-ready hooks for IP registration, licensing, and royalty management
- **TypeScript SDK Integration** - Complete wrapper around Story Protocol's core SDK with type-safe interfaces
- **Smart Contract Patterns** - Stylus smart contracts demonstrating IP asset tracking in subscription systems
- **Developer Documentation** - Comprehensive guides for integrating IP registration into payment platforms

### **IPFi (IP Finance) Track**
We're revolutionizing how creators monetize their work through programmable IP:

- **Subscription Plans as IP Assets** - Each plan becomes a registered, licensable IP on Story Protocol
- **Automated Royalty Distribution** - Smart contract-based royalty splits for content collaborators
- **Derivative Work Tracking** - Content created using subscribed services forms an IP lineage
- **Programmable Licensing** - PIL (Programmable IP License) enables commercial use and derivatives
- **Revenue Streams** - Multiple monetization paths: subscriptions + licensing + royalties

---

## 🌟 What We Built

### 1. **IP Registration System**
Transform any subscription plan into a Story Protocol IP asset:

```typescript
// Register a subscription plan as IP
const { ipId, tokenId, txHash } = await registerPlan(planId, {
  name: "Premium Dev Tools",
  description: "Advanced development toolkit",
  price: "0.05",
  interval: "30",
  category: "saas"
});
```

**Key Features:**
- IPFS metadata storage with Pinata integration
- On-chain IP provenance tracking
- Automatic metadata URI generation
- Multi-chain support (Arbitrum + Story Network)

### 2. **Programmable Licensing Framework**
Attach customizable license terms to IP assets:

```typescript
// Attach PIL license terms
await attachLicense(ipId, {
  commercialUse: true,
  derivativesAllowed: true,
  royaltyPolicy: ROYALTY_POLICY_LAP,
  defaultMintingFee: "0.01"
});
```

**License Capabilities:**
- Commercial use rights
- Derivative creation permissions
- Attribution requirements
- Reciprocal licensing
- Custom royalty policies

### 3. **Automated Royalty Distribution (IPFi)**
Smart contract-based royalty management:

```typescript
// Collect IP royalties
const { amountsClaimed, txHash } = await collectRoyalties(ipId, snapshotId);

// Distribute royalties to collaborators
await distributeIPRoyalty(ipAsset, recipient, amount);
```

**Royalty Features:**
- Automated payment splits
- On-chain revenue tracking
- Transparent distribution logs
- Creator attribution
- Multi-recipient support

### 4. **Derivative Work Registration**
Track content created using subscribed services:

```typescript
// Register user-created content as derivative IP
await registerDerivative(childIpId, [parentIpId], [licenseTermsId]);
```

**Use Cases:**
- AI-generated content from subscribed tools
- Videos created with licensed software
- Code generated from dev tools
- Remixes and derivatives

### 5. **Developer-Friendly Hooks (OSS)**
Production-ready React hooks for Story Protocol:

```typescript
// Easy-to-use hooks
const { registerPlan, isRegistering } = useIPRegistration();
const { attachLicense, mintLicense } = useIPLicense();
const { royalties, collectRoyalties } = useIPRoyalties(ipId);
const { ipAsset, isLoading } = useIPAsset(ipId);
```

---

## 🏗️ Technical Architecture

### **Frontend Stack**
- React 18 + TypeScript + Vite
- Story Protocol Core SDK
- Wagmi + RainbowKit for wallet integration
- TailwindCSS for UI

### **Smart Contract** (Arbitrum Stylus)
- Rust-based subscription management
- IP asset tracking storage
- Royalty distribution logic
- Event emission for indexing

### **Story Protocol Integration**
- IP Asset Registry
- Licensing Module (PIL)
- Royalty Module (LAP)
- IPFS metadata storage

### **Data Flow**
```
1. Provider creates subscription plan → Arbitrum contract
2. Plan registered as IP asset → Story Protocol
3. License terms attached → PIL template
4. User subscribes → Mints license NFT
5. User creates content → Registers derivative IP
6. Royalties flow → Automated distribution
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MetaMask or compatible Web3 wallet
- Access to Story Odyssey Testnet

### Installation

```bash
# Clone the repository
git clone https://github.com/Vipul-045/StreamPay-arbitrum
cd StreamPay-arbitrum

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Add your Pinata keys for IPFS storage
VITE_PINATA_API_KEY=your_api_key
VITE_PINATA_SECRET_KEY=your_secret_key

# Run development server
npm run dev
```

### Story Protocol Setup

1. **Connect to Story Network**
   - Network: Story Odyssey Testnet
   - Chain ID: 1516
   - RPC: https://odyssey.storyrpc.io/

2. **Get Testnet Tokens**
   - Visit Story faucet for test tokens

3. **Register Your First IP**
   - Navigate to IP Registration page
   - Fill in plan details
   - Click "Register IP Asset"
   - Attach license terms

---

## 📚 Use Cases

### **For Content Creators**
- Register courses/content as IP
- Earn royalties from derivatives
- License work for commercial use
- Track content usage on-chain

### **For SaaS Providers**
- Monetize API access as licensed IP
- Revenue share with affiliates
- Track tool-generated content
- Enable commercial licensing

### **For Developers**
- License dev tools with usage rights
- Earn from code generated by tools
- Build IP-aware applications
- Create composable IP ecosystems

### **For AI Services**
- Register AI models as IP
- License AI-generated content
- Track derivative outputs
- Automated royalty splits

---

## 🎨 Key Files

### Story Protocol Integration
- `src/config/storyProtocol.ts` - Configuration and types
- `src/services/storyProtocolService.ts` - Core service layer
- `src/hooks/useStoryProtocol.ts` - React hooks (OSS contribution)
- `src/pages/IPRegistration.tsx` - IP registration UI
- `src/components/IPAssetComponents.tsx` - Reusable IP components

### Smart Contract
- `smart-contract/lib.rs` - Stylus contract with IP integration
- Functions: `register_plan_ip_asset`, `distribute_ip_royalty`, `register_content_ip`

---

## 🔑 Story Protocol Features Used

1. **IP Asset Registry** - Register subscription plans as IP
2. **PIL (Programmable IP License)** - Attach customizable license terms
3. **Royalty Module** - Automated royalty collection and distribution
4. **License NFTs** - Mint tradeable licenses for subscribers
5. **Derivative Registration** - Track IP lineage and relationships

---

## 💡 Innovation Highlights

### **Hybrid Escrow + IP Licensing**
Combines traditional subscription escrow with Story Protocol licensing:
- Users deposit funds → escrow contract
- Subscribe to plan → mints license NFT
- Payments processed → royalties distributed
- Create content → registers derivative IP

### **Programmable Royalty Splits**
Automatic revenue distribution to multiple creators:
```rust
// Smart contract royalty distribution
distribute_ip_royalty(ip_asset, recipient, amount);
```

### **Cross-Chain IP Tracking**
- Subscriptions on Arbitrum (low fees)
- IP registration on Story Network (specialized IP infrastructure)
- Cross-chain events and synchronization

### **Machine-Readable IP**
All IP metadata stored in structured JSON on IPFS:
```json
{
  "title": "Premium Dev Tools",
  "ipType": "subscription_plan",
  "creators": [...],
  "attributes": [...]
}
```

---

## 🌍 Real-World Impact

### **For the AI-Driven World**
- AI tools can check license validity on-chain
- Automated royalty payments for AI-generated content
- Programmable IP rights for machine learning models
- Transparent attribution and provenance

### **For Creators**
- Fair compensation through automated royalties
- Control over commercial use rights
- Derivative work monetization
- On-chain proof of creation

### **For the Ecosystem**
- Composable IP building blocks
- Open-source developer tools
- Standardized licensing frameworks
- Cross-platform IP interoperability

---

## 📊 Demo Flow

1. **Provider Registration**
   - Provider registers on StreamPay
   - Creates subscription plan
   - Registers plan as IP on Story Protocol
   - Attaches PIL license terms

2. **Subscriber Journey**
   - User browses marketplace
   - Subscribes to plan → mints license NFT
   - Gains access to licensed tools/content
   - Creates derivative work

3. **Derivative Creation**
   - User creates content using subscribed service
   - Registers creation as derivative IP
   - Establishes IP lineage to parent plan
   - Enables royalty flow back to original creator

4. **Royalty Distribution**
   - Revenue generated from derivatives
   - Automatic split to original creator
   - On-chain transparent accounting
   - Claimable through smart contract

---

## 🛠️ Developer Resources

### **Reusable Hooks** (Open Source Contribution)
Copy `src/hooks/useStoryProtocol.ts` into your project for instant Story Protocol integration:

```typescript
import { useIPRegistration, useIPLicense, useIPRoyalties } from './hooks/useStoryProtocol';

// In your component
const { registerPlan, isRegistering } = useIPRegistration();
const { royalties, collectRoyalties } = useIPRoyalties(ipId);
```

### **Smart Contract Patterns**
Reference `smart-contract/lib.rs` for IP integration patterns:
- Event emission for IP events
- Storage mapping for IP assets
- Royalty distribution logic

### **Integration Guide**
See `STORY_PROTOCOL_INTEGRATION.md` for step-by-step integration instructions.

---

## 🔮 Future Enhancements

- [ ] Multi-chain IP synchronization
- [ ] AI-powered license recommendation
- [ ] Automated derivative detection
- [ ] NFT-gated subscription access
- [ ] DAO governance for IP management
- [ ] Advanced royalty waterfall logic
- [ ] IP analytics dashboard
- [ ] Cross-platform license portability

---

## 📄 License

This project is licensed under MIT License - see LICENSE file for details.

The Story Protocol integration demonstrates:
- **OSS/Dev Tooling**: Reusable hooks, SDKs, and developer resources
- **IPFi**: Programmable royalties, automated licensing, and IP monetization

---

## 🙏 Acknowledgments

- **Story Protocol** - For pioneering programmable IP infrastructure
- **Arbitrum** - For scalable smart contract execution with Stylus
- **The Graph** - For event indexing (subgraph integration)

---

## 📧 Contact

- GitHub: [@Vipul-045](https://github.com/Vipul-045)
- Project: [StreamPay-arbitrum](https://github.com/Vipul-045/StreamPay-arbitrum)

---

## 🎯 Hackathon Submission Summary

**What we built:**
1. ✅ Reusable Story Protocol integration hooks (OSS)
2. ✅ IP registration system for subscriptions
3. ✅ Programmable licensing framework
4. ✅ Automated royalty distribution (IPFi)
5. ✅ Derivative work tracking
6. ✅ Smart contract IP patterns
7. ✅ Complete developer documentation

**Tracks:**
- 🔧 **OSS/Dev Tooling** - Production-ready hooks, SDKs, and integration patterns
- 💰 **IPFi** - Programmable royalties, automated licensing, IP monetization

**Innovation:**
Combining subscription payments with Story Protocol's IP infrastructure to create the first IP-powered subscription platform where every plan is a licensed asset, every payment generates royalties, and every creation forms an IP lineage.

---

Built with ❤️ for Story Protocol Buildathon
