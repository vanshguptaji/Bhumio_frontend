# 🔴 CRITICAL API ISSUES FIXED

## Problem Summary

You were getting **400 Bad Request** errors because the frontend form was sending fields that **DO NOT EXIST** in the backend API documentation.

---

## 📋 What the API Expects vs What You Were Sending

### ✅ Create Offer - CORRECT Fields (from API Documentation)

```json
{
  "propertyId": "UUID",
  "buyerName": "string",
  "buyerEmail": "email",
  "offerPrice": 850000,
  "closingDays": 30,
  "inspectionContingency": true,
  "financingContingency": true,
  "appraisalContingency": false,
  "additionalConditions": "string (optional)"
}
```

### ❌ Create Offer - WRONG Fields (what your form was sending)

```json
{
  "propertyId": "UUID",
  "buyerName": "string",
  "buyerEmail": "email",
  "buyerPhone": "string",          // ❌ NOT IN API
  "agentName": "string",           // ❌ NOT IN API
  "offerPrice": 850000,
  "earnestMoneyAmount": 10000,    // ❌ NOT IN API
  "closingDate": "2026-07-17",    // ❌ NOT IN API (use closingDays instead)
  "contingencies": ["array"],      // ❌ WRONG FORMAT (should be boolean fields)
  "financingType": "string",       // ❌ NOT IN API
  "loanAmount": 680000,            // ❌ NOT IN API
  "downPayment": 170000,           // ❌ NOT IN API
  "lenderName": "string",          // ❌ NOT IN API
  "approvalStatus": "string",      // ❌ NOT IN API
  "additionalNotes": "string"      // ❌ NOT IN API
}
```

---

## ✅ Create Property - CORRECT Fields (from API Documentation)

```json
{
  "address": "123 Main Street",
  "city": "San Francisco",
  "state": "CA",
  "zipCode": "94102"
}
```

### ❌ Create Property - WRONG (what was being sent)

```json
{
  "address": "123 Main Street"    // ❌ INCOMPLETE - missing city, state, zipCode
}
```

---

## 🔧 Fixes Applied

### 1. **BuyerSubmission.jsx** - Property Creation Fix

**Before:**
```javascript
const created = await createProperty({ address: formData.propertyAddress });
```

**After:**
```javascript
const propertyPayload = {
  address: formData.propertyAddress,
  city: "Not Specified",
  state: "CA",
  zipCode: "00000",
};
const created = await createProperty(propertyPayload);
```

**✅ Better Solution:** Add form fields for city, state, zipCode (see below)

---

### 2. **BuyerSubmission.jsx** - Offer Payload Fix

**Before:**
```javascript
const offerPayload = {
  buyerName: formData.buyerName,
  buyerEmail: formData.buyerEmail,
  buyerPhone: formData.buyerPhone,           // ❌ REMOVED
  agentName: formData.agentName,             // ❌ REMOVED
  offerPrice: parseFloat(formData.offerPrice),
  earnestMoneyAmount: parseFloat(formData.earnestMoneyAmount),  // ❌ REMOVED
  closingDate: formData.closingDate,         // ❌ REMOVED
  contingencies: [...].filter(Boolean),      // ❌ REMOVED
  financingType: formData.financingType,     // ❌ REMOVED (belongs to Loan, not Offer)
  loanAmount: parseFloat(formData.loanAmount),    // ❌ REMOVED
  downPayment: parseFloat(formData.downPayment),  // ❌ REMOVED
  lenderName: formData.lenderName,           // ❌ REMOVED
  approvalStatus: formData.approvalStatus,   // ❌ REMOVED
  additionalNotes: formData.additionalNotes, // ❌ REMOVED
};
```

**After:**
```javascript
const offerPayload = {
  propertyId: propertyId,
  buyerName: formData.buyerName,
  buyerEmail: formData.buyerEmail,
  offerPrice: parseFloat(formData.offerPrice),
  closingDays: Math.ceil((new Date(formData.closingDate) - new Date()) / (1000 * 60 * 60 * 24)),
  inspectionContingency: formData.inspectionContingency || false,
  financingContingency: formData.financingContingency || false,
  appraisalContingency: formData.appraisalContingency || false,
  additionalConditions: formData.otherContingencies || undefined,
};
```

---

## 🎯 Next Steps to Fully Fix

### Option 1: Store Financing Data Separately (RECOMMENDED)

The extra fields (financingType, loanAmount, lender, etc.) should be handled in the **Loan API**, NOT the Offer API:

1. **Step 1:** Create Property
2. **Step 2:** Create Offer (with ONLY the 8 fields above)
3. **Step 3:** Create Loan Document (with financing details)

```javascript
// After offer is created, create loan separately
const loanPayload = {
  offerId: offerResponse.id,
  lenderName: formData.lenderName,
  approved: true,
  loanAmount: parseFloat(formData.loanAmount),
  financingType: formData.financingType,
};
await createLoan(loanPayload);
```

### Option 2: Add Missing Fields to Form

If you need to capture buyer phone and agent name, you could:
- Store them separately (not in the Offer)
- Or ask backend to add these fields to the Offer API

But based on the documentation, the backend doesn't support these fields for Offers.

---

## ✅ Verification Checklist

After making these changes:

- [ ] Property creation sends: `address`, `city`, `state`, `zipCode`
- [ ] Offer creation sends: `propertyId`, `buyerName`, `buyerEmail`, `offerPrice`, `closingDays`, contingencies (as booleans), `additionalConditions`
- [ ] Loan creation sends: `offerId`, `lenderName`, `approved`, `loanAmount`, `financingType`
- [ ] No extra/unknown fields are sent
- [ ] All field names are in camelCase (not snake_case)
- [ ] All required fields have values

---

## 🧪 Test with Postman

Send this exact payload to test:

```json
POST /api/v1/offers
{
  "propertyId": "550e8400-e29b-41d4-a716-446655440000",
  "buyerName": "John Smith",
  "buyerEmail": "john@example.com",
  "offerPrice": 850000,
  "closingDays": 30,
  "inspectionContingency": true,
  "financingContingency": true,
  "appraisalContingency": false,
  "additionalConditions": "Home warranty included"
}
```

If this works in Postman but not in your app, the form data formatting is still wrong.

---

## 🚨 Important Notes

1. **Field Name Spelling:** All field names MUST match documentation EXACTLY (including camelCase)
2. **Required Fields:** propertyId, buyerName, buyerEmail, offerPrice are REQUIRED
3. **Format Matters:** Numbers should be numbers (not strings), booleans should be booleans
4. **No Extra Fields:** Backend will reject requests with unknown fields

---

## 📚 API Files Modified

- ✅ `/src/api/property.api.js` - Removed snake_case conversion
- ✅ `/src/api/offer.api.js` - Removed snake_case conversion
- ✅ `/src/api/disclosure.api.js` - Removed snake_case conversion
- ✅ `/src/api/loan.api.js` - Removed snake_case conversion
- ✅ `/src/pages/BuyerSubmission.jsx` - Fixed payload to match API spec
