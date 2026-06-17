# Bhumio Frontend - Complete Setup & Usage Guide

## 🎯 Quick Start

### Prerequisites
- Node.js 16 or higher
- npm or yarn
- Backend API running on `http://localhost:3000`

### Installation Steps

1. **Navigate to frontend directory**
```bash
cd /Users/vanshgupta/Developer/frontend/Bhumio_frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
```bash
cp .env.example .env.local
```

4. **Update environment variables (if needed)**
```bash
# Edit .env.local and set your API URL
VITE_API_URL=http://localhost:3000
```

5. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5174` (or the next available port)

---

## 📱 Application Features & Workflows

### 1. Dashboard (Home Page)
**Route:** `/`

**Overview:**
- System statistics (properties, offers, completed deals)
- Quick links to main features
- Top offers ranked by AI strength score
- Recent properties
- System health status

**What you can do:**
- View overall platform metrics
- Access quick navigation to seller/buyer portals
- Monitor top-performing offers

---

### 2. Seller Dashboard
**Route:** `/seller`

**Purpose:** Manage properties and upload disclosure documents

**Features:**
- ✅ Add new properties
- ✅ Fill property details (address, city, state, zip, year built, square feet)
- ✅ Upload property disclosure PDFs
- ✅ View uploaded properties

**Step-by-Step Usage:**

1. Click "Add New Property" button
2. Fill in the property details:
   - **Address**: Street address (e.g., "123 Main Street")
   - **City**: City name (e.g., "New York")
   - **State**: State abbreviation (e.g., "NY")
   - **Zip Code**: Postal code (e.g., "10001")
   - **Year Built**: Construction year (e.g., "2020")
   - **Square Feet**: Property size (e.g., "2500")

3. Click "Create Property"

4. Select the property and click "Upload Disclosure"

5. Upload a PDF document containing the property disclosure

6. Wait for AI analysis to complete

**What the AI does:**
- Analyzes the disclosure document
- Identifies property risks (structural, legal, financial, environmental)
- Generates risk assessment scores
- Creates actionable recommendations for buyers

**Expected Output:**
After AI processing, you can view:
- Risk identification reports
- Overall risk level (Low/Moderate/High/Critical)
- Key findings
- Recommendations for potential buyers

---

### 3. Submit Offer (Buyer Portal)
**Route:** `/buyer`

**Purpose:** Submit competitive offers with detailed financing information

**4-Step Process:**

#### Step 1: Buyer Information
Fill in your personal details:
- **Full Name**: Your name
- **Email**: Contact email
- **Phone**: Contact phone number
- **Real Estate Agent Name** (optional): Your agent's name

#### Step 2: Property & Offer Details
Enter offer specifics:
- **Property Address**: Full property address
- **Offer Price**: Your bid amount (e.g., "450000")
- **Earnest Money**: Deposit amount (e.g., "10000")
- **Closing Date**: Target closing date (select from calendar)
- **Contingencies**: Select any applicable:
  - ☑️ Inspection Contingency
  - ☑️ Financing Contingency
  - ☑️ Appraisal Contingency
  - Optional: Other contingencies (text field)

#### Step 3: Financing & Documentation
Provide financing details:
- **Financing Type**: Select one:
  - Conventional
  - FHA
  - VA
  - Cash Offer

- If not cash, fill:
  - **Loan Amount**: Mortgage amount (e.g., "360000")
  - **Down Payment %**: Down payment percentage (e.g., "20")
  - **Lender Name**: Bank/lender name (e.g., "Chase Bank")
  - **Approval Status**: 
    - Pre-Approval
    - Pre-Qualified
    - Conditional Approval
    - Clear to Close

- **Upload Documents:**
  - Purchase Contract (PDF) - Required
  - Loan Approval Proof (PDF or Image) - Required

- **Additional Notes** (optional): Any other information for seller

#### Step 4: Review & Submit
- Review all information
- Verify document uploads
- Click "Submit Offer"

**What happens after submission:**
1. Your offer is stored in the database
2. AI analyzes your offer:
   - Bid strength score (0-100)
   - Financing reliability (0-100%)
   - Closing probability (0-100%)
   - Risk factors
3. Your offer appears in "Offer Comparison" ranked by strength

---

### 4. Offer Comparison (Seller View)
**Route:** `/offers`

**Purpose:** Compare all offers received for a property

**How to use:**

1. **Select a Property** from dropdown
2. All offers for that property will load
3. View each offer with:
   - Buyer name
   - Offer price
   - Earnest money amount
   - Number of contingencies
   - Closing date
   - AI analysis scores

**AI Intelligence Shown:**
- **Strength Score**: Overall competitiveness (0-100)
  - 80+: Excellent
  - 60-79: Good
  - 40-59: Fair
  - <40: Weak

- **Financing Reliability**: Confidence in loan approval (0-100%)
- **Closing Probability**: Likelihood of deal completion (0-100%)
- **AI Insights**: Natural language explanation of offer quality

**Ranking:**
Offers are automatically ranked #1, #2, #3 based on strength scores
- ⭐ Gold badge for top offer
- ⭐ Silver badge for second
- ⭐ Bronze badge for third

---

### 5. Property Intelligence
**Route:** `/intelligence`

**Purpose:** Deep analysis of property disclosures

**Features:**
- Select any property disclosure
- View AI-generated analysis:
  - **Risk Identification**: Categorized risks
  - **Risk Level**: Overall assessment
  - **Key Findings**: Important discoveries
  - **Recommendations**: Actionable advice for buyers

**Risk Categories:**
- Structural issues
- Legal issues
- Financial issues
- Environmental concerns
- Other notable items

**Using this information:**
- Sellers can understand what issues may affect offers
- Buyers can make informed decisions about contingencies
- Both parties have transparent information

---

## 🔄 Complete User Workflows

### Workflow 1: Seller Lists Property
```
1. Go to Seller Dashboard (/seller)
2. Click "Add New Property"
3. Fill property details
4. Create property
5. Upload disclosure PDF
6. Wait for AI analysis
7. Check results in Property Intelligence page
8. Monitor incoming offers in Offer Comparison
```

### Workflow 2: Buyer Submits Offer
```
1. Go to Submit Offer (/buyer)
2. Complete 4-step form:
   - Personal info
   - Offer details
   - Financing & documents
   - Review
3. Submit offer
4. AI analyzes automatically
5. Your ranking appears in Offer Comparison
```

### Workflow 3: Seller Reviews & Compares Offers
```
1. Go to Offer Comparison (/offers)
2. Select property
3. View all offers ranked by strength
4. Read AI insights for each
5. Make informed decision
```

---

## 📊 Understanding AI Scores

### Bid Strength Score (0-100)
Calculated from:
- Offer price relative to ask
- Earnest money amount
- Number of contingencies
- Financing certainty
- Buyer profile strength

**Interpretation:**
- **90-100**: Excellent - Highest competition strength
- **75-89**: Very Good - Strong offer
- **60-74**: Good - Acceptable offer
- **45-59**: Fair - Average offer
- **Below 45**: Weak - May need renegotiation

### Financing Reliability (0-100%)
Based on:
- Approval status (Clear to Close = highest)
- Financing type (Conventional > FHA > VA > Cash)
- Down payment percentage
- Loan-to-value ratio
- Lender credibility

### Closing Probability (0-100%)
Considers:
- Financing reliability
- Contingency count
- Historical data patterns
- Market conditions
- Timeline feasibility

### Risk Factors
- Multiple contingencies = Higher risk
- Low earnest money = Higher risk
- Weak financing = Higher risk
- Long contingency periods = Higher risk

---

## 🛠 Technical Information

### API Endpoints Used

**Properties:**
```
GET  /api/v1/properties          - List all properties
POST /api/v1/properties          - Create property
GET  /api/v1/properties/:id      - Get property details
PUT  /api/v1/properties/:id      - Update property
```

**Disclosures:**
```
GET  /api/v1/disclosures              - List all
POST /api/v1/upload/disclosure        - Upload disclosure PDF
GET  /api/v1/disclosures/property/:id - Get by property
```

**Offers:**
```
GET  /api/v1/offers                   - List all offers
POST /api/v1/offers                   - Submit new offer
GET  /api/v1/offers/property/:id      - Get by property
POST /api/v1/upload/contract          - Upload contract
POST /api/v1/upload/loan              - Upload loan proof
```

### State Management

Using Zustand for reactive state:
- Property Store
- Offer Store
- Disclosure Store
- Auth Store

### Component Architecture

```
App
├── MainLayout
│   ├── Sidebar (Navigation)
│   ├── Header
│   └── Main Content Area
└── Routes
    ├── Dashboard
    ├── SellerDashboard
    ├── BuyerSubmission
    ├── OfferComparison
    └── PropertyIntelligence
```

---

## 🎨 UI/UX Tips

### Color Coding
- **Blue**: Primary actions, links
- **Green**: Success, positive actions, good scores
- **Yellow/Orange**: Warnings, moderate risk
- **Red**: Errors, high risk, danger actions
- **Gray**: Secondary actions, disabled states

### Progress Indicators
- Multi-step forms show progress (1/4, 2/4, etc.)
- Completed steps are highlighted in blue
- Current step is emphasized

### Form Validation
- Required fields marked with red asterisk (*)
- Error messages appear below fields in red
- Form can't be submitted with errors

---

## 🐛 Troubleshooting

### Issue: "Failed to resolve import"
**Solution:** Make sure all dependencies are installed
```bash
npm install
```

### Issue: API requests fail
**Solution:** Ensure backend is running
```bash
# Backend should be running on localhost:3000
# Check in terminal or access http://localhost:3000
```

### Issue: Styles not loading
**Solution:** Tailwind CSS compilation issue
```bash
npm run dev  # Restart dev server
```

### Issue: Port already in use
**Solution:** Kill process using port
```bash
lsof -ti:5174 | xargs kill -9
npm run dev
```

### Issue: File upload fails
**Solution:** Check file size and type
- Maximum file size: 10MB
- Accepted: PDF, JPEG, JPG, PNG, GIF

---

## 📈 Performance Tips

1. **Don't upload huge files** - Keep PDFs under 10MB
2. **Use modern browsers** - Chrome, Firefox, Safari, Edge
3. **Check network tab** - See API calls and response times
4. **Clear browser cache** - If things seem broken

---

## 🔐 Security Notes

- Tokens are stored in localStorage
- CORS is configured on backend
- API calls include authentication headers
- File uploads are validated server-side

---

## 📚 Additional Resources

- **Frontend Guide**: See `FRONTEND_GUIDE.md`
- **Component Docs**: Check individual component files
- **API Documentation**: See backend project README
- **Tailwind CSS**: https://tailwindcss.com

---

## ✨ Key Features Summary

| Feature | Module | AI Powered |
|---------|--------|-----------|
| Property Management | Seller Dashboard | ❌ |
| Disclosure Analysis | Property Intelligence | ✅ |
| Document Upload | All Forms | ❌ |
| Offer Submission | Buyer Portal | ❌ |
| Offer Ranking | Offer Comparison | ✅ |
| Risk Assessment | Intelligence | ✅ |
| Financing Analysis | Intelligence | ✅ |
| Closing Probability | Intelligence | ✅ |

---

## 🚀 Deployment

For production deployment:

1. **Build the application:**
```bash
npm run build
```

2. **Preview build:**
```bash
npm run preview
```

3. **Deploy dist folder** to:
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - Heroku
   - Docker container

4. **Set production API URL** in environment variables

---

**Last Updated:** June 17, 2026
**Version:** 1.0.0
**Status:** ✅ Ready for Development
