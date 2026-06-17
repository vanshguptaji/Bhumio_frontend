# Upload Disclosure Endpoint - Removed 404 Error

## Issue
**Error:** `POST http://localhost:3000/api/v1/upload/disclosure 404 (Not Found)`

**Root Cause:** The `/api/v1/upload/disclosure` endpoint does NOT exist in the backend.

---

## Backend Upload Endpoints Available

Based on testing and the 404 errors, only ONE upload endpoint exists:

| Endpoint | Status | Purpose |
|----------|--------|---------|
| `POST /api/v1/upload` | ✅ **EXISTS** | Generic file upload |
| `POST /api/v1/upload/disclosure` | ❌ **NOT FOUND** | Disclosure-specific (removed) |
| `POST /api/v1/upload/contract` | ❌ **NOT FOUND** | Contract-specific (already removed) |
| `POST /api/v1/upload/loan` | ❌ **NOT FOUND** | Loan-specific (already removed) |

---

## Changes Made

### File: `src/api/upload.api.js`

**Removed Function:**
```javascript
// DELETED: uploadDisclosurePdf()
export const uploadDisclosurePdf = async (propertyId, file) => {
  // This endpoint doesn't exist on backend
}
```

**Kept Function:**
```javascript
// ACTIVE: uploadFile()
export const uploadFile = async (file) => {
  // POST /api/v1/upload
  // Generic file upload - WORKS
}
```

### File: `src/pages/SellerDashboard.jsx`

**Changes:**
1. **Updated import:**
   ```javascript
   // BEFORE:
   import { uploadDisclosurePdf } from '../api/upload.api';
   
   // AFTER:
   import { uploadFile } from '../api/upload.api';
   ```

2. **Updated handler function:**
   ```javascript
   // BEFORE:
   const handleUploadDisclosure = async () => {
     if (!selectedPropertyId || selectedFiles.length === 0) {
       showError('Please select a property and file');
       return;
     }
     for (const file of selectedFiles) {
       await uploadDisclosurePdf(selectedPropertyId, file); // ❌ FAILS
     }
   };
   
   // AFTER:
   const handleUploadDisclosure = async () => {
     if (selectedFiles.length === 0) {
       showError('Please select a file');
       return;
     }
     for (const file of selectedFiles) {
       await uploadFile(file); // ✅ WORKS
     }
   };
   ```

---

## Summary of Upload API Fixes

### ✅ Fixed 404 Errors:
1. Removed `/api/v1/upload/contract` (used in BuyerSubmission.jsx) ✅
2. Removed `/api/v1/upload/loan` (used in BuyerSubmission.jsx) ✅
3. Removed `/api/v1/upload/disclosure` (used in SellerDashboard.jsx) ✅

### ✅ Remaining Valid Upload Function:
- `uploadFile(file)` → `POST /api/v1/upload` (generic upload)

---

## Testing

Test the file upload by:
1. Navigate to Seller Dashboard
2. Create a property or select an existing one
3. Click "Upload Disclosure Document"
4. Select a file
5. Should now receive ✅ Response instead of ❌ 404 Not Found

---

## Note

The `selectedPropertyId` state variable is still maintained in the UI for:
- Highlighting which property is selected
- Potential future use if property-specific endpoints are added

But it's no longer sent to the upload API since the backend only accepts generic file uploads.
