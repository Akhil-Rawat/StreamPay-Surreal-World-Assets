// IP Asset Management Component for Story Protocol Integration
// Shows IP registration status, licenses, and royalties

import React from 'react';
import { Shield, FileText, DollarSign, ExternalLink, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useIPRoyalties } from '../hooks/useStoryProtocol';
import { Address } from 'viem';

interface IPAssetCardProps {
  planId: number;
  ipAssetAddress?: Address;
  planName: string;
  onRegisterIP?: () => void;
  onAttachLicense?: () => void;
}

export const IPAssetCard: React.FC<IPAssetCardProps> = ({
  ipAssetAddress,
  planName,
  onRegisterIP,
  onAttachLicense,
}) => {
  // const { ipAsset, isLoading } = useIPAsset(ipAssetAddress);
  const { royalties, collectRoyalties, isCollecting } = useIPRoyalties(ipAssetAddress);

  const isRegistered = !!ipAssetAddress;

  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">IP Asset</h3>
          </div>
          {isRegistered ? (
            <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
              <CheckCircle className="w-4 h-4" />
              Registered
            </span>
          ) : (
            <span className="flex items-center gap-1 text-sm text-gray-500 font-medium">
              <XCircle className="w-4 h-4" />
              Not Registered
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">Plan</p>
          <p className="font-medium text-gray-900">{planName}</p>
        </div>

        {isRegistered ? (
          <>
            <div>
              <p className="text-sm text-gray-600 mb-1">IP Asset ID</p>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                  {ipAssetAddress?.slice(0, 10)}...{ipAssetAddress?.slice(-8)}
                </code>
                <a
                  href={`https://explorer.story.foundation/ipa/${ipAssetAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-700"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 p-4 bg-purple-50 rounded-lg">
              <div>
                <p className="text-xs text-gray-600 mb-1">Total Earned</p>
                <p className="text-lg font-bold text-purple-900">
                  {parseFloat(royalties.totalEarned).toFixed(4)} ETH
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Claimable</p>
                <p className="text-lg font-bold text-green-600">
                  {parseFloat(royalties.claimable).toFixed(4)} ETH
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Claimed</p>
                <p className="text-lg font-bold text-gray-600">
                  {parseFloat(royalties.claimed).toFixed(4)} ETH
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              {parseFloat(royalties.claimable) > 0 && (
                <Button
                  onClick={() => collectRoyalties(BigInt(1))}
                  disabled={isCollecting}
                  className="flex-1"
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  {isCollecting ? 'Collecting...' : 'Collect Royalties'}
                </Button>
              )}
              {onAttachLicense && (
                <Button variant="outline" onClick={onAttachLicense} className="flex-1">
                  <FileText className="w-4 h-4 mr-2" />
                  License Terms
                </Button>
              )}
            </div>

            <div className="text-xs text-gray-500 space-y-1">
              <p>✓ Licensed under Story Protocol PIL</p>
              <p>✓ Commercial use enabled</p>
              <p>✓ Derivatives allowed with attribution</p>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Register your subscription plan as an IP asset on Story Protocol to enable:
            </p>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li>• Programmable licensing</li>
              <li>• Automated royalty distribution</li>
              <li>• IP lineage tracking</li>
              <li>• Commercial use rights</li>
            </ul>
            {onRegisterIP && (
              <Button onClick={onRegisterIP} className="w-full">
                <Shield className="w-4 h-4 mr-2" />
                Register as IP Asset
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface IPLicenseListProps {
  licenses: {
    id: string;
    holder: string;
    ipAsset: string;
    mintedAt: string;
    status: 'active' | 'expired';
  }[];
}

export const IPLicenseList: React.FC<IPLicenseListProps> = ({ licenses }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Active Licenses</h3>
        </div>
      </CardHeader>
      <CardContent>
        {licenses.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">
            No licenses issued yet
          </p>
        ) : (
          <div className="space-y-3">
            {licenses.map((license) => (
              <div
                key={license.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    License #{license.id}
                  </p>
                  <p className="text-xs text-gray-500">
                    Holder: {license.holder.slice(0, 10)}...{license.holder.slice(-8)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Minted: {new Date(license.mintedAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    license.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {license.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface IPRoyaltyDistributionProps {
  distributions: {
    date: string;
    recipient: string;
    amount: string;
    ipAsset: string;
  }[];
}

export const IPRoyaltyDistribution: React.FC<IPRoyaltyDistributionProps> = ({
  distributions,
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Royalty Distributions</h3>
        </div>
      </CardHeader>
      <CardContent>
        {distributions.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">
            No royalty distributions yet
          </p>
        ) : (
          <div className="space-y-3">
            {distributions.map((dist, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {parseFloat(dist.amount).toFixed(4)} ETH
                  </p>
                  <p className="text-xs text-gray-500">
                    To: {dist.recipient.slice(0, 10)}...{dist.recipient.slice(-8)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(dist.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
