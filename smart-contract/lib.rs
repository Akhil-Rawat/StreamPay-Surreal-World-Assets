
#![cfg_attr(not(any(feature = "export-abi", test)), no_main)]
extern crate alloc;
use alloc::{string::String, vec::Vec};

use stylus_sdk::{
    alloy_primitives::{Address, U256}, 
    prelude::*,
    alloy_sol_types::sol,
    evm,
};
sol! {
    error Unauthorized();
    error InvalidInput();
    error InsufficientFunds();
    error NotFound();
}

sol! {
    event ProviderRegistered(address indexed provider, string name);
    event PlanCreated(uint256 indexed planId, address indexed provider, uint256 price, uint256 interval);
    event SubscriptionCreated(uint256 indexed subscriptionId, address indexed user, uint256 indexed planId);
    event PaymentProcessed(address indexed from, address indexed to, uint256 amount, uint256 indexed subscriptionId);
    event ProviderEarnings(address indexed provider, uint256 indexed planId, uint256 amount);
    event EscrowDeposit(address indexed user, uint256 amount, uint256 newBalance);
    event EscrowWithdrawal(address indexed user, uint256 amount, uint256 newBalance);
    
    // Story Protocol IP Integration Events
    event IPAssetRegistered(uint256 indexed planId, address indexed ipAsset, string metadataURI);
    event IPLicenseAttached(address indexed ipAsset, uint256 indexed licenseTermsId);
    event IPLicenseMinted(address indexed ipAsset, address indexed licensee, uint256 indexed tokenId);
    event IPRoyaltyPaid(address indexed ipAsset, address indexed recipient, uint256 amount);
    event ContentIPRegistered(uint256 indexed subscriptionId, address indexed contentCreator, address indexed ipAsset);
}

#[derive(SolidityError)]
pub enum SubscriptionError {
    Unauthorized(Unauthorized),
    InvalidInput(InvalidInput),
    InsufficientFunds(InsufficientFunds),
    NotFound(NotFound),
}

sol_storage! {
    #[entrypoint]
    pub struct SubscriptionEscrow {
        address admin;
        uint256 protocol_fee_percentage;
        
        uint256 next_plan_id;
        uint256 next_subscription_id;
        
        mapping(address => bool) registered_providers;
        
        mapping(uint256 => address) plan_provider;
        mapping(uint256 => uint256) plan_price;
        mapping(uint256 => uint256) plan_interval;
        
        mapping(uint256 => uint256) subscription_plan_id;
        mapping(uint256 => address) subscription_subscriber;
        mapping(uint256 => uint256) subscription_last_payment;
        mapping(uint256 => bool) subscription_active;
        
        mapping(address => uint256) user_escrow_balance;
        
        // Story Protocol IP Integration Storage
        mapping(uint256 => address) plan_ip_asset;
        mapping(uint256 => string) plan_metadata_uri;
        mapping(address => uint256) ip_asset_royalty_balance;
        mapping(uint256 => address) subscription_content_ip;
        mapping(address => bool) ip_license_holders;
    }
}

#[public]
impl SubscriptionEscrow {
    
    pub fn initialize(&mut self) -> Result<bool, SubscriptionError> {
        if self.admin.get() != Address::ZERO {
            return Err(SubscriptionError::InvalidInput(InvalidInput {}));
        }
        
        let caller = self.vm().msg_sender();
        self.admin.set(caller);
        self.next_plan_id.set(U256::from(1));
        self.next_subscription_id.set(U256::from(1));
        self.protocol_fee_percentage.set(U256::from(250));
        
        Ok(true)
    }
    
    pub fn register_provider(&mut self, name: String) -> Result<bool, SubscriptionError> {
        let caller = self.vm().msg_sender();
        
        // Check if name is too long
        if name.len() > 100 {
            return Err(SubscriptionError::InvalidInput(InvalidInput {}));
        }
        
        // Check if already registered
        if self.registered_providers.get(caller) {
            return Err(SubscriptionError::InvalidInput(InvalidInput {}));
        }
        
        // Register the provider
        self.registered_providers.insert(caller, true);
        
        evm::log(ProviderRegistered { 
            provider: caller, 
            name: name 
        });
        
        Ok(true)
    }
    
    pub fn create_plan(&mut self, price: U256, interval: U256, _metadata_hash: String) -> Result<U256, SubscriptionError> {
        let caller = self.vm().msg_sender();
        self.require_registered_provider(caller)?;
        
        if price.is_zero() || interval.is_zero() {
            return Err(SubscriptionError::InvalidInput(InvalidInput {}));
        }
        
        let plan_id = self.next_plan_id.get();
        
        self.plan_provider.insert(plan_id, caller);
        self.plan_price.insert(plan_id, price);
        self.plan_interval.insert(plan_id, interval);
        
        self.next_plan_id.set(plan_id + U256::from(1));
        
        evm::log(PlanCreated {
            planId: plan_id,
            provider: caller,
            price: price,
            interval: interval
        });
        
        Ok(plan_id)
    }
    
    #[payable]
    pub fn subscribe(&mut self, plan_id: U256) -> Result<U256, SubscriptionError> {
        let caller = self.vm().msg_sender();
        let payment = self.vm().msg_value();
        
        let plan_provider = self.plan_provider.get(plan_id);
        if plan_provider == Address::ZERO {
            return Err(SubscriptionError::NotFound(NotFound {}));
        }
        
        let plan_price = self.plan_price.get(plan_id);
        
        if payment > U256::ZERO {
            let current_balance = self.user_escrow_balance.get(caller);
            self.user_escrow_balance.insert(caller, current_balance + payment);
        }
        
        let user_balance = self.user_escrow_balance.get(caller);
        if user_balance < plan_price {
            return Err(SubscriptionError::InsufficientFunds(InsufficientFunds {}));
        }
        
        let protocol_fee = (plan_price * self.protocol_fee_percentage.get()) / U256::from(10000);
        let provider_amount = plan_price - protocol_fee;
        
        let subscription_id = self.next_subscription_id.get();
        let current_time = U256::from(self.vm().block_timestamp());
        
        self.subscription_plan_id.insert(subscription_id, plan_id);
        self.subscription_subscriber.insert(subscription_id, caller);
        self.subscription_last_payment.insert(subscription_id, current_time);
        self.subscription_active.insert(subscription_id, true);
        
        self.user_escrow_balance.insert(caller, user_balance - plan_price);
        
        if let Err(_) = self.vm().transfer_eth(plan_provider, provider_amount) {
            self.user_escrow_balance.insert(caller, user_balance);
            return Err(SubscriptionError::InvalidInput(InvalidInput {}));
        }
        
        self.next_subscription_id.set(subscription_id + U256::from(1));
        
        evm::log(SubscriptionCreated {
            subscriptionId: subscription_id,
            user: caller,
            planId: plan_id
        });
        
        evm::log(PaymentProcessed {
            from: caller,
            to: plan_provider,
            amount: provider_amount,
            subscriptionId: subscription_id
        });
        
        evm::log(ProviderEarnings {
            provider: plan_provider,
            planId: plan_id,
            amount: provider_amount
        });
        
        Ok(subscription_id)
    }
    

    
    pub fn process_subscription_payment(&mut self, subscription_id: U256) -> Result<bool, SubscriptionError> {
        if !self.subscription_active.get(subscription_id) {
            return Err(SubscriptionError::InvalidInput(InvalidInput {}));
        }

        let subscriber = self.subscription_subscriber.get(subscription_id);
        let plan_id = self.subscription_plan_id.get(subscription_id);
        let plan_provider = self.plan_provider.get(plan_id);
        let plan_price = self.plan_price.get(plan_id);
        let plan_interval = self.plan_interval.get(plan_id);
        let last_payment = self.subscription_last_payment.get(subscription_id);
        let current_time = U256::from(self.vm().block_timestamp());

        if current_time < last_payment + plan_interval {
            return Err(SubscriptionError::InvalidInput(InvalidInput {}));
        }

        let user_balance = self.user_escrow_balance.get(subscriber);
        if user_balance < plan_price {
            self.subscription_active.insert(subscription_id, false);
            return Err(SubscriptionError::InsufficientFunds(InsufficientFunds {}));
        }

        let protocol_fee = (plan_price * self.protocol_fee_percentage.get()) / U256::from(10000);
        let provider_amount = plan_price - protocol_fee;

        self.user_escrow_balance.insert(subscriber, user_balance - plan_price);
        self.subscription_last_payment.insert(subscription_id, current_time);

        if let Err(_) = self.vm().transfer_eth(plan_provider, provider_amount) {
            self.user_escrow_balance.insert(subscriber, user_balance);
            self.subscription_last_payment.insert(subscription_id, last_payment);
            return Err(SubscriptionError::InvalidInput(InvalidInput {}));
        }

        evm::log(PaymentProcessed { 
            from: subscriber, 
            to: plan_provider, 
            amount: provider_amount,
            subscriptionId: subscription_id
        });
        
        evm::log(ProviderEarnings {
            provider: plan_provider,
            planId: plan_id,
            amount: provider_amount
        });

        Ok(true)
    }    pub fn get_user_balance(&self, user: Address) -> U256 {
        self.user_escrow_balance.get(user)
    }
    
    // Check if provider is registered
    pub fn is_provider_registered(&self, provider: Address) -> bool {
        self.registered_providers.get(provider)
    }
    

    // Get all available plans in one place (marketplace view)
    pub fn get_plans(&self) -> Vec<U256> {
        let max_plans = self.next_plan_id.get();
        let mut plan_ids = Vec::new();
        
        let mut plan_id = U256::from(1);
        while plan_id < max_plans && plan_ids.len() < 10 {
            let provider = self.plan_provider.get(plan_id);
            if provider != Address::ZERO {
                plan_ids.push(plan_id);
            }
            plan_id += U256::from(1);
        }
        plan_ids
    }

    // Deposit funds to escrow balance - HYBRID ESCROW FEATURE
    #[payable]
    pub fn deposit(&mut self) -> Result<bool, SubscriptionError> {
        let caller = self.vm().msg_sender();
        let payment = self.vm().msg_value();
        
        if payment.is_zero() {
            return Err(SubscriptionError::InvalidInput(InvalidInput {}));
        }
        
        let current_balance = self.user_escrow_balance.get(caller);
        let new_balance = current_balance + payment;
        
        self.user_escrow_balance.insert(caller, new_balance);
        
        evm::log(EscrowDeposit {
            user: caller,
            amount: payment,
            newBalance: new_balance
        });
        
        Ok(true)
    }

    // Withdraw balance
    pub fn withdraw(&mut self, amount: U256) -> Result<bool, SubscriptionError> {
        let caller = self.vm().msg_sender();
        let user_balance = self.user_escrow_balance.get(caller);
        
        if amount.is_zero() || user_balance < amount {
            return Err(SubscriptionError::InsufficientFunds(InsufficientFunds {}));
        }
        
        let new_balance = user_balance - amount;
        self.user_escrow_balance.insert(caller, new_balance);
        
        if let Err(_) = self.vm().transfer_eth(caller, amount) {
            self.user_escrow_balance.insert(caller, user_balance);
            return Err(SubscriptionError::InvalidInput(InvalidInput {}));
        }
        
        evm::log(EscrowWithdrawal {
            user: caller,
            amount: amount,
            newBalance: new_balance
        });
        
        Ok(true)
    }
    
    fn require_registered_provider(&self, provider: Address) -> Result<(), SubscriptionError> {
        if !self.registered_providers.get(provider) {
            return Err(SubscriptionError::Unauthorized(Unauthorized {}));
        }
        Ok(())
    }
    
    // Story Protocol IP Integration Functions
    
    /// Register an IP asset for a subscription plan
    /// Links the plan to Story Protocol's IP registry
    pub fn register_plan_ip_asset(&mut self, plan_id: U256, ip_asset_address: Address, metadata_uri: String) -> Result<bool, SubscriptionError> {
        let caller = self.vm().msg_sender();
        let plan_provider = self.plan_provider.get(plan_id);
        
        // Only the plan provider can register the IP asset
        if plan_provider != caller {
            return Err(SubscriptionError::Unauthorized(Unauthorized {}));
        }
        
        if ip_asset_address == Address::ZERO {
            return Err(SubscriptionError::InvalidInput(InvalidInput {}));
        }
        
        self.plan_ip_asset.insert(plan_id, ip_asset_address);
        self.plan_metadata_uri.insert(plan_id, metadata_uri.clone());
        
        evm::log(IPAssetRegistered {
            planId: plan_id,
            ipAsset: ip_asset_address,
            metadataURI: metadata_uri
        });
        
        Ok(true)
    }
    
    /// Record IP license attachment
    pub fn record_license_attachment(&mut self, ip_asset: Address, license_terms_id: U256) -> Result<bool, SubscriptionError> {
        if ip_asset == Address::ZERO {
            return Err(SubscriptionError::InvalidInput(InvalidInput {}));
        }
        
        evm::log(IPLicenseAttached {
            ipAsset: ip_asset,
            licenseTermsId: license_terms_id
        });
        
        Ok(true)
    }
    
    /// Record IP license mint for subscriber
    pub fn record_license_mint(&mut self, ip_asset: Address, licensee: Address, token_id: U256) -> Result<bool, SubscriptionError> {
        if ip_asset == Address::ZERO || licensee == Address::ZERO {
            return Err(SubscriptionError::InvalidInput(InvalidInput {}));
        }
        
        self.ip_license_holders.insert(licensee, true);
        
        evm::log(IPLicenseMinted {
            ipAsset: ip_asset,
            licensee: licensee,
            tokenId: token_id
        });
        
        Ok(true)
    }
    
    /// Distribute IP royalties to creators
    /// This implements the IPFi track - programmable royalty distribution
    pub fn distribute_ip_royalty(&mut self, ip_asset: Address, recipient: Address, amount: U256) -> Result<bool, SubscriptionError> {
        let caller = self.vm().msg_sender();
        
        // Only admin can trigger royalty distribution (can be extended to automated oracles)
        if caller != self.admin.get() {
            return Err(SubscriptionError::Unauthorized(Unauthorized {}));
        }
        
        if amount.is_zero() || recipient == Address::ZERO {
            return Err(SubscriptionError::InvalidInput(InvalidInput {}));
        }
        
        let current_royalty_balance = self.ip_asset_royalty_balance.get(ip_asset);
        let new_balance = current_royalty_balance + amount;
        self.ip_asset_royalty_balance.insert(ip_asset, new_balance);
        
        evm::log(IPRoyaltyPaid {
            ipAsset: ip_asset,
            recipient: recipient,
            amount: amount
        });
        
        Ok(true)
    }
    
    /// Register content IP created by subscribers using the service
    /// This creates IP lineage and derivative relationships
    pub fn register_content_ip(&mut self, subscription_id: U256, content_ip_asset: Address) -> Result<bool, SubscriptionError> {
        let caller = self.vm().msg_sender();
        let subscriber = self.subscription_subscriber.get(subscription_id);
        
        // Only the subscriber can register their content IP
        if subscriber != caller {
            return Err(SubscriptionError::Unauthorized(Unauthorized {}));
        }
        
        if !self.subscription_active.get(subscription_id) {
            return Err(SubscriptionError::InvalidInput(InvalidInput {}));
        }
        
        self.subscription_content_ip.insert(subscription_id, content_ip_asset);
        
        evm::log(ContentIPRegistered {
            subscriptionId: subscription_id,
            contentCreator: caller,
            ipAsset: content_ip_asset
        });
        
        Ok(true)
    }
    
    /// Get IP asset associated with a plan
    pub fn get_plan_ip_asset(&self, plan_id: U256) -> Address {
        self.plan_ip_asset.get(plan_id)
    }
    
    /// Get IP metadata URI for a plan
    pub fn get_plan_metadata_uri(&self, plan_id: U256) -> String {
        self.plan_metadata_uri.get(plan_id)
    }
    
    /// Get total royalties accumulated for an IP asset
    pub fn get_ip_royalty_balance(&self, ip_asset: Address) -> U256 {
        self.ip_asset_royalty_balance.get(ip_asset)
    }
    
    /// Check if address holds a valid IP license
    pub fn has_ip_license(&self, holder: Address) -> bool {
        self.ip_license_holders.get(holder)
    }
}
