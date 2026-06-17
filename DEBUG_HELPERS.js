// 🧪 DEBUG HELPER - Add this temporarily to see exact payload being sent
// File: src/api/offer.api.js (at the top of the file, after imports)

/**
 * ⚠️ TEMPORARY DEBUG FUNCTION - Remove after testing
 * This will log the exact payload being sent to the API
 */
export const debugOfferPayload = (payload) => {
  console.log('=== 🔍 OFFER PAYLOAD DEBUG ===');
  console.log('Full Payload:', JSON.stringify(payload, null, 2));
  console.log('');
  
  // Check for required fields
  const required = ['propertyId', 'buyerName', 'buyerEmail', 'offerPrice'];
  console.log('✅ Required Fields Check:');
  required.forEach(field => {
    const value = payload[field];
    const status = value !== undefined && value !== null && value !== '' ? '✓' : '✗';
    console.log(`  ${status} ${field}: ${value}`);
  });
  console.log('');
  
  // Check for optional fields
  const optional = ['closingDays', 'inspectionContingency', 'financingContingency', 'appraisalContingency', 'additionalConditions'];
  console.log('Optional Fields:');
  optional.forEach(field => {
    const value = payload[field];
    if (value !== undefined && value !== null) {
      console.log(`  ℹ ${field}: ${value} (type: ${typeof value})`);
    }
  });
  console.log('');
  
  // Check for UNEXPECTED fields (these will cause 400 errors)
  const expectedFields = new Set([...required, ...optional]);
  const unexpectedFields = Object.keys(payload).filter(key => !expectedFields.has(key));
  
  if (unexpectedFields.length > 0) {
    console.warn('⚠️ UNEXPECTED FIELDS (will cause 400 error):');
    unexpectedFields.forEach(field => {
      console.warn(`  ✗ ${field}: ${payload[field]} (REMOVE THIS)`);
    });
  } else {
    console.log('✅ No unexpected fields found');
  }
  console.log('=== End Debug ===');
};


// ============================================
// HOW TO USE IN BuyerSubmission.jsx:
// ============================================

/*
import { submitOffer, debugOfferPayload } from '../api/offer.api';

// Then in handleSubmitOffer() function, before calling submitOffer:

const offerPayload = {
  propertyId: propertyId,
  buyerName: formData.buyerName,
  buyerEmail: formData.buyerEmail,
  offerPrice: parseFloat(formData.offerPrice),
  closingDays: 30,
  inspectionContingency: formData.inspectionContingency || false,
  financingContingency: formData.financingContingency || false,
  appraisalContingency: formData.appraisalContingency || false,
  additionalConditions: formData.otherContingencies || undefined,
};

// 🔍 DEBUG: Log the exact payload
debugOfferPayload(offerPayload);

// Now send it
const offerResponse = await submitOffer(offerPayload);
*/
