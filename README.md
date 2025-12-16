# StreamPay - Turning Subscriptions into Intellectual Property 💡

## Quick Description ##  
 StreamPay reimagines Web3 subscriptions as on-chain intellectual property using Story Protocol.
Each subscription becomes a licensed IP NFT with programmable rights, derivative tracking, and automatic royalty splits.
Creators monetize fairly, subscribers get provable licenses, and developers integrate seamlessly via plug-and-play SDKs.
Subscriptions that pay, protect, and propagate IP—by default. 

## 🚀 Live on Arbitrum

**Contract Address**: `0xe65365Ea1cfb28dafD5fF6246a2E2A124A13093B`  
**Network**: Arbitrum Chain

---

## 🏆 Story Protocol Buildathon Submission

**Competing in**: OSS/Dev Tooling + IPFi tracks

Hey there! 👋 We took StreamPay, a Web3 subscription platform, and gave it superpowers with Story Protocol. Now every subscription plan isn't just a payment—it's a registered piece of intellectual property with programmable licenses and automated royalties.

### 💭 The Idea

Imagine if your Spotify subscription wasn't just access to music, but actual ownership of a license NFT. Or if your Notion subscription came with commercial rights to the content you create. That's what we're building here—subscriptions that are also IP assets.

### 🎯 What We Built

**For Developers (OSS/Dev Tooling):**
- 🛠️ Plug-and-play React hooks that make Story Protocol integration stupid simple
- 📦 A complete TypeScript SDK wrapper (so you don't have to read the docs... much)
- 🦀 Rust smart contract patterns showing how to track IP on-chain
- 📚 Real documentation that actually helps (we promise!)

**For Creators (IPFi):**
- 🎨 Turn your subscription plans into licensed IP assets on Story Protocol
- ⚡ Set up programmable licenses—commercial use, derivatives, attribution, you name it
- 💰 Automatic royalty splits when someone uses your IP (no spreadsheets needed!)
- 🌳 Track the family tree of derivative works (know who's remixing your stuff)
- 👥 Split revenue fairly among collaborators (finally!)

### 📖 Where to Start

- 📚 [**Read Our Story**](./STORY_PROTOCOL_HACKATHON.md) - Why we built this (start here!)
- ⚡ [**Quick Start**](./QUICKSTART.md) - Running in 5 minutes, we timed it
- 🔧 [**Developer Guide**](./STORY_PROTOCOL_INTEGRATION.md) - Copy our code, make it yours
- 🏗️ [**How It Works**](./ARCHITECTURE.md) - Diagrams! Everyone loves diagrams
- ✅ [**What We Built**](./INTEGRATION_COMPLETE.md) - The full breakdown

### 🏃‍♂️ Try It Right Now

```bash
git clone https://github.com/Akhil-Rawat/StreamPay-Surreal-World-Assets.git
cd StreamPay-Surreal-World-Assets
npm install
npm run dev
# Open http://localhost:5173/ip-registration and see the magic ✨
```

![Quick Setup](https://img.shields.io/badge/Setup-5%20minutes-brightgreen?style=for-the-badge)

---

## ✨ What Makes This Different

**Think About Traditional Subscriptions:**
- You pay monthly for Netflix → Cancel → Everything's gone
- You subscribe to Adobe → Create amazing art → Adobe owns the platform, you own... nothing?
- You pay for API access → Build something cool → No proof you had the license

**Now Think About IP-Powered Subscriptions:**
- Subscribe to a dev tool → Get a license NFT → Tradeable, proveable ownership
- Create content using the tool → Register it as derivative IP → Original creator gets royalties forever
- Sell your creation → Smart contracts automatically split revenue → Everyone wins

That's the future we're building.

---

## 🎨 What You Can Actually Do

**As a Service Provider:**
1. Create your subscription plan (say, premium design tools at 0.05 ETH/month)
2. Register it as IP on Story Protocol with one click
3. Attach a programmable license (commercial use? derivatives? up to you)
4. Subscribers get license NFTs automatically
5. Track everything—usage, derivatives, royalties—all on-chain

**As a Subscriber:**
1. Browse the marketplace, find cool stuff
2. Subscribe and get a license NFT (proof you're legit)
3. Use the tools/content within the license terms
4. Create something derivative? Register it and establish the IP lineage
5. Original creator gets automatic royalty share when you monetize

**As a Developer:**
1. Copy our `useStoryProtocol` hooks into your project
2. Call `registerPlan()` with your subscription details
3. That's it. Seriously. TypeScript will guide you through the rest.

---

## 🛠️ What We Actually Built

## 🛠️ What We Actually Built

### The Hooks (Our Main OSS Contribution)

We built 7 React hooks that make Story Protocol feel like magic:

```typescript
// Initialize Story Protocol (one line!)
const { isInitialized } = useStoryProtocol();

// Register anything as IP
const { registerPlan } = useIPRegistration();
await registerPlan(1, {
  name: "Premium Design Tools",
  description: "Professional design suite",
  price: "0.05",
  interval: "30",
  category: "saas"
});

// Attach licenses, mint NFTs, collect royalties...
const { attachLicense, mintLicense } = useIPLicense();
const { royalties, collectRoyalties } = useIPRoyalties(ipId);
```

Drop these into any React project and boom—IP registration in your app.

### The Smart Contract Magic

Added IP tracking to our Rust/Stylus contract:
- **`register_plan_ip_asset()`** - Links subscription plans to Story Protocol
- **`distribute_ip_royalty()`** - Auto-splits revenue among creators
- **`register_content_ip()`** - Tracks derivative works
- All events indexed, all data on-chain, all transparent

### The UI Experience

- **IP Registration Page** (`/ip-registration`) - Register plans as IP in seconds
- **Provider Dashboard** - Track your IP assets, licenses, and royalties
- **Marketplace** - Subscribe and get license NFTs automatically
- Everything visual, nothing complicated

---

## 🧰 The Tech Stack

**Frontend:**
- React 18 + TypeScript (because types save lives)
- Vite (fast builds = happy devs)
- TailwindCSS (we like pretty things)
- Wagmi + RainbowKit (wallet connections that just work)

**Story Protocol Integration:**
- @story-protocol/core-sdk (the official SDK)
- Our custom hooks layer (the secret sauce)
- IPFS via Pinata (decentralized metadata storage)
- Story Odyssey Testnet (where IP dreams come true)

**Smart Contracts:**
- Arbitrum Stylus (Rust-based contracts)
- Subscription escrow + IP tracking
- Event-driven architecture

---

## 📂 Project Structure

The important stuff (aka where the Story Protocol magic happens):

```
src/
├── hooks/
│   └── useStoryProtocol.ts        # 🌟 The star of the show - our OSS contribution
├── services/
│   └── storyProtocolService.ts    # Core IP logic (registration, licensing, royalties)
├── config/
│   └── storyProtocol.ts          # All the Story Protocol settings
├── pages/
│   └── IPRegistration.tsx        # Where users register IP assets
├── components/
│   └── IPAssetComponents.tsx     # UI for displaying IP data
└── smart-contract/
    └── lib.rs                    # Rust contract with IP tracking
```

**The Rest:**
- Normal subscription stuff in `pages/` (Marketplace, Dashboard, etc.)
- UI components in `components/ui/`
- Wallet hooks and contract interactions
- The usual React app things

---

## 🚀 Getting Started

### What You Need
- Node.js 18+ (the newer the better)
- A wallet (MetaMask works great)
- 5 minutes and a curious mind

### Setup (Copy-Paste Friendly)

```bash
# 1. Clone it
git clone https://github.com/Vipul-045/StreamPay-arbitrum
cd StreamPay-arbitrum

# 2. Install everything
npm install

# 3. Set up your environment
cp .env.example .env
# Add your Pinata keys here (for IPFS storage)
# Get them free at https://app.pinata.cloud/

# 4. Run it!
npm run dev

# 5. Open browser
# http://localhost:5173
```

### Configure Story Network in MetaMask

```
Network Name: Story Odyssey Testnet
RPC URL: https://odyssey.storyrpc.io/
Chain ID: 1516
Currency: IP
Block Explorer: https://explorer.story.foundation
```

Get test tokens from the Story faucet, then you're ready to rock!

---

## 🎮 How to Use It

### Register Your First IP Asset

1. Navigate to `/ip-registration`
2. Fill in your subscription plan details:
   - Name: "Pro Dev Tools"
   - Description: What makes it awesome
   - Price: 0.05 ETH
   - Category: Pick one
3. Click "Register IP Asset"
4. Approve the transaction
5. 🎉 Boom! You've got an IP asset on Story Protocol

### Attach a License

1. After registration, click "Attach License Terms"
2. Approve the transaction
3. Your plan now has programmable licensing
4. Subscribers can mint license NFTs
5. Derivatives can be tracked
6. Royalties flow automatically

### For Developers: Copy Our Code

```typescript
// Literally just copy src/hooks/useStoryProtocol.ts into your project
import { useIPRegistration } from './hooks/useStoryProtocol';

function YourComponent() {
  const { registerPlan, isRegistering } = useIPRegistration();
  
  const handleRegister = async () => {
    const result = await registerPlan(planId, planDetails);
    console.log('IP Asset:', result.ipId);
  };
  
  return <button onClick={handleRegister}>Register IP</button>;
}
```

That's it. We did the hard part.

---

## 💡 Real-World Use Cases

**For SaaS Platforms:**
- Sell your API access as licensed IP
- Track what users build with your tools
- Earn royalties when they monetize their creations
- Fair attribution, automatic revenue splits

**For Content Creators:**
- Package your courses/content as IP
- License them with custom terms (commercial use, derivatives, etc.)
- Earn royalties when people remix your work
- Build a content ecosystem with traceable lineage

**For AI Services:**
- Register your AI models as IP
- License AI-generated outputs
- Track derivative AI creations
- Automated revenue sharing for training data contributors

**For Developer Tools:**
- License your dev tools with usage rights
- Earn from projects built with your tools
- Create an IP-aware developer ecosystem
- Build composable IP building blocks

---

## 🤔 Why This Matters

**The Problem:**
Subscriptions today are just... payments. You pay, you get access, you cancel, it's gone. No proof, no ownership, no rights.

**Our Solution:**
What if every subscription was also an IP asset? With proveable ownership, programmable licenses, and automatic royalties?

**The Impact:**
- Creators get fair compensation through automated royalty flows
- Subscribers own proof of their licenses (tradeable NFTs!)
- Derivatives create IP lineage (family trees of creativity)
- Everything's on-chain and transparent
- Machines can read and verify licenses (hello, AI future!)

This is infrastructure for a world where IP is composable, monetizable, and machine-readable.

---

## 📚 Documentation Deep Dive

We wrote documentation that actually helps (shocking, we know):

- **[STORY_PROTOCOL_HACKATHON.md](./STORY_PROTOCOL_HACKATHON.md)** - Our full hackathon submission. Read this to understand why we built this, what it does, and how it fits the tracks.

- **[QUICKSTART.md](./QUICKSTART.md)** - Literally just follow the steps. 5 minutes from clone to running app. We tested it.

- **[STORY_PROTOCOL_INTEGRATION.md](./STORY_PROTOCOL_INTEGRATION.md)** - Developer guide with code examples. Copy-paste friendly. No PhD required.

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Diagrams showing how everything connects. Visual learners, this one's for you.

- **[INTEGRATION_COMPLETE.md](./INTEGRATION_COMPLETE.md)** - Complete breakdown of what we built and where everything lives.

---

## 🎯 For Hackathon Judges

**OSS/Dev Tooling Track:**
- Check out `src/hooks/useStoryProtocol.ts` - 7 reusable hooks, fully typed, production-ready
- Copy any hook into your project—it just works
- Complete documentation with examples
- Smart contract patterns in `smart-contract/lib.rs`

**IPFi Track:**
- Live demo at `/ip-registration`
- Real IP asset registration with Story Protocol
- Programmable licensing with PIL
- Automated royalty distribution in smart contracts
- Derivative tracking with IP lineage

**What Makes It Special:**
- First IP-powered subscription platform we know of
- Bridges traditional SaaS with Web3 IP infrastructure
- Solves real problems (fair creator compensation, proveable licenses)
- Production-ready code, not just a prototype

---

## 🐛 Troubleshooting

**"Story Protocol client not initialized"**
- Make sure you're connected to Story Odyssey Testnet
- Check that you have test tokens
- Wait for the initialization hook to complete

**IPFS Upload Fails**
- Add your Pinata API keys to `.env`
- Get free keys at https://app.pinata.cloud/
- Check your internet connection

**Transaction Reverts**
- Ensure you're on the right network (Chain ID: 1516)
- Make sure you have enough test tokens
- Try increasing gas limit if needed

**TypeScript Errors**
- Run `npm install` again
- Check Node.js version (18+ required)
- Clear `.next` or `dist` folder and rebuild

---

## 🤝 Contributing

We built this for a hackathon, but we'd love to see it grow!

- Found a bug? Open an issue
- Want to improve something? PRs welcome
- Have ideas? Start a discussion
- Just want to say hi? We're friendly!

---

## 📄 License

MIT License - Use it, modify it, make it yours. Just give us a shoutout if you do something cool with it!

---

## 🙏 Credits & Thanks

**Built with:**
- [Story Protocol](https://story.foundation/) - For making IP programmable
- [Arbitrum](https://arbitrum.io/) - For fast, cheap smart contracts
- [The Graph](https://thegraph.com/) - For indexing our events
- Coffee, late nights, and the power of deadlines

**Special Thanks:**
- Story Protocol team for the amazing infrastructure
- The buildathon organizers for the opportunity
- Everyone who believes subscriptions can be more than just payments

---

## 📧 Connect With Us

- **GitHub**: [@Vipul-045](https://github.com/Vipul-045)
- **Project**: [StreamPay-arbitrum](https://github.com/Vipul-045/StreamPay-arbitrum)
- **Contract**: `FPZJ1WxDRcoipvNSSxFhUys8kqCgKMZ5R81x1REyhCRa` on Story Devnet

Built with ❤️ for the Story Protocol Buildathon

---

## 🚦 What's Next?

**Short Term:**
- Add more license templates
- Improve UI/UX based on feedback
- Write more examples and tutorials
- Deploy to mainnet when Story Protocol launches

**Long Term:**
- Multi-chain IP synchronization
- AI-powered license recommendations
- Advanced royalty waterfall logic
- DAO governance for IP management
- Mobile app for license management

**Dream Big:**
- Make this the standard for IP-powered subscriptions
- Help creators earn what they deserve
- Build an ecosystem where IP is composable
- Change how we think about subscriptions forever

Want to help? Let's build the future together! 🚀

---

## 📜 Manual Smart Contract Testing

For those who want to dive deep into the smart contract...
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Connect your wallet** and explore the platform

## Production Deployment

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy** the `dist` folder to your hosting provider

## Key Integration Points

- **Contract Hooks**: All contract interactions are centralized in `useStreamPayContract`
- **Mock API**: Replace with real API endpoints in `mockApi.ts`
- **Types**: Extend types in `src/types/index.ts` as needed
- **Toast Notifications**: Already configured for success/error feedback

## Design System

- **Colors**: Blue primary (#3B82F6), Purple secondary (#8B5CF6), Green accent (#10B981)
- **Typography**: System fonts with proper hierarchy
- **Spacing**: 8px base grid system
- **Components**: Accessible, consistent UI components
- **Responsive**: Mobile-first design with proper breakpoints

The platform is designed to be production-ready with minimal additional configuration once integrated with your smart contracts and backend services.

# Automation Script using smart contract :

### Step 1: Initialize Contract (Already Done ✅)
```bash
# Initialize the contract - only needed once
cast send 0xe65365Ea1cfb28dafD5fF6246a2E2A124A13093B "initialize()" --private-key YOUR_PRIVATE_KEY --rpc-url https://sepolia-rollup.arbitrum.io/rpc
```

### Step 2: Register as Provider (Already Done ✅)
```bash
# Register yourself as a service provider
cast send 0xe65365Ea1cfb28dafD5fF6246a2E2A124A13093B "registerProvider(string)" "MyProvider" --private-key YOUR_PRIVATE_KEY --rpc-url https://sepolia-rollup.arbitrum.io/rpc
```

### Step 3: Create Plans (Already Done ✅)
```bash
# Plan 1: 0.001 ETH every 60 seconds (for testing)
cast send 0xe65365Ea1cfb28dafD5fF6246a2E2A124A13093B "createPlan(uint256,uint256,string)" 1000000000000000 60 "test-plan-60sec" --private-key YOUR_PRIVATE_KEY --rpc-url https://sepolia-rollup.arbitrum.io/rpc

# Plan 2: 0.01 ETH every 30 days (monthly)
cast send 0xe65365Ea1cfb28dafD5fF6246a2E2A124A13093B "createPlan(uint256,uint256,string)" 10000000000000000 2592000 "monthly-plan" --private-key YOUR_PRIVATE_KEY --rpc-url https://sepolia-rollup.arbitrum.io/rpc
```

### Step 4: Check Available Plans
```bash
# See all available subscription plans
cast call 0xe65365Ea1cfb28dafD5fF6246a2E2A124A13093B "getPlans()" --rpc-url https://sepolia-rollup.arbitrum.io/rpc
```

### Step 5: Deposit Funds to Escrow
```bash
# Deposit 0.015 ETH to your escrow balance (enough for 15 payments of Plan 1)
cast send 0xe65365Ea1cfb28dafD5fF6246a2E2A124A13093B "deposit()" --value 15000000000000000 --private-key YOUR_PRIVATE_KEY --rpc-url https://sepolia-rollup.arbitrum.io/rpc
```

### Step 6: Check Your Balance
```bash
# Check how much you have in escrow
cast call 0xe65365Ea1cfb28dafD5fF6246a2E2A124A13093B "getUserBalance(address)" YOUR_WALLET_ADDRESS --rpc-url https://sepolia-rollup.arbitrum.io/rpc
```

### Step 7: Subscribe to Plan 1 (60-second interval)
```bash
# Subscribe to Plan 1 - this auto-pays the first payment
cast send 0xe65365Ea1cfb28dafD5fF6246a2E2A124A13093B "subscribe(uint256)" 1 --private-key YOUR_PRIVATE_KEY --rpc-url https://sepolia-rollup.arbitrum.io/rpc
```
### Step 8 : Automation -  Go to Gelato UI https://app.gelato.cloud/dashboard 
```bash
Connect Wallet 
Go to More -> Functions -> New -> Time Interval -> 30 seconds -> Transactions -> Contract Adress:0xe65365Ea1cfb28dafD5fF6246a2E2A124A13093B -> CustomABI json file(in our repo) -> ProcessSubscriptionPayment(uint256) -> Subscription_id = 3 (because 1 and 2 already registered in our contract ) -> enter task name and ->create -> Automation started :> 

```

### Step 9: Check Balance After Payments
```bash
# See your remaining escrow balance after payments
cast call 0xe65365Ea1cfb28dafD5fF6246a2E2A124A13093B "getUserBalance(address)" YOUR_WALLET_ADDRESS --rpc-url https://sepolia-rollup.arbitrum.io/rpc
```

### Step 10: Withdraw Remaining Funds
```bash
# Withdraw 0.005 ETH from your escrow balance
cast send 0xe65365Ea1cfb28dafD5fF6246a2E2A124A13093B "withdraw(uint256)" 5000000000000000 --private-key YOUR_PRIVATE_KEY --rpc-url https://sepolia-rollup.arbitrum.io/rpc
```

## 📊 Current Test Status

✅ **Active Subscription**: ID `2` (60-second plan)  
✅ **Test Wallet**: `0xB6041EF165C65260f03C1D114fCc36e37971958C`  
✅ **Plan 1**: 0.001 ETH every 60 seconds  
✅ **Next Payment**: Every 60 seconds after last payment  

## 🔄 Testing Recurring Payments

To test the recurring payment system:

1. **Subscribe** (Step 7) - First payment happens automatically
2. **Wait 60+ seconds**
3. **Process Payment** (Step 8) - Second payment  
4. **Wait 60+ seconds**
5. **Process Payment** (Step 8) - Third payment
6. **Repeat** until balance runs out
