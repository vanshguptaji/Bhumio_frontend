# 🎨 VISUAL FLOW DIAGRAMS

## Data Flow: Form → API

### ❌ BEFORE (Wrong - Causing 400 Errors)
```
┌─────────────────────────────────────────────────┐
│           BUY SUBMISSION FORM                    │
│  ┌─────────────────────────────────────────┐   │
│  │ Step 1: Buyer Info                      │   │
│  │ • buyerName                             │   │
│  │ • buyerEmail                            │   │
│  │ • buyerPhone ← Extra                    │   │
│  │ • agentName ← Extra                     │   │
│  └─────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────┐   │
│  │ Step 2: Offer Details                   │   │
│  │ • propertyAddress                       │   │
│  │ • offerPrice                            │   │
│  │ • earnestMoneyAmount ← Extra            │   │
│  │ • closingDate ← Wrong field name        │   │
│  │ • contingencies ← Wrong format          │   │
│  └─────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────┐   │
│  │ Step 3: Financing                       │   │
│  │ • financingType ← Wrong API             │   │
│  │ • loanAmount ← Wrong API                │   │
│  │ • downPayment ← Extra                   │   │
│  │ • lenderName ← Wrong API                │   │
│  │ • approvalStatus ← Wrong API            │   │
│  │ • additionalNotes ← Wrong field         │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
                    ↓
        ┌──────────────────────────┐
        │  toSnakeCaseObject()     │ ← WRONG!
        │  Converts ALL to         │
        │  snake_case              │
        └──────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│         API PAYLOAD (WRONG)                      │
│  {                                               │
│    "buyer_name": "...",         ← snake_case    │
│    "buyer_email": "...",                        │
│    "buyer_phone": "...",        ← EXTRA         │
│    "agent_name": "...",         ← EXTRA         │
│    "offer_price": 850000,                       │
│    "earnest_money_amount": ..., ← EXTRA         │
│    "closing_date": "...",       ← WRONG NAME    │
│    "contingencies": [],         ← WRONG FORMAT  │
│    "financing_type": "...",     ← EXTRA         │
│    "loan_amount": ...,          ← EXTRA         │
│    ... 13 MORE WRONG FIELDS ...                 │
│  }                                               │
└─────────────────────────────────────────────────┘
                    ↓
        ┌──────────────────────────┐
        │  Backend Validation      │
        └──────────────────────────┘
                    ↓
        ┌──────────────────────────┐
        │  ❌ 400 BAD REQUEST      │
        │  Unknown fields!         │
        └──────────────────────────┘
```

---

### ✅ AFTER (Correct)
```
┌─────────────────────────────────────────────────┐
│           BUYER SUBMISSION FORM                  │
│  (Collects same info, but filtered on submit)   │
│  ┌─────────────────────────────────────────┐   │
│  │ All form fields collected               │   │
│  │ • buyerName, buyerEmail, buyerPhone ... │   │
│  │ • propertyAddress, offerPrice, etc.     │   │
│  │ • All financing and contingency info    │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
                    ↓
        ┌──────────────────────────┐
        │  handleSubmitOffer()      │
        │  Filters to only send:    │
        │  • propertyId             │
        │  • buyerName              │
        │  • buyerEmail             │
        │  • offerPrice             │
        │  • closingDays ← Calculated
        │  • contingencies ← Booleans
        │  • additionalConditions   │
        └──────────────────────────┘
                    ↓
        ┌──────────────────────────┐
        │  cleanPayload()          │
        │  Remove empty values      │
        └──────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│         API PAYLOAD (CORRECT)                    │
│  {                                               │
│    "propertyId": "...",         ← camelCase ✅  │
│    "buyerName": "...",          ← camelCase ✅  │
│    "buyerEmail": "...",         ← camelCase ✅  │
│    "offerPrice": 850000,        ← camelCase ✅  │
│    "closingDays": 30,           ← camelCase ✅  │
│    "inspectionContingency": true, ← Boolean ✅  │
│    "financingContingency": true,  ← Boolean ✅  │
│    "appraisalContingency": false, ← Boolean ✅  │
│    "additionalConditions": "..."  ← camelCase ✅ │
│  }                                               │
│  (9 fields total - all expected)                 │
└─────────────────────────────────────────────────┘
                    ↓
        ┌──────────────────────────┐
        │  Backend Validation      │
        └──────────────────────────┘
                    ↓
        ┌──────────────────────────┐
        │  ✅ 201 CREATED          │
        │  Success!                │
        │  {                       │
        │    "id": "...",          │
        │    "propertyId": "...",  │
        │    ... offer data ...    │
        │  }                       │
        └──────────────────────────┘
```

---

## API Sequence Diagram

### Complete Happy Path Flow

```
┌─────────────┐              ┌──────────────────┐
│   Frontend  │              │     Backend      │
│  (Browser)  │              │    (NestJS)      │
└─────────────┘              └──────────────────┘
      │                              │
      │  1. Submit Property          │
      │──────────────────────────────>
      │   {address, city, state, zip}│
      │                              │
      │                       [Create]
      │                              │
      │<──────── 201 Created ────────│
      │   {id, address, ...}         │
      │                              │
      │  2. Submit Offer             │
      │─────────────────────────────>
      │   {propertyId, buyerName, ..}
      │                              │
      │                       [Create]
      │                              │
      │<──────── 201 Created ────────│
      │   {id, propertyId, ...}      │
      │                              │
      │  3. Submit Loan              │
      │─────────────────────────────>
      │   {offerId, lenderName, ...} │
      │                              │
      │                       [Create]
      │                              │
      │<──────── 201 Created ────────│
      │   {id, offerId, ...}         │
      │                              │
      │  4. Upload Documents         │
      │─────────────────────────────>
      │   {file: contract.pdf}       │
      │                              │
      │<──────── 200 OK ─────────────│
      │   {url: "s3://..."}          │
      │                              │
      │  ✅ SUCCESS! ✅              │
      │  Form resets                 │
      │                              │
```

---

## API Endpoint Mapping

### Form Fields → API Endpoints

```
┌────────────────────────────────────────────────────────┐
│  FORM FIELD GROUPS                                      │
└────────────────────────────────────────────────────────┘

GROUP 1: BUYER INFO
├─ buyerName ────────────→ OFFER API
├─ buyerEmail ───────────→ OFFER API
├─ buyerPhone ───────────→ ❌ NOT USED (extra)
└─ agentName ────────────→ ❌ NOT USED (extra)

GROUP 2: PROPERTY INFO
├─ propertyAddress ──────→ PROPERTY API ──┐
├─ city (input)? ────────→ PROPERTY API   ├─ Property Creation
├─ state (input)? ───────→ PROPERTY API   │  Needed before Offer
└─ zipCode (input)? ─────→ PROPERTY API ──┘

GROUP 3: OFFER DETAILS
├─ offerPrice ───────────→ OFFER API
├─ closingDate ──────────→ OFFER API (as closingDays)
├─ earnestMoneyAmount ───→ ❌ NOT USED (extra)
├─ inspectionContingency → OFFER API
├─ financingContingency ─→ OFFER API
├─ appraisalContingency ─→ OFFER API
└─ otherContingencies ───→ OFFER API (as additionalConditions)

GROUP 4: FINANCING (LOAN API)
├─ financingType ────────→ LOAN API
├─ loanAmount ───────────→ LOAN API
├─ downPayment ──────────→ ❌ NOT USED (extra)
├─ lenderName ───────────→ LOAN API
└─ approvalStatus ───────→ LOAN API (as 'approved' boolean)

GROUP 5: DOCUMENTS
├─ contractPdf ──────────→ UPLOAD API
└─ loanDocument ─────────→ UPLOAD API
```

---

## Architecture Overview

### Three-Tier API Structure

```
┌──────────────────────────────────────────────┐
│           FRONTEND (React)                    │
│  BuyerSubmission.jsx Component               │
│  • Collects all form data                    │
│  • Filters to endpoint-specific data         │
│  • Orchestrates API calls                    │
└──────────────────────────────────────────────┘
            ↓        ↓        ↓
    ┌───────┘        │        └────────┐
    ↓                ↓                  ↓
┌────────────┐  ┌─────────┐  ┌──────────────┐
│ API Layer  │  │ Helpers │  │ Upload Svc   │
├────────────┤  ├─────────┤  ├──────────────┤
│property.   │  │ axios   │  │uploadFile    │
│offer.      │  │ cleanup │  │uploadPDF     │
│disclosure. │  │ format  │  │uploadDocument│
│loan.       │  │         │  │              │
└────────────┘  └─────────┘  └──────────────┘
    ↓                              ↓
    └──────────────┬───────────────┘
                   ↓
    ┌──────────────────────────────┐
    │  BACKEND API (NestJS)         │
    │  ┌──────────────────────────┐ │
    │  │ Property Controller      │ │
    │  │ Offer Controller         │ │
    │  │ Loan Controller          │ │
    │  │ Upload Controller        │ │
    │  └──────────────────────────┘ │
    │          ↓ ↓ ↓ ↓              │
    │  ┌──────────────────────────┐ │
    │  │     Database             │ │
    │  └──────────────────────────┘ │
    └──────────────────────────────┘
```

---

## Error Handling Flow

### ❌ Error Scenario

```
User Submits Form
    ↓
Check Required Fields ✓
    ↓
Create Property
    ├─ ✓ Success → propertyId
    └─ ✗ Fail → Log error, continue
    ↓
Create Offer (with propertyId)
    ├─ ✓ Success → offerId + Show Success Toast
    ├─ ✗ Validation Error → Parse error message + Show Error Toast
    │   Examples:
    │   • "offerPrice must be positive"
    │   • "buyerEmail must be valid"
    │   • "closingDays must be > 0"
    └─ ✗ 400 Bad Request → Parse and display
        (This was the original issue)
    ↓
Upload Documents (with offerId)
    ├─ ✓ Success
    └─ ✗ Fail → Log error (non-blocking)
    ↓
Show Final Status to User
```

---

## Validation Rules

### Field Validation Layers

```
┌────────────────────────────────────────────┐
│  LAYER 1: Frontend Validation               │
│  • Required fields present?                │
│  • Email format valid?                     │
│  • Price > 0?                              │
│  • Date in future?                         │
│  ✓ Pass → Continue                         │
│  ✗ Fail → Show error, stop submission     │
└────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────┐
│  LAYER 2: API Request Validation            │
│  • Only expected fields?                   │
│  • Field names correct?                    │
│  • Data types correct?                     │
│  ✓ Pass → Continue to backend              │
│  ✗ Fail → 400 Bad Request (THIS WAS ISSUE)│
└────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────┐
│  LAYER 3: Backend Validation                │
│  • Business logic validation?              │
│  • Database constraints?                   │
│  • Permission checks?                      │
│  ✓ Pass → 201 Created                      │
│  ✗ Fail → 400/422/500 with reason         │
└────────────────────────────────────────────┘
```

---

## Summary: Before vs After

### Before (❌ Broken)
```
Form → toSnakeCaseObject() → Extra/Wrong Fields → 400 Error
```

### After (✅ Working)
```
Form → Filter to Expected Fields → cleanPayload() → 201 Success
```

---

**Visual diagrams created for better understanding of the flow and architecture.**
