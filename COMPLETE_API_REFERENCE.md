# 📝 Complete API Field Reference - Corrected

## All API Endpoints - Required vs Sent Fields

### 1️⃣ CREATE PROPERTY - `/api/v1/properties`

#### ✅ CORRECT Payload Format
```javascript
{
  "address": "123 Main Street",           // Required: 5-255 chars
  "city": "San Francisco",                // Required: 2-100 chars
  "state": "CA",                          // Required: 2-50 chars
  "zipCode": "94102"                      // Required: 5-10 chars
}
```

#### ❌ DO NOT SEND
- `propertyId` (server generates this)
- `createdAt`, `updatedAt` (server generates these)
- Any other fields

#### 🔧 Frontend Implementation
```javascript
// src/api/property.api.js
export const createProperty = (payload) =>
  api.post("/api/v1/properties", payload);

// BuyerSubmission.jsx
const propertyPayload = {
  address: formData.propertyAddress,
  city: formData.city,        // ← Add this to form
  state: formData.state,      // ← Add this to form
  zipCode: formData.zipCode,  // ← Add this to form
};
const created = await createProperty(propertyPayload);
```

---

### 2️⃣ CREATE OFFER - `/api/v1/offers`

#### ✅ CORRECT Payload Format
```javascript
{
  "propertyId": "550e8400-e29b-41d4-a716-446655440000",  // Required: Valid UUID
  "buyerName": "John Smith",                              // Required: String
  "buyerEmail": "john.smith@example.com",                 // Required: Valid email
  "offerPrice": 850000,                                   // Required: Number
  "closingDays": 30,                                      // Required: Integer (days from now)
  "inspectionContingency": true,                          // Optional: Boolean
  "financingContingency": true,                           // Optional: Boolean
  "appraisalContingency": false,                          // Optional: Boolean
  "additionalConditions": "Seller to provide warranty"    // Optional: String
}
```

#### ❌ DO NOT SEND (Common mistakes)
- `buyerPhone` ❌
- `agentName` ❌
- `earnestMoneyAmount` ❌
- `closingDate` ❌ (use closingDays instead)
- `contingencies` ❌ (use individual boolean fields)
- `financingType` ❌ (belongs to Loan API)
- `loanAmount` ❌ (belongs to Loan API)
- `downPayment` ❌ (belongs to Loan API)
- `lenderName` ❌ (belongs to Loan API)
- `approvalStatus` ❌ (belongs to Loan API)
- `additionalNotes` ❌ (use additionalConditions instead)

#### 🔧 Frontend Implementation
```javascript
// src/api/offer.api.js
export const submitOffer = (payload) => {
  const required = ["buyerName", "buyerEmail", "offerPrice"];
  const missing = required.filter(
    (k) => !payload[k]
  );
  if (missing.length > 0) {
    return Promise.reject(new Error(`Missing: ${missing.join(", ")}`));
  }
  return api.post("/api/v1/offers", payload);
};

// BuyerSubmission.jsx
const offerPayload = {
  propertyId: propertyId,
  buyerName: formData.buyerName,
  buyerEmail: formData.buyerEmail,
  offerPrice: parseFloat(formData.offerPrice),
  closingDays: calculateDaysFromDate(formData.closingDate),
  inspectionContingency: formData.inspectionContingency || false,
  financingContingency: formData.financingContingency || false,
  appraisalContingency: formData.appraisalContingency || false,
  additionalConditions: formData.otherContingencies || undefined,
};

const offerResponse = await submitOffer(offerPayload);

// THEN create loan separately with financing details
const loanPayload = {
  offerId: offerResponse.id,
  lenderName: formData.lenderName,
  approved: formData.approvalStatus === 'clear-to-close',
  loanAmount: parseFloat(formData.loanAmount),
  financingType: formData.financingType,
};
await createLoan(loanPayload);
```

---

### 3️⃣ CREATE DISCLOSURE - `/api/v1/disclosures`

#### ✅ CORRECT Payload Format
```javascript
{
  "propertyId": "550e8400-e29b-41d4-a716-446655440000",  // Required: Valid UUID
  "fileUrl": "s3://bucket-name/disclosure.pdf"           // Required: String, max 500 chars
}
```

#### ❌ DO NOT SEND
- `summary` (server generates this)
- `structuralRisk`, `legalRisk`, etc. (server calculates these)
- Any other fields

---

### 4️⃣ CREATE LOAN - `/api/v1/loans`

#### ✅ CORRECT Payload Format
```javascript
{
  "offerId": "770e8400-e29b-41d4-a716-446655440002",     // Required: Valid UUID
  "lenderName": "Chase Bank",                             // Required: String
  "approved": true,                                       // Required: Boolean
  "loanAmount": 680000,                                   // Required: Number
  "financingType": "Conventional"                         // Required: String
}
```

#### ❌ DO NOT SEND
- `financingStrength` (server calculates this)
- Any other fields

#### 🔧 Frontend Implementation
```javascript
// src/api/loan.api.js
export const createLoan = (payload) =>
  api.post("/api/v1/loans", cleanPayload(payload));

// BuyerSubmission.jsx - Call AFTER offer creation
const loanPayload = {
  offerId: offerResponse.id,
  lenderName: formData.lenderName,
  approved: formData.approvalStatus === 'clear-to-close',
  loanAmount: parseFloat(formData.loanAmount),
  financingType: formData.financingType.toUpperCase(), // "Conventional", "FHA", etc.
};

try {
  await createLoan(loanPayload);
} catch (e) {
  console.error('Loan creation failed (non-critical):', e);
  // Don't fail the whole submission if loan creation fails
}
```

---

## 🎯 Complete Example Flow

```javascript
async function submitCompleteOffer() {
  try {
    // STEP 1: Create Property
    const propertyPayload = {
      address: "123 Main St",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102"
    };
    const property = await createProperty(propertyPayload);
    
    // STEP 2: Create Offer
    const offerPayload = {
      propertyId: property.id,
      buyerName: "John Smith",
      buyerEmail: "john@example.com",
      offerPrice: 850000,
      closingDays: 30,
      inspectionContingency: true,
      financingContingency: true,
      appraisalContingency: false,
      additionalConditions: "Home warranty"
    };
    const offer = await submitOffer(offerPayload);
    
    // STEP 3: Create Loan (Financing Details)
    const loanPayload = {
      offerId: offer.id,
      lenderName: "Chase Bank",
      approved: true,
      loanAmount: 680000,
      financingType: "Conventional"
    };
    await createLoan(loanPayload);
    
    // STEP 4: Upload Documents
    await uploadContractPdf(offer.id, contractFile);
    await uploadLoanDocument(offer.id, loanFile);
    
    console.log('✅ Offer submitted successfully!');
    
  } catch (error) {
    console.error('❌ Submission failed:', error);
    // Check the error response for validation details
  }
}
```

---

## 🔍 How to Debug 400 Errors

1. **Check the error response:**
   ```javascript
   // The backend usually returns which fields are invalid
   // e.g., { message: ["earnestMoneyAmount is not expected", ...] }
   ```

2. **Open browser DevTools Console and look for:**
   - "API Error" messages
   - The exact payload being sent

3. **Verify in Postman first:**
   - Copy your JSON from browser console
   - Test it in Postman against the same endpoint
   - If it works in Postman but not in your app, the payload formatting is wrong

4. **Common causes:**
   - ❌ Extra fields the API doesn't expect
   - ❌ Wrong field names (e.g., `closingDate` instead of `closingDays`)
   - ❌ Wrong data types (string instead of number)
   - ❌ Missing required fields
   - ❌ snake_case instead of camelCase

---

## ✅ Verification Checklist Before Submitting

- [ ] Only sending fields that are in the API documentation
- [ ] All field names are spelled correctly (case-sensitive!)
- [ ] All field names are in camelCase (not snake_case)
- [ ] All required fields have values (not empty strings)
- [ ] Numbers are sent as numbers, not strings
- [ ] Booleans are sent as booleans, not strings
- [ ] Testing in Postman works with the exact same payload

---

**Last Updated:** 2026-06-17
**API Version:** v1.0
