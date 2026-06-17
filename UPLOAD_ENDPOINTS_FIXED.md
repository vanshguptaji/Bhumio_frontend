# Upload API Endpoints - Removed Non-Existent Endpoints

## Summary
Removed two non-existent upload endpoints that were causing 404 errors.

---

## Changes Made

### ✅ File: `src/api/upload.api.js`

**Removed Functions:**
1. `uploadContractPdf()` - Endpoint: `POST /api/v1/upload/contract` ❌ NOT FOUND
2. `uploadLoanDocument()` - Endpoint: `POST /api/v1/upload/loan` ❌ NOT FOUND

**Kept Functions:**
1. `uploadFile()` - Endpoint: `POST /api/v1/upload` ✅ EXISTS
2. `uploadDisclosurePdf()` - Endpoint: `POST /api/v1/upload/disclosure` ✅ EXISTS

---

### ✅ File: `src/pages/BuyerSubmission.jsx`

**Changes:**
1. Removed import statement:
   ```javascript
   // REMOVED:
   import { uploadContractPdf, uploadLoanDocument } from '../api/upload.api';
   ```

2. Removed upload calls from `handleSubmitOffer()` function:
   ```javascript
   // REMOVED: All try-catch blocks for:
   // - uploadContractPdf(offerResponse.id, uploadedFiles.contract)
   // - uploadLoanDocument(offerResponse.id, uploadedFiles.loanDocument)
   ```

---

## 404 Errors Fixed

| Endpoint | Status |
|----------|--------|
| POST /api/v1/upload/contract | ❌ REMOVED |
| POST /api/v1/upload/loan | ❌ REMOVED |

---

## Remaining Valid Upload Endpoints

| Function | Endpoint | Status |
|----------|----------|--------|
| `uploadFile()` | POST /api/v1/upload | ✅ ACTIVE |
| `uploadDisclosurePdf()` | POST /api/v1/upload/disclosure | ✅ ACTIVE |

---

## Note

- File upload functionality remains available for:
  - Generic files via `uploadFile(file)`
  - Disclosure PDFs via `uploadDisclosurePdf(propertyId, file)`
- Contract and loan document uploads are not supported by the backend yet
- If these features are needed, they should be implemented on the backend first
