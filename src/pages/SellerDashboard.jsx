import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { FileUpload } from '../components/FileUpload';
import { Alert } from '../components/Alert';
import { showSuccess, showError } from '../utils/toast';
import { uploadDisclosurePdf } from '../api/upload.api';
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
    yearBuilt: '',
    squareFeet: '',
  });
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleCreateProperty = async (e) => {
    e.preventDefault();
    try {
      const result = await createProperty(formData);
      setProperties([...properties, result]);
      setFormData({
        address: '',
        city: '',
        state: '',
        zipCode: '',
        yearBuilt: '',
        squareFeet: '',
      });
      setShowNewPropertyForm(false);
      showSuccess('Property created successfully');
    } catch (error) {
      showError('Failed to create property');
    }
  };

  const handleUploadDisclosure = async () => {
    if (!selectedPropertyId || selectedFiles.length === 0) {
      showError('Please select a property and file');
      return;
    }

    setUploadingFile(true);
    try {
      for (const file of selectedFiles) {
        await uploadDisclosurePdf(selectedPropertyId, file);
      }
      setSelectedFiles([]);
      showSuccess('Disclosure document uploaded successfully');
    } catch (error) {
      showError('Failed to upload disclosure document');
    } finally {
      setUploadingFile(false);
    }
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
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Zip Code"
                  placeholder="10001"
                  value={formData.zipCode}
                  onChange={(e) =>
                    setFormData({ ...formData, zipCode: e.target.value })
                  }
                  required
                />
                <Input
                  label="Year Built"
                  type="number"
                  placeholder="2020"
                  value={formData.yearBuilt}
                  onChange={(e) =>
                    setFormData({ ...formData, yearBuilt: e.target.value })
                  }
                />
              </div>
              <Input
                label="Square Feet"
                type="number"
                placeholder="2500"
                value={formData.squareFeet}
                onChange={(e) =>
                  setFormData({ ...formData, squareFeet: e.target.value })
                }
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
                    <span className="text-gray-600">Year Built:</span>
                    <span className="ml-2 font-medium">{property.yearBuilt}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Square Feet:</span>
                    <span className="ml-2 font-medium">{property.squareFeet}</span>
                  </div>
                </div>

                {selectedPropertyId === property.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <FileUpload
                      label="Upload Disclosure"
                      onFiles={setSelectedFiles}
                      accept="application/pdf"
                      multiple={false}
                    />
                    <Button
                      onClick={handleUploadDisclosure}
                      loading={uploadingFile}
                      fullWidth
                      className="mt-2"
                    >
                      Upload Disclosure
                    </Button>
                  </div>
                )}

                {selectedPropertyId !== property.id && (
                  <Button
                    onClick={() => setSelectedPropertyId(property.id)}
                    fullWidth
                    variant="outline"
                    className="mt-4"
                  >
                    Upload Disclosure
                  </Button>
                )}
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
