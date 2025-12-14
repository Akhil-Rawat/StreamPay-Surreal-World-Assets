# 🚀 Quick Start - Story Protocol Integration

Get StreamPay's IP-powered subscription platform running in 5 minutes!

## Prerequisites

- Node.js 18+
- MetaMask or Web3 wallet
- Story Odyssey Testnet access

## Installation

```bash
# Clone the repository
git clone https://github.com/Vipul-045/StreamPay-arbitrum
cd StreamPay-arbitrum

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

## Configure Story Protocol

### 1. Get Pinata API Keys (for IPFS)

1. Visit https://app.pinata.cloud/
2. Sign up for free account
3. Generate API key
4. Add to `.env`:

```env
VITE_PINATA_API_KEY=your_api_key
VITE_PINATA_SECRET_KEY=your_secret_key
```

### 2. Setup Story Network

Add Story Odyssey Testnet to MetaMask:
- **Network Name**: Story Odyssey Testnet
- **RPC URL**: https://odyssey.storyrpc.io/
- **Chain ID**: 1516
- **Currency**: IP
- **Explorer**: https://explorer.story.foundation

### 3. Get Testnet Tokens

Visit Story faucet to get test tokens.

## Run the Application

```bash
npm run dev
```

Visit http://localhost:5173

## Test Story Protocol Features

### 1. Register an IP Asset

```
Navigate to: /ip-registration

1. Fill in plan details:
   - Name: "Premium Dev Tools"
   - Description: "Advanced development toolkit"
   - Price: "0.05"
   - Category: "saas"

2. Click "Register IP Asset"
3. Approve transaction in MetaMask
4. Copy your IP Asset ID
```

### 2. Attach License Terms

```
1. After registration, click "Attach License Terms"
2. Approve transaction
3. View license details on Story Explorer
```

### 3. View Provider Dashboard

```
Navigate to: /provider

- See IP-enabled subscription plans
- View IP Asset IDs
- Track royalty earnings
- Manage licenses
```

## For Developers

### Use the Reusable Hooks

```typescript
import { 
  useStoryProtocol, 
  useIPRegistration, 
  useIPLicense,
  useIPRoyalties 
} from './hooks/useStoryProtocol';

function MyComponent() {
  // Initialize
  const { isInitialized } = useStoryProtocol();
  
  // Register IP
  const { registerPlan } = useIPRegistration();
  
  // Manage licenses
  const { attachLicense, mintLicense } = useIPLicense();
  
  // Track royalties
  const { royalties, collectRoyalties } = useIPRoyalties(ipId);
  
  // Use in your app!
}
```

### Integration Pattern

```typescript
// 1. Register Plan as IP
const result = await registerPlan(planId, {
  name: "My Plan",
  description: "Description",
  price: "0.05",
  interval: "30",
  category: "saas"
});

// 2. Attach License
await attachLicense(result.ipId);

// 3. Mint License for User
await mintLicense(result.ipId, 1);

// 4. Collect Royalties
await collectRoyalties(result.ipId, BigInt(1));
```

## Smart Contract Testing

### View IP Functions

```bash
# Open the Rust smart contract
code smart-contract/lib.rs

# Key functions:
- register_plan_ip_asset()
- record_license_attachment()
- record_license_mint()
- distribute_ip_royalty()
- register_content_ip()
```

### Deploy Contract (Optional)

```bash
cd smart-contract
./deploy.sh
```

## Documentation

- **Hackathon Overview**: [STORY_PROTOCOL_HACKATHON.md](./STORY_PROTOCOL_HACKATHON.md)
- **Integration Guide**: [STORY_PROTOCOL_INTEGRATION.md](./STORY_PROTOCOL_INTEGRATION.md)
- **Checklist**: [HACKATHON_CHECKLIST.md](./HACKATHON_CHECKLIST.md)

## Key Files to Review

### Story Protocol Integration
```
src/
├── config/
│   └── storyProtocol.ts          # Configuration
├── services/
│   └── storyProtocolService.ts   # Core service
├── hooks/
│   └── useStoryProtocol.ts       # Reusable hooks
├── pages/
│   └── IPRegistration.tsx        # IP UI
└── components/
    └── IPAssetComponents.tsx     # IP components
```

### Smart Contract
```
smart-contract/
└── lib.rs                         # IP integration
```

## Troubleshooting

### "Story Protocol client not initialized"
- Ensure wallet is connected to Story Odyssey Testnet
- Check `isInitialized` state before using features

### IPFS Upload Fails
- Verify Pinata API keys in `.env`
- Check internet connection

### Transaction Reverts
- Ensure you have Story testnet tokens
- Verify you're on correct network (Chain ID: 1516)

### Type Errors
- Run `npm install` to ensure all types are installed
- Check TypeScript version compatibility

## Demo Flow for Hackathon Judges

### Complete Walkthrough (5 min)

1. **Start App** (30s)
   ```bash
   npm run dev
   ```

2. **Connect Wallet** (30s)
   - Connect to Story Odyssey Testnet
   - Ensure you have test tokens

3. **Register IP Asset** (2 min)
   - Navigate to `/ip-registration`
   - Fill form and register
   - View IP Asset ID

4. **Attach License** (1 min)
   - Click "Attach License Terms"
   - Approve transaction

5. **View Integration** (1 min)
   - Check provider dashboard
   - See IP components
   - Review smart contract code

## What to Highlight

### OSS/Dev Tooling
✅ Reusable hooks - copy into any React app
✅ TypeScript support - full type safety
✅ Documentation - comprehensive guides
✅ Examples - ready-to-use patterns

### IPFi
✅ IP registration - plans become licensed assets
✅ Programmable licensing - PIL integration
✅ Automated royalties - smart contract distribution
✅ Derivative tracking - IP lineage

## Support

- **GitHub Issues**: https://github.com/Vipul-045/StreamPay-arbitrum/issues
- **Story Discord**: https://discord.gg/storyprotocol
- **Documentation**: https://docs.story.foundation/

---

**Ready in 5 minutes!** 🎉

Built for Story Protocol Buildathon
