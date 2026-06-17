import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Alert';
import { PropertyRiskIndicator } from '../components/IntelligenceCards';
import { formatDate } from '../utils/formatters';
import { getDisclosures } from '../api/disclosure.api';
import { Select } from '../components/FormFields';

export const PropertyIntelligence = () => {
  const [disclosures, setDisclosures] = useState([]);
  const [selectedDisclosureId, setSelectedDisclosureId] = useState('');
  const [selectedDisclosure, setSelectedDisclosure] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDisclosures();
  }, []);

  const loadDisclosures = async () => {
    setLoading(true);
    try {
      const data = await getDisclosures();
      setDisclosures(data);
    } catch (error) {
      console.error('Failed to load disclosures', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDisclosureId) {
      const disclosure = disclosures.find((d) => d.id === selectedDisclosureId);
      setSelectedDisclosure(disclosure);
    }
  }, [selectedDisclosureId, disclosures]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Property Intelligence</h1>
      <p className="text-gray-600">
        Analyze property disclosure documents to understand risks and property insights.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Select Property Disclosure</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedDisclosureId}
            onChange={(e) => setSelectedDisclosureId(e.target.value)}
            options={disclosures.map((d) => ({
              value: d.id,
              label: `${d.property?.address || 'Unknown'} - ${formatDate(d.createdAt)}`,
            }))}
            label="Choose a disclosure to analyze"
          />
        </CardContent>
      </Card>

      {selectedDisclosure && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{selectedDisclosure.property?.address}</CardTitle>
                  <p className="text-sm text-gray-600 mt-2">
                    {selectedDisclosure.property?.city}, {selectedDisclosure.property?.state}{' '}
                    {selectedDisclosure.property?.zipCode}
                  </p>
                </div>
                <Badge variant="secondary">
                  {formatDate(selectedDisclosure.createdAt)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Year Built</p>
                  <p className="text-lg font-semibold">
                    {selectedDisclosure.property?.yearBuilt || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Square Feet</p>
                  <p className="text-lg font-semibold">
                    {selectedDisclosure.property?.squareFeet?.toLocaleString() || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Disclosure Type</p>
                  <p className="text-lg font-semibold">
                    {selectedDisclosure.disclosureType || 'Standard'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge
                    variant={
                      selectedDisclosure.analysisStatus === 'completed'
                        ? 'success'
                        : 'warning'
                    }
                  >
                    {selectedDisclosure.analysisStatus}
                  </Badge>
                </div>
              </div>

              {selectedDisclosure.rawContent && (
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Document Summary</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {selectedDisclosure.rawContent.substring(0, 500)}...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Risk Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <PropertyRiskIndicator disclosure={selectedDisclosure} />
            </CardContent>
          </Card>

          {selectedDisclosure.intelligenceAnalysis?.keyFindings && (
            <Card>
              <CardHeader>
                <CardTitle>Key Findings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedDisclosure.intelligenceAnalysis.keyFindings.map(
                    (finding, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-blue-50 rounded-lg border border-blue-200"
                      >
                        <p className="text-sm text-blue-900">{finding}</p>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {selectedDisclosure.intelligenceAnalysis?.recommendations && (
            <Card>
              <CardHeader>
                <CardTitle>Recommendations for Buyers</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {selectedDisclosure.intelligenceAnalysis.recommendations.map(
                    (rec, idx) => (
                      <li
                        key={idx}
                        className="flex gap-3 p-3 bg-green-50 rounded-lg border border-green-200"
                      >
                        <span className="text-green-600 font-bold">→</span>
                        <span className="text-sm text-green-900">{rec}</span>
                      </li>
                    )
                  )}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
