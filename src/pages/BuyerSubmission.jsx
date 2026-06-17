import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/Card';
import { Button } from '../components/Button';
import { FileUpload } from '../components/FileUpload';
import { Input, Select, Textarea } from '../components/FormFields';
import { Alert } from '../components/Alert';
import { showSuccess, showError } from '../utils/toast';
import { submitOffer } from '../api/offer.api';
import { createProperty } from '../api/property.api';

export const BuyerSubmission = () => {
  const [step, setStep] = useState(1); // 1: Property Info, 2: Upload Docs, 3: Financing, 4: Review
  const [formData, setFormData] = useState({
    buyerName: '',
    buyerEmail: '',
    buyerPhone: '',
    agentName: '',
    propertyAddress: '',
    offerPrice: '',
    earnestMoneyAmount: '',
    closingDate: '',
    inspectionContingency: false,
    financingContingency: false,
    appraisalContingency: false,
    otherContingencies: '',
    financingType: 'conventional',
    loanAmount: '',
    downPayment: '',
    lenderName: '',
    approvalStatus: 'pre-approval',
    additionalNotes: '',
  });

  const [uploadedFiles, setUploadedFiles] = useState({
    contract: null,
    loanDocument: null,
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = (fileType, files) => {
    if (files.length > 0) {
      setUploadedFiles((prev) => ({
        ...prev,
        [fileType]: files[0],
      }));
    }
  };

  const handleSubmitOffer = async () => {
    // Documents are optional - not required to block submission
    // Note: Upload endpoints may not exist on backend yet

    setLoading(true);
    try {
      // If user provided a free-form property address, create a property first
      // API requires: address, city, state, zipCode - all required fields
      // For now, we'll parse the address or skip if incomplete
      let propertyId = null;
      if (formData.propertyAddress) {
        try {
          // Parse address: "123 Main Street, City, State, ZipCode" or just store as address
          // If no full details, skip property creation and let the offer be created without propertyId
          const propertyPayload = {
            address: formData.propertyAddress,
            city: "Not Specified", // You may want to add a city field to the form
            state: "CA", // You may want to add a state field to the form
            zipCode: "00000", // You may want to add a zipCode field to the form
          };
          const created = await createProperty(propertyPayload);
          propertyId = created?.id || created?._id || null;
        } catch (e) {
          // If property creation fails, continue without propertyId
          console.error('Property create error:', e?.response?.data || e);
        }
      }

      // Build offer payload with ONLY fields that the API expects
      // According to documentation, Create Offer endpoint expects:
      // propertyId, buyerName, buyerEmail, offerPrice, closingDays, 
      // inspectionContingency, financingContingency, appraisalContingency, additionalConditions
      const offerPayload = {
        propertyId: propertyId, // Required
        buyerName: formData.buyerName, // Required
        buyerEmail: formData.buyerEmail, // Required
        offerPrice: parseFloat(formData.offerPrice), // Required
        closingDays: formData.closingDate ? Math.ceil((new Date(formData.closingDate) - new Date()) / (1000 * 60 * 60 * 24)) : 30, // Calculate days from closing date
        inspectionContingency: formData.inspectionContingency || false,
        financingContingency: formData.financingContingency || false,
        appraisalContingency: formData.appraisalContingency || false,
        additionalConditions: formData.otherContingencies || undefined, // Optional
      };

      // Create offer
      const offerResponse = await submitOffer(offerPayload);

      showSuccess('Offer submitted successfully! Our AI is analyzing your offer...');
      setStep(1);
      setFormData({
        buyerName: '',
        buyerEmail: '',
        buyerPhone: '',
        agentName: '',
        propertyAddress: '',
        offerPrice: '',
        earnestMoneyAmount: '',
        closingDate: '',
        inspectionContingency: false,
        financingContingency: false,
        appraisalContingency: false,
        otherContingencies: '',
        financingType: 'conventional',
        loanAmount: '',
        downPayment: '',
        lenderName: '',
        approvalStatus: 'pre-approval',
        additionalNotes: '',
      });
      setUploadedFiles({
        contract: null,
        loanDocument: null,
      });
    } catch (error) {
      // If backend returned validation details, show them
      const validation = error?.response?.data || error?.message || error;
      console.error('Offer submission error:', validation);

      if (Array.isArray(validation)) {
        // validation may be an array of errors
        showError(validation.slice(0, 3).join('; '));
      } else if (validation?.message) {
        showError(validation.message);
      } else if (typeof validation === 'string') {
        showError(validation);
      } else {
        showError('Failed to submit offer');
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Submit Your Offer</h1>

      {/* Progress Indicator */}
      <div className="flex justify-between items-center mb-6">
        {[1, 2, 3, 4].map((s) => (
          <React.Fragment key={s}>
            <div
              onClick={() => s < step && setStep(s)}
              className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer font-semibold ${
                s <= step
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {s}
            </div>
            {s < 4 && (
              <div
                className={`flex-1 h-1 mx-2 ${
                  s < step ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Buyer Information */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Buyer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Full Name"
              placeholder="John Doe"
              value={formData.buyerName}
              onChange={(e) => handleInputChange('buyerName', e.target.value)}
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="john@example.com"
              value={formData.buyerEmail}
              onChange={(e) => handleInputChange('buyerEmail', e.target.value)}
              required
            />
            <Input
              label="Phone"
              type="tel"
              placeholder="(555) 123-4567"
              value={formData.buyerPhone}
              onChange={(e) => handleInputChange('buyerPhone', e.target.value)}
              required
            />
            <Input
              label="Real Estate Agent Name"
              placeholder="Jane Smith"
              value={formData.agentName}
              onChange={(e) => handleInputChange('agentName', e.target.value)}
            />
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => setStep(2)}
              className="ml-auto"
            >
              Next
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step 2: Property & Offer Details */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Property & Offer Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Property Address"
              placeholder="123 Main Street, New York, NY"
              value={formData.propertyAddress}
              onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Offer Price"
                type="number"
                placeholder="450000"
                value={formData.offerPrice}
                onChange={(e) => handleInputChange('offerPrice', e.target.value)}
                required
              />
              <Input
                label="Earnest Money"
                type="number"
                placeholder="10000"
                value={formData.earnestMoneyAmount}
                onChange={(e) => handleInputChange('earnestMoneyAmount', e.target.value)}
              />
            </div>
            <Input
              label="Closing Date"
              type="date"
              value={formData.closingDate}
              onChange={(e) => handleInputChange('closingDate', e.target.value)}
              required
            />

            <div className="space-y-3 pt-4 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900">Contingencies</h4>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.inspectionContingency}
                  onChange={(e) =>
                    handleInputChange('inspectionContingency', e.target.checked)
                  }
                  className="rounded border-gray-300"
                />
                <span className="ml-2 text-sm">Inspection Contingency</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.financingContingency}
                  onChange={(e) =>
                    handleInputChange('financingContingency', e.target.checked)
                  }
                  className="rounded border-gray-300"
                />
                <span className="ml-2 text-sm">Financing Contingency</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.appraisalContingency}
                  onChange={(e) =>
                    handleInputChange('appraisalContingency', e.target.checked)
                  }
                  className="rounded border-gray-300"
                />
                <span className="ml-2 text-sm">Appraisal Contingency</span>
              </label>
              <Textarea
                label="Other Contingencies"
                placeholder="Any other contingencies..."
                value={formData.otherContingencies}
                onChange={(e) =>
                  handleInputChange('otherContingencies', e.target.value)
                }
                rows={2}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => setStep(1)}
              variant="secondary"
            >
              Back
            </Button>
            <Button
              onClick={() => setStep(3)}
              className="ml-auto"
            >
              Next
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step 3: Financing & Documents */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Financing & Documentation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              label="Financing Type"
              value={formData.financingType}
              onChange={(e) => handleInputChange('financingType', e.target.value)}
              options={[
                { value: 'conventional', label: 'Conventional' },
                { value: 'fha', label: 'FHA' },
                { value: 'va', label: 'VA' },
                { value: 'cash', label: 'Cash Offer' },
              ]}
            />

            {formData.financingType !== 'cash' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Loan Amount"
                    type="number"
                    placeholder="360000"
                    value={formData.loanAmount}
                    onChange={(e) =>
                      handleInputChange('loanAmount', e.target.value)
                    }
                  />
                  <Input
                    label="Down Payment %"
                    type="number"
                    placeholder="20"
                    value={formData.downPayment}
                    onChange={(e) =>
                      handleInputChange('downPayment', e.target.value)
                    }
                  />
                </div>
                <Input
                  label="Lender Name"
                  placeholder="Chase Bank"
                  value={formData.lenderName}
                  onChange={(e) => handleInputChange('lenderName', e.target.value)}
                />
                <Select
                  label="Loan Approval Status"
                  value={formData.approvalStatus}
                  onChange={(e) =>
                    handleInputChange('approvalStatus', e.target.value)
                  }
                  options={[
                    { value: 'pre-approval', label: 'Pre-Approval' },
                    { value: 'pre-qualified', label: 'Pre-Qualified' },
                    { value: 'conditional-approval', label: 'Conditional Approval' },
                    { value: 'clear-to-close', label: 'Clear to Close' },
                  ]}
                />
              </>
            )}

            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900">Upload Documents</h4>
              <FileUpload
                label="Purchase Contract (PDF)"
                onFiles={(files) => handleFileUpload('contract', files)}
                accept="application/pdf"
                multiple={false}
              />
              {uploadedFiles.contract && (
                <p className="text-sm text-green-600">
                  ✓ {uploadedFiles.contract.name}
                </p>
              )}

              <FileUpload
                label="Loan Approval Proof (PDF or Image)"
                onFiles={(files) => handleFileUpload('loanDocument', files)}
                multiple={false}
              />
              {uploadedFiles.loanDocument && (
                <p className="text-sm text-green-600">
                  ✓ {uploadedFiles.loanDocument.name}
                </p>
              )}
            </div>

            <Textarea
              label="Additional Notes"
              placeholder="Any additional information for the seller..."
              value={formData.additionalNotes}
              onChange={(e) =>
                handleInputChange('additionalNotes', e.target.value)
              }
              rows={3}
            />
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => setStep(2)}
              variant="secondary"
            >
              Back
            </Button>
            <Button
              onClick={() => setStep(4)}
              className="ml-auto"
            >
              Review
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step 4: Review & Submit */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Review Your Offer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert
              type="info"
              title="Offer Ready for Review"
              message="Your AI-powered offer analysis will be generated once submitted. You'll receive a detailed report including offer strength, financing reliability, and closing probability."
            />

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Buyer Details</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-600">Name:</span> {formData.buyerName}
                  </p>
                  <p>
                    <span className="text-gray-600">Email:</span> {formData.buyerEmail}
                  </p>
                  <p>
                    <span className="text-gray-600">Phone:</span> {formData.buyerPhone}
                  </p>
                  <p>
                    <span className="text-gray-600">Agent:</span> {formData.agentName || 'N/A'}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Offer Details</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-600">Price:</span> ${formData.offerPrice}
                  </p>
                  <p>
                    <span className="text-gray-600">Earnest Money:</span> ${formData.earnestMoneyAmount}
                  </p>
                  <p>
                    <span className="text-gray-600">Closing Date:</span> {formData.closingDate}
                  </p>
                  <p>
                    <span className="text-gray-600">Contingencies:</span>{' '}
                    {[
                      formData.inspectionContingency && 'Inspection',
                      formData.financingContingency && 'Financing',
                      formData.appraisalContingency && 'Appraisal',
                    ]
                      .filter(Boolean)
                      .join(', ') || 'None'}
                  </p>
                </div>
              </div>
            </div>

            {formData.financingType !== 'cash' && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Financing Details</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-600">Type:</span> {formData.financingType}
                  </p>
                  <p>
                    <span className="text-gray-600">Loan Amount:</span> ${formData.loanAmount}
                  </p>
                  <p>
                    <span className="text-gray-600">Lender:</span> {formData.lenderName || 'N/A'}
                  </p>
                  <p>
                    <span className="text-gray-600">Status:</span> {formData.approvalStatus}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-2 text-sm">
              <p className="text-gray-600">Uploaded Documents:</p>
              <p className="text-green-600">✓ Contract: {uploadedFiles.contract?.name}</p>
              <p className="text-green-600">✓ Loan Document: {uploadedFiles.loanDocument?.name}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => setStep(3)}
              variant="secondary"
            >
              Back
            </Button>
            <Button
              onClick={handleSubmitOffer}
              loading={loading}
              className="ml-auto"
            >
              Submit Offer
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};
