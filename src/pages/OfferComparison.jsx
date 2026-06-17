import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Alert';
import { formatCurrency, formatDate, getScoreBadgeColor } from '../utils/formatters';
import { getOffersByProperty, getOffers } from '../api/offer.api';
import { getProperties } from '../api/property.api';
import { Select } from '../components/FormFields';
import { OfferStrengthIndicator } from '../components/IntelligenceCards';

export const OfferComparison = () => {
  const [properties, setProperties] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    if (selectedPropertyId) {
      loadOffers();
    }
  }, [selectedPropertyId]);

  const loadProperties = async () => {
    try {
      const data = await getProperties();
      setProperties(data);
    } catch (error) {
      console.error('Failed to load properties', error);
    }
  };

  const loadOffers = async () => {
    setLoading(true);
    try {
      const data = await getOffersByProperty(selectedPropertyId);
      setOffers(data);
    } catch (error) {
      console.error('Failed to load offers', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankingColor = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-50 border-yellow-200';
      case 2:
        return 'bg-gray-50 border-gray-200';
      case 3:
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const sortedOffers = [...offers].sort((a, b) => {
    const scoreA = a.intelligenceAnalysis?.bidStrengthScore || 0;
    const scoreB = b.intelligenceAnalysis?.bidStrengthScore || 0;
    return scoreB - scoreA;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Offer Comparison</h1>

      <Card>
        <CardHeader>
          <CardTitle>Select Property</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedPropertyId}
            onChange={(e) => setSelectedPropertyId(e.target.value)}
            options={properties.map((p) => ({
              value: p.id,
              label: `${p.address} - ${p.city}, ${p.state}`,
            }))}
            label="Choose a property to view offers"
          />
        </CardContent>
      </Card>

      {selectedPropertyId && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Offers ({offers.length})</h2>
            <Button variant="secondary" onClick={loadOffers}>
              Refresh
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : offers.length > 0 ? (
            <div className="space-y-4">
              {sortedOffers.map((offer, index) => (
                <Card key={offer.id} className={`border-2 ${getRankingColor(index + 1)}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle>{offer.buyerName || 'Anonymous Buyer'}</CardTitle>
                        {index < 3 && (
                          <Badge variant={index === 0 ? 'success' : index === 1 ? 'warning' : 'danger'}>
                            #{index + 1}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Submitted: {formatDate(offer.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Offer Price</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatCurrency(offer.offerPrice)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Earnest Money</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatCurrency(offer.earnestMoneyAmount || 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Contingencies</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {offer.contingencies?.length || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Close Date</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatDate(offer.closingDate)}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">AI Intelligence Analysis</h4>
                    {offer.intelligenceAnalysis ? (
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-xs text-blue-600">Strength Score</p>
                          <p className="text-xl font-bold text-blue-900">
                            {offer.intelligenceAnalysis.bidStrengthScore}
                          </p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <p className="text-xs text-green-600">Financing</p>
                          <p className="text-xl font-bold text-green-900">
                            {Math.round(offer.intelligenceAnalysis.financingReliability * 100)}%
                          </p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <p className="text-xs text-purple-600">Closing Prob.</p>
                          <p className="text-xl font-bold text-purple-900">
                            {Math.round(offer.intelligenceAnalysis.closingProbability * 100)}%
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">Analyzing offer...</p>
                    )}
                  </div>

                  {offer.intelligenceAnalysis?.explanation && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">AI Insight:</span> {offer.intelligenceAnalysis.explanation}
                      </p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <div className="text-center py-12">
                <p className="text-gray-600">No offers submitted yet for this property</p>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
