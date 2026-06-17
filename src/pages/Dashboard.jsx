import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Alert';
import { getProperties } from '../api/property.api';
import { getOffers } from '../api/offer.api';
import { formatCurrency, formatDate } from '../utils/formatters';

export const Dashboard = () => {
  const [properties, setProperties] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [propsData, offersData] = await Promise.all([
        getProperties(),
        getOffers(),
      ]);
      setProperties(propsData || []);
      setOffers(offersData || []);
    } catch (error) {
      console.error('Failed to load dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  const topOffers = offers
    .sort((a, b) => {
      const scoreA = a.intelligenceAnalysis?.bidStrengthScore || 0;
      const scoreB = b.intelligenceAnalysis?.bidStrengthScore || 0;
      return scoreB - scoreA;
    })
    .slice(0, 5);

  const stats = [
    { label: 'Total Properties', value: properties.length, icon: '🏠' },
    { label: 'Active Offers', value: offers.filter(o => !o.status || o.status !== 'closed').length, icon: '📝' },
    { label: 'Completed Deals', value: offers.filter(o => o.status === 'closed').length, icon: '✅' },
    { label: 'Under Analysis', value: offers.filter(o => o.analysisStatus !== 'completed').length, icon: '⏳' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Bhumio</h1>
          <p className="text-gray-600 mt-1">AI-Powered Real Estate Intelligence Platform</p>
        </div>
        <div className="flex gap-3">
          <Link to="/seller">
            <Button variant="outline">Seller Portal</Button>
          </Link>
          <Link to="/buyer">
            <Button>Submit Offer</Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx}>
            <CardContent className="flex items-center justify-between pt-6">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="text-4xl">{stat.icon}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Properties */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Properties</CardTitle>
              <Link to="/seller">
                <Button variant="secondary" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-6 text-gray-500">Loading...</div>
            ) : properties.length > 0 ? (
              <div className="space-y-3">
                {properties.slice(0, 5).map((property) => (
                  <div
                    key={property.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{property.address}</p>
                      <p className="text-sm text-gray-600">
                        {property.city}, {property.state}
                      </p>
                    </div>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <p>No properties yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">AI Engine</span>
              <Badge variant="success">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database</span>
              <Badge variant="success">Connected</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Cache</span>
              <Badge variant="success">Healthy</Badge>
            </div>
            <div className="pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-600">Version 1.0.0</p>
              <p className="text-xs text-gray-600">Last updated: Today</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Offers */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Top Offers by Strength Score</CardTitle>
            <Link to="/offers">
              <Button variant="secondary" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {topOffers.length > 0 ? (
            <div className="space-y-3">
              {topOffers.map((offer, idx) => (
                <div key={offer.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {offer.buyerName || 'Anonymous'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatCurrency(offer.offerPrice)}
                    </p>
                  </div>
                  <div className="text-right">
                    {offer.intelligenceAnalysis ? (
                      <>
                        <p className="font-bold text-lg text-blue-600">
                          {offer.intelligenceAnalysis.bidStrengthScore}
                        </p>
                        <p className="text-xs text-gray-600">Strength</p>
                      </>
                    ) : (
                      <Badge variant="warning">Analyzing...</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <p>No offers yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🏘️</div>
              <h3 className="font-semibold text-gray-900 mb-2">Seller Portal</h3>
              <p className="text-sm text-gray-600 mb-4">
                Upload property disclosures and analyze buyer offers
              </p>
              <Link to="/seller" className="inline-block">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl mb-3">📝</div>
              <h3 className="font-semibold text-gray-900 mb-2">Submit Offers</h3>
              <p className="text-sm text-gray-600 mb-4">
                Submit your offer with financing and contingencies details
              </p>
              <Link to="/buyer" className="inline-block">
                <Button size="sm">Submit Now</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🧠</div>
              <h3 className="font-semibold text-gray-900 mb-2">AI Intelligence</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get AI-powered insights on properties and offers
              </p>
              <Link to="/intelligence" className="inline-block">
                <Button size="sm">Explore</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
