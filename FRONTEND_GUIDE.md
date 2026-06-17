# Bhumio Frontend - AI-Powered Real Estate Intelligence Platform

A comprehensive React-based frontend application for the Bhumio Real Estate Intelligence system. This frontend enables sellers to manage property disclosures and buyers to submit competitive offers with AI-powered analysis.

## Features

### 1. **Dashboard**
- System overview with key statistics
- Active offers count
- Property listings
- Top offers by strength score
- Quick access to all modules

### 2. **Seller Dashboard**
- Property management (add new properties)
- Upload property disclosure documents (PDFs)
- View property details (year built, square footage, etc.)
- Integration with backend AI for disclosure analysis

### 3. **Buyer Submission Portal**
- Multi-step offer submission wizard
- Step 1: Buyer information (name, email, phone, agent)
- Step 2: Property & offer details (address, price, earnest money, closing date)
- Step 3: Financing & documentation (loan type, approval status, document uploads)
- Step 4: Review & submit
- Document upload support for contracts and loan approval proof

### 4. **Offer Comparison**
- View all offers for a selected property
- AI-generated offer strength scores
- Financing reliability assessment
- Closing probability estimation
- Risk factor analysis
- Ranking and sorting by strength score

### 5. **Property Intelligence**
- Analyze property disclosure documents
- AI-identified risk categories
- Risk level assessment (Low, Moderate, High, Critical)
- Key findings and recommendations
- Historical disclosure analysis

## Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **File Upload**: React Dropzone
- **Toast Notifications**: React Hot Toast
- **Charts**: Recharts (optional for analytics)
- **Routing**: React Router DOM

## Project Structure

```
src/
├── api/                 # API integration modules
│   ├── axios.js        # Axios configuration
│   ├── property.api.js # Property endpoints
│   ├── disclosure.api.js
│   ├── offer.api.js
│   ├── upload.api.js
│   └── ...
├── components/         # Reusable React components
│   ├── Button.jsx
│   ├── Card.jsx
│   ├── Modal.jsx
│   ├── Alert.jsx
│   ├── FormFields.jsx
│   ├── FileUpload.jsx
│   ├── IntelligenceCards.jsx
│   └── index.js
├── layouts/           # Layout components
│   └── MainLayout.jsx # Main app layout with sidebar
├── pages/             # Page components
│   ├── Dashboard.jsx
│   ├── SellerDashboard.jsx
│   ├── BuyerSubmission.jsx
│   ├── OfferComparison.jsx
│   └── PropertyIntelligence.jsx
├── stores/            # Zustand state management
│   └── index.js
├── utils/             # Utility functions
│   ├── formatters.js  # Currency, date formatting
│   └── toast.js       # Toast notification helpers
├── App.jsx            # Main app component
├── App.css            # Global styles
├── index.css          # Tailwind imports
└── main.jsx           # Entry point
```

## Installation & Setup

### Prerequisites
- Node.js 16+ installed
- Backend API running (typically on `http://localhost:3000`)

### Environment Setup

1. Clone or navigate to the project:
```bash
cd /Users/vanshgupta/Developer/frontend/Bhumio_frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (if needed):
```bash
VITE_API_URL=http://localhost:3000
```

### Running the Application

**Development Server**:
```bash
npm run dev
```
- Accessible at `http://localhost:5174` (or next available port)
- Hot module reloading enabled

**Production Build**:
```bash
npm run build
```

**Preview Production Build**:
```bash
npm run preview
```

## API Integration

The frontend integrates with the following backend endpoints:

### Properties
- `GET /api/v1/properties` - Get all properties
- `GET /api/v1/properties/:id` - Get property details
- `POST /api/v1/properties` - Create new property
- `PUT /api/v1/properties/:id` - Update property
- `DELETE /api/v1/properties/:id` - Delete property

### Disclosures
- `GET /api/v1/disclosures` - Get all disclosures
- `GET /api/v1/disclosures/:id` - Get disclosure details
- `GET /api/v1/disclosures/property/:propertyId` - Get by property
- `POST /api/v1/upload/disclosure` - Upload disclosure PDF

### Offers
- `GET /api/v1/offers` - Get all offers
- `POST /api/v1/offers` - Submit new offer
- `GET /api/v1/offers/property/:propertyId` - Get offers for property
- `POST /api/v1/upload/contract` - Upload purchase contract
- `POST /api/v1/upload/loan` - Upload loan approval proof

## Component Documentation

### Button Component
```jsx
<Button 
  variant="primary" // primary, secondary, danger, success, outline
  size="md" // sm, md, lg
  loading={false}
  disabled={false}
  fullWidth={true}
  onClick={handleClick}
>
  Click Me
</Button>
```

### Card Components
```jsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
  <CardFooter>
    Footer actions
  </CardFooter>
</Card>
```

### Input Fields
```jsx
<Input
  label="Field Label"
  placeholder="Enter value"
  required={true}
  error={errorMessage}
  fullWidth={true}
/>

<Textarea rows={4} label="Message" />

<Select 
  options={[{ value: 'id', label: 'Label' }]}
  label="Choose"
/>
```

### File Upload
```jsx
<FileUpload
  label="Upload PDF"
  onFiles={(files) => handleFiles(files)}
  accept="application/pdf"
  multiple={false}
/>
```

### Intelligence Cards
```jsx
<ScoreCard 
  label="Bid Strength" 
  score={85} 
  description="Overall strength"
/>

<OfferStrengthIndicator offer={offerData} />

<PropertyRiskIndicator disclosure={disclosureData} />
```

## State Management (Zustand Stores)

### Property Store
```javascript
import { usePropertyStore } from './stores';

const { properties, selectedProperty, loading } = usePropertyStore();
const { setProperties, setSelectedProperty } = usePropertyStore();
```

### Offer Store
```javascript
import { useOfferStore } from './stores';

const { offers, loading } = useOfferStore();
const { addOffer, updateOffer } = useOfferStore();
```

### Auth Store
```javascript
import { useAuthStore } from './stores';

const { user, isAuthenticated, userRole } = useAuthStore();
const { setUser, logout } = useAuthStore();
```

## Utilities

### Formatters
```javascript
import { 
  formatCurrency, 
  formatPercentage, 
  formatDate, 
  getScoreColor,
  getRiskLevel 
} from './utils/formatters';

formatCurrency(450000) // $450,000.00
formatPercentage(0.85) // 85.0%
formatDate('2026-06-17') // June 17, 2026
getScoreColor(75) // 'text-green-600 bg-green-50'
getRiskLevel(65) // 'Moderate Risk'
```

### Toast Notifications
```javascript
import { showSuccess, showError, showLoading } from './utils/toast';

showSuccess('Operation completed!');
showError('Something went wrong');
const toastId = showLoading('Processing...');
```

## UI Workflow Examples

### Seller Workflow
1. Navigate to Seller Dashboard
2. Click "Add New Property"
3. Fill in property details
4. Upload property disclosure PDF
5. View AI analysis on Property Intelligence page
6. Go to Offer Comparison to see all offers
7. Review AI-generated rankings and insights

### Buyer Workflow
1. Navigate to Submit Offer
2. Fill in buyer information (Step 1)
3. Enter property address and offer details (Step 2)
4. Upload contract and financing documents (Step 3)
5. Review offer details (Step 4)
6. Submit offer
7. System generates AI analysis
8. Check Offer Comparison to see how your offer ranks

## Styling

The application uses Tailwind CSS with custom Tailwind config:

```javascript
// tailwind.config.js
colors: {
  primary: "#1e40af",
  secondary: "#64748b",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#0ea5e9",
}
```

All components are styled with utility classes. Custom CSS is minimal and only used for animations and scrollbar styling.

## Performance Optimizations

- Code splitting with React Router
- Lazy component loading
- Memoization for expensive components
- Efficient state management with Zustand
- Optimized re-renders with proper React patterns

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development Guidelines

### Adding a New Page
1. Create new component in `src/pages/`
2. Export component
3. Add route in `App.jsx`
4. Add navigation link in `MainLayout.jsx`

### Adding a New Component
1. Create in `src/components/`
2. Export from `src/components/index.js`
3. Import and use where needed

### API Integration
1. Create API functions in `src/api/`
2. Use Axios instance from `src/api/axios.js`
3. Use stores for state management
4. Show toast notifications for user feedback

## Troubleshooting

### Port Already in Use
```bash
# Kill the process using port 5174
lsof -ti:5174 | xargs kill -9
# Or let Vite use another port
npm run dev
```

### Missing Dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Issues
```bash
npm run build
# Check for TypeScript errors (if using TS)
npm run lint
```

## Future Enhancements

- [ ] Dark mode support
- [ ] Advanced analytics dashboard
- [ ] Real-time offer notifications
- [ ] Document comparison view
- [ ] Export reports to PDF
- [ ] Multi-language support
- [ ] Mobile app with React Native
- [ ] WebSocket integration for real-time updates
- [ ] Advanced filtering and search
- [ ] User authentication and roles

## Support

For issues or questions, check:
1. Backend API logs
2. Browser console (F12)
3. Network tab to inspect API calls
4. Vite error overlay

## License

This project is part of the Bhumio Real Estate Intelligence Platform.
