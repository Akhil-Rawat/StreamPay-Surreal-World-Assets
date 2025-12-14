// Story Protocol IP Registration Page
// Demonstrates Story Protocol integration for the hackathon

import React, { useState } from 'react';
import { Shield, Sparkles, FileText, TrendingUp, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useIPRegistration, useIPLicense, useStoryProtocol } from '../hooks/useStoryProtocol';
import toast from 'react-hot-toast';

export const IPRegistrationPage: React.FC = () => {
  const { isInitialized, isInitializing } = useStoryProtocol();
  const { registerPlan, isRegistering } = useIPRegistration();
  const { attachLicense, isProcessing: isAttachingLicense } = useIPLicense();
  
  const [formData, setFormData] = useState({
    planName: '',
    description: '',
    price: '',
    interval: '30',
    category: 'saas',
  });

  const [registeredIPId, setRegisteredIPId] = useState<string | null>(null);

  const handleRegisterIP = async () => {
    if (!formData.planName || !formData.description || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    const result = await registerPlan(1, {
      name: formData.planName,
      description: formData.description,
      price: formData.price,
      interval: formData.interval,
      category: formData.category,
    });

    if (result) {
      setRegisteredIPId(result.ipId);
      toast.success('IP Asset registered successfully!');
    } else {
      toast.error('Failed to register IP asset');
    }
  };

  const handleAttachLicense = async () => {
    if (!registeredIPId) return;

    const result = await attachLicense(registeredIPId as any);

    if (result) {
      toast.success('License terms attached successfully!');
    } else {
      toast.error('Failed to attach license terms');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Story Protocol Integration</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            IP-Powered Subscription Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your subscription plans into licensed IP assets with programmable royalties
            and automated licensing using Story Protocol
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-2 border-purple-200">
            <CardContent className="pt-6">
              <Shield className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">IP Registration</h3>
              <p className="text-sm text-gray-600">
                Register subscription plans as IP assets on Story Protocol with full metadata
                and provenance tracking
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200">
            <CardContent className="pt-6">
              <FileText className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Programmable Licensing</h3>
              <p className="text-sm text-gray-600">
                Attach customizable license terms with PIL (Programmable IP License) for
                commercial use and derivatives
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200">
            <CardContent className="pt-6">
              <TrendingUp className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Automated Royalties</h3>
              <p className="text-sm text-gray-600">
                Enable automatic royalty distribution to creators with transparent on-chain
                tracking and settlement
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Registration Form */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900">Register Your IP Asset</h2>
              <p className="text-sm text-gray-600 mt-2">
                Create a subscription plan as a Story Protocol IP asset
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plan Name *
                </label>
                <Input
                  value={formData.planName}
                  onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                  placeholder="Premium Dev Tools"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Advanced development tools and analytics for professional developers..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (ETH) *
                  </label>
                  <Input
                    type="number"
                    step="0.001"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.05"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="saas">SaaS</option>
                    <option value="content">Content</option>
                    <option value="tools">Dev Tools</option>
                    <option value="analytics">Analytics</option>
                  </select>
                </div>
              </div>

              <Button
                onClick={handleRegisterIP}
                disabled={isRegistering || !isInitialized}
                className="w-full"
              >
                {isRegistering ? 'Registering...' : 'Register IP Asset'}
              </Button>

              {!isInitialized && (
                <p className="text-sm text-amber-600 text-center">
                  {isInitializing ? 'Initializing Story Protocol...' : 'Please connect wallet on Story Network'}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Result Display */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900">IP Asset Details</h2>
              <p className="text-sm text-gray-600 mt-2">
                View your registered IP asset information
              </p>
            </CardHeader>
            <CardContent>
              {registeredIPId ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-medium text-green-800 mb-2">
                      ✓ IP Asset Registered Successfully!
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-white px-2 py-1 rounded font-mono flex-1">
                        {registeredIPId}
                      </code>
                      <a
                        href={`https://explorer.story.foundation/ipa/${registeredIPId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-700"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900">Next Steps:</h3>
                    
                    <Button
                      onClick={handleAttachLicense}
                      disabled={isAttachingLicense}
                      variant="outline"
                      className="w-full"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      {isAttachingLicense ? 'Attaching...' : 'Attach License Terms'}
                    </Button>

                    <div className="text-sm text-gray-600 space-y-2">
                      <p>• Attach PIL license terms for commercial use</p>
                      <p>• Mint licenses for subscribers</p>
                      <p>• Track royalty distributions</p>
                      <p>• Register derivative works</p>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-xs font-medium text-purple-900 mb-2">
                      Story Protocol Features
                    </p>
                    <ul className="text-xs text-purple-700 space-y-1">
                      <li>✓ On-chain IP provenance</li>
                      <li>✓ Programmable licensing</li>
                      <li>✓ Automated royalty splits</li>
                      <li>✓ Derivative tracking</li>
                      <li>✓ Commercial use rights</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Register your plan to see IP asset details
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <Card className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Why Story Protocol + StreamPay?
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-700">
              <div>
                <h4 className="font-semibold mb-2">For Content Creators (IPFi Track)</h4>
                <ul className="space-y-1">
                  <li>• Monetize IP through programmable royalties</li>
                  <li>• Automatic revenue distribution to collaborators</li>
                  <li>• Enable commercial licensing of your work</li>
                  <li>• Track derivative works and earn from remixes</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">For Developers (OSS/Dev Tooling)</h4>
                <ul className="space-y-1">
                  <li>• Reusable hooks for IP registration</li>
                  <li>• TypeScript SDK integration examples</li>
                  <li>• Smart contract patterns for IP + subscriptions</li>
                  <li>• Open-source licensing frameworks</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
