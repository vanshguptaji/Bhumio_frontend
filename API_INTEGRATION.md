# API Integration Guide - Frontend to Backend

## Overview

This document maps frontend API calls to backend endpoints. The backend is built with NestJS and provides REST endpoints for all real estate operations.

## API Base URL

All API calls are made to: `http://localhost:3000` (configurable via `VITE_API_URL`)

## Endpoint Reference

### Property Endpoints

#### Get All Properties
```javascript
GET /property
```
**Frontend:**
```javascript
import { getProperties } from './api/property.api';
const properties = await getProperties();
```

#### Get Property by ID
```javascript
GET /property/:id
```
**Frontend:**
```javascript
const property = await getPropertyById(propertyId);
```

#### Create Property
```javascript
POST /property
Content-Type: application/json

{
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "yearBuilt": 2020,
  "squareFeet": 2500
}
```
**Frontend:**
```javascript
const newProperty = await createProperty({
  address: "123 Main St",
  city: "New York",
  state: "NY",
  zipCode: "10001",
  yearBuilt: 2020,
  squareFeet: 2500
});
```

#### Update Property
```javascript
PUT /property/:id
Content-Type: application/json

{
  "address": "456 Oak Ave",
  ...
}
```
**Frontend:**
```javascript
const updated = await updateProperty(propertyId, updateData);
```

#### Delete Property
```javascript
DELETE /property/:id
```
**Frontend:**
```javascript
await deleteProperty(propertyId);
```

---

### Disclosure Endpoints

#### Get All Disclosures
```javascript
GET /disclosure
```
**Frontend:**
```javascript
const disclosures = await getDisclosures();
```

#### Get Disclosure by ID
```javascript
GET /disclosure/:id
```
**Frontend:**
```javascript
const disclosure = await getDisclosureById(disclosureId);
```

#### Get Disclosure by Property
```javascript
GET /disclosure/property/:propertyId
```
**Frontend:**
```javascript
const disclosure = await getDisclosureByPropertyId(propertyId);
```

#### Create Disclosure
```javascript
POST /disclosure
Content-Type: application/json

{
  "propertyId": "uuid",
  "disclosureType": "standard",
  "rawContent": "PDF text content..."
}
```
**Frontend:**
```javascript
const disclosure = await createDisclosure({
  propertyId: "uuid",
  disclosureType: "standard",
  rawContent: "..."
});
```

#### Update Disclosure
```javascript
PUT /disclosure/:id
```
**Frontend:**
```javascript
await updateDisclosure(disclosureId, updateData);
```

#### Delete Disclosure
```javascript
DELETE /disclosure/:id
```
**Frontend:**
```javascript
await deleteDisclosure(disclosureId);
```

---

### Offer Endpoints

#### Get All Offers
```javascript
GET /offer
```
**Frontend:**
```javascript
const offers = await getOffers();
```

#### Get Offer by ID
```javascript
GET /offer/:id
```
**Frontend:**
```javascript
const offer = await getOfferById(offerId);
```

#### Get Offers by Property
```javascript
GET /offer/property/:propertyId
```
**Frontend:**
```javascript
const offers = await getOffersByProperty(propertyId);
```

#### Submit/Create Offer
```javascript
POST /offer
Content-Type: application/json

{
  "buyerName": "John Doe",
  "buyerEmail": "john@example.com",
  "buyerPhone": "(555) 123-4567",
  "agentName": "Jane Smith",
  "propertyAddress": "123 Main St",
  "offerPrice": 450000,
  "earnestMoneyAmount": 10000,
  "closingDate": "2026-07-15",
  "contingencies": ["inspection", "financing"],
  "financingType": "conventional",
  "loanAmount": 360000,
  "downPayment": 20,
  "lenderName": "Chase Bank",
  "approvalStatus": "pre-approval",
  "additionalNotes": "Strong buyer"
}
```
**Frontend:**
```javascript
const offer = await submitOffer({
  buyerName: "John Doe",
  buyerEmail: "john@example.com",
  // ... other fields
});
```

#### Update Offer
```javascript
PUT /offer/:id
```
**Frontend:**
```javascript
await updateOffer(offerId, updateData);
```

#### Delete Offer
```javascript
DELETE /offer/:id
```
**Frontend:**
```javascript
await deleteOffer(offerId);
```

---

### Upload Endpoints

#### Upload Generic File
```javascript
POST /upload
Content-Type: multipart/form-data

file: File
```
**Frontend:**
```javascript
await uploadFile(file);
```

#### Upload Disclosure Document
```javascript
POST /disclosure/upload
Content-Type: multipart/form-data

propertyId: string (uuid)
file: File (PDF)
```
**Frontend:**
```javascript
await uploadDisclosurePdf(propertyId, pdfFile);
```

#### Upload Purchase Contract
```javascript
POST /offer/upload-contract
Content-Type: multipart/form-data

offerId: string (uuid)
file: File (PDF)
```
**Frontend:**
```javascript
await uploadContractPdf(offerId, contractFile);
```

#### Upload Loan Approval Document
```javascript
POST /offer/upload-loan
Content-Type: multipart/form-data

offerId: string (uuid)
file: File (PDF/Image)
```
**Frontend:**
```javascript
await uploadLoanDocument(offerId, loanFile);
```

---

## Data Models

### Property Entity
```typescript
{
  id: string (UUID);
  address: string;
  city: string;
  state: string;
  zipCode: string;
  yearBuilt?: number;
  squareFeet?: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Disclosure Entity
```typescript
{
  id: string (UUID);
  propertyId: string (UUID);
  disclosureType: string;
  rawContent: string;
  analysisStatus: "pending" | "completed" | "failed";
  intelligenceAnalysis?: {
    identifiedRisks: Array<{
      category: string;
      description: string;
      severity: string;
    }>;
    overallRiskLevel: string;
    keyFindings: string[];
    recommendations: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### Offer Entity
```typescript
{
  id: string (UUID);
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  agentName?: string;
  propertyAddress: string;
  offerPrice: number;
  earnestMoneyAmount?: number;
  closingDate: Date;
  contingencies: string[];
  financingType: string;
  loanAmount?: number;
  downPayment?: number;
  lenderName?: string;
  approvalStatus: string;
  additionalNotes?: string;
  contractDocumentId?: string;
  loanDocumentId?: string;
  analysisStatus: "pending" | "completed" | "failed";
  intelligenceAnalysis?: {
    bidStrengthScore: number (0-100);
    financingReliability: number (0-1);
    closingProbability: number (0-1);
    riskFactors: string[];
    explanation: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Error Handling

### Error Response Format
```javascript
{
  "statusCode": 400,
  "message": "Error message here",
  "error": "Bad Request"
}
```

### Common Status Codes
- **200**: Success
- **201**: Created
- **400**: Bad Request (validation error)
- **404**: Not Found
- **500**: Server Error

### Frontend Error Handling
```javascript
import { showError } from './utils/toast';

try {
  const offers = await getOffers();
} catch (error) {
  const message = error?.response?.data?.message || 'Failed to load offers';
  showError(message);
}
```

---

## Authentication

Currently, the API includes auth token support:

```javascript
// Token is automatically added from localStorage
const token = localStorage.getItem("accessToken");

// Sent as Bearer token in Authorization header
headers: {
  "Authorization": `Bearer ${token}`
}
```

---

## Rate Limiting

No specific rate limiting mentioned in backend, but consider implementing:
- Per-user rate limits
- File upload size limits (10MB recommended)
- Request timeouts (30s configured in axios)

---

## File Upload Guidelines

### Maximum File Sizes
- Disclosure PDF: 10MB
- Contract PDF: 10MB
- Loan Document: 10MB

### Accepted File Types
- PDFs: `.pdf`
- Images: `.jpg`, `.jpeg`, `.png`, `.gif`

### Upload Example
```javascript
const handleFileUpload = async (file) => {
  if (file.size > 10 * 1024 * 1024) {
    showError("File too large (max 10MB)");
    return;
  }

  try {
    await uploadDisclosurePdf(propertyId, file);
    showSuccess("Document uploaded successfully");
  } catch (error) {
    showError("Upload failed: " + error.message);
  }
};
```

---

## Response Data Flow

### Property Creation Flow
```
Frontend Form
    ↓
Validation
    ↓
POST /property
    ↓
Backend Creates Record
    ↓
Returns Property Object
    ↓
Frontend Updates State
    ↓
Toast Notification
```

### Offer Analysis Flow
```
Frontend Submits Offer
    ↓
POST /offer
    ↓
Backend Stores Offer
    ↓
Queue Task for AI Analysis
    ↓
AI Processor Analyzes (Background)
    ↓
Updates intelligenceAnalysis Field
    ↓
Frontend Polls or Receives Update
    ↓
Display Results
```

---

## Debugging

### Enable Debug Logging
```bash
VITE_DEBUG=true npm run dev
```

This will log:
- All API calls
- Request/response data
- Configuration details

### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Perform action that makes API call
4. Click on request
5. Check:
   - URL
   - Method (GET, POST, etc.)
   - Status code
   - Request body
   - Response data

### Common Issues

**404 Not Found**
- Check endpoint URL is correct
- Verify backend is running
- Check resource ID exists

**400 Bad Request**
- Check request payload format
- Verify required fields
- Check data types

**500 Server Error**
- Check backend logs
- Verify database connection
- Check file permissions

---

## Testing API Endpoints

### Using curl
```bash
# Get all properties
curl http://localhost:3000/property

# Create property
curl -X POST http://localhost:3000/property \
  -H "Content-Type: application/json" \
  -d '{
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  }'

# Upload file
curl -X POST http://localhost:3000/disclosure/upload \
  -F "propertyId=uuid-here" \
  -F "file=@/path/to/file.pdf"
```

### Using Postman
1. Import collection (if available)
2. Set environment variables
3. Test endpoints
4. Check responses

---

## API Versioning

Current API Version: **v1** (No prefix in current implementation)

Future versions might use:
- `/v2/property`
- `/v2/offer`
- etc.

---

## Documentation Links

- Backend OpenAPI/Swagger: `http://localhost:3000/api-docs` (if enabled)
- Frontend API Module: `src/api/`
- Backend Controllers: See backend project

---

**Last Updated**: June 17, 2026
**Frontend Version**: 1.0.0
**Backend Integration Status**: ✅ Complete
