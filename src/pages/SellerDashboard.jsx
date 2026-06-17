import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { Alert } from '../components/Alert';
import { showSuccess, showError } from '../utils/toast';
import { createProperty } from '../api/property.api';
import { Input } from '../components/FormFields';

export const SellerDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [showNewPropertyForm, setShowNewPropertyForm] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const handleCreateProperty = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.address || !formData.city || !formData.state || !formData.zipCode) {
      showError('All fields are required');
      return;
    }
    
    try {
      const result = await createProperty(formData);
      setProperties([...properties, result]);
      setFormData({
        address: '',
        city: '',
        state: '',
        zipCode: '',
      });
      setShowNewPropertyForm(false);
      showSuccess('Property created successfully');
    } catch (error) {
      showError('Failed to create property');
    }
  };

  const handleUploadDisclosure = async () => {
    showError('File upload feature is not available at this time');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
        <Button onClick={() => setShowNewPropertyForm(!showNewPropertyForm)}>
          {showNewPropertyForm ? 'Cancel' : 'Add New Property'}
        </Button>
      </div>

      {showNewPropertyForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Property</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateProperty} className="space-y-4">
              <Input
                label="Address"
                placeholder="123 Main Street"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="City"
                  placeholder="New York"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  required
                />
                <Input
                  label="State"
                  placeholder="NY"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  required
                />
              </div>
              <Input
                label="Zip Code"
                placeholder="10001"
                value={formData.zipCode}
                onChange={(e) =>
                  setFormData({ ...formData, zipCode: e.target.value })
                }
                required
              />
              <Button type="submit" fullWidth>
                Create Property
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id}>
              <CardHeader>
                <CardTitle>{property.address}</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {property.city}, {property.state} {property.zipCode}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-600">Address:</span>
                    <span className="ml-2 font-medium">{property.address}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">City:</span>
                    <span className="ml-2 font-medium">{property.city}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">State:</span>
                    <span className="ml-2 font-medium">{property.state}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Alert
          type="info"
          title="No Properties"
          message="Create your first property to get started with document uploads."
        />
      )}
    </div>
  );
};
