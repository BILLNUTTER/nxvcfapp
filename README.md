# NUTTERX VCF SYSTEM

A professional contact registration and VCF file generation system built with React, TypeScript, Express, and MongoDB.

## Features

- **No Authentication Required**: Users land directly on the dashboard
- **Contact Registration**: Collect full name, phone number, and contact link
- **Live Progress Tracking**: Real-time counter showing collected contacts (0-250)
- **Duplicate Prevention**: Phone numbers must be unique
- **Rate Limiting**: 5-second delay between submissions to prevent spam
- **Automatic VCF Generation**: When 250 contacts are collected, download becomes available
- **VCF Export**: Generates valid vCard 3.0 format with all contact information
- **Mobile-Friendly**: Fully responsive design
- **Professional Validation**: Phone number and URL validation

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express.js
- **Database**: MongoDB Atlas
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Database Schema

### MongoDB - contacts collection
```javascript
{
  _id: ObjectId,
  name: string,              // Contact's full name
  phone_number: string,      // Unique phone number (10-15 digits)
  link: string,              // Contact link (e.g., WhatsApp channel)
  created_at: Date           // Timestamp of registration
}
```

**Index**: `phone_number` (unique)

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account with connection string

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```
MONGODB_URI=mongodb+srv://admin:admin@whatsapp-cluster.38vq8k0.mongodb.net/nxvcfapp
VITE_API_URL=http://localhost:5000
```

3. Start the system:
```bash
npm start
```

This runs both the backend server and frontend:
- Backend API: http://localhost:5000
- Frontend: http://localhost:5173

### Development

For development with hot reload:
```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

Outputs optimized frontend to `dist/` folder.

## How It Works

1. **User Registration**: Users enter their name, phone number, and contact link
2. **Validation**: System validates phone format and URL format
3. **Rate Limiting**: Client enforces 5-second delay between submissions
4. **Storage**: Valid entries are stored in MongoDB with duplicate prevention
5. **Live Counter**: Progress updates in real-time (polls every 3 seconds)
6. **Target Reached**: At 250 contacts, form is replaced with download button
7. **VCF Download**: Generates valid vCard 3.0 file with all collected contacts

## API Endpoints

### Get Contact Count
```
GET /api/contacts/count
Response: { count: number }
```

### Get All Contacts
```
GET /api/contacts
Response: { contacts: Contact[] }
```

### Create Contact
```
POST /api/contacts
Body: {
  name: string,
  phone_number: string,
  link: string
}
Response: {
  message: string,
  contact: Contact
}
Error: 409 (duplicate phone) or 400 (invalid data)
```

## VCF File Format

Generated vCard 3.0 format:
```
BEGIN:VCARD
VERSION:3.0
FN:John Doe
N:John Doe;;;;
TEL;TYPE=CELL:1234567890
URL:https://whatsapp.com/channel/...
END:VCARD
```

## Security Features

- **Phone Uniqueness**: Database constraint prevents duplicate phone numbers
- **Rate Limiting**: Client-side 5-second throttle between submissions
- **Input Validation**: Phone (10-15 digits) and URL format validation
- **CORS**: Express configured with CORS for frontend communication
- **Error Handling**: Graceful error messages for all edge cases

## Deployment

### Backend Deployment (Vercel, Render, Heroku, etc.)
- Deploy `server.js` with Node.js runtime
- Set environment variables for MongoDB URI
- Ensure `PORT` defaults to 5000 if not specified

### Frontend Deployment (Vercel, Netlify, etc.)
1. Build the project: `npm run build`
2. Deploy the `dist/` folder as static site
3. Set environment variable: `VITE_API_URL=<your-backend-url>`

## File Structure

```
project/
├── src/
│   ├── App.tsx              # Main React component
│   ├── main.tsx             # React entry point
│   ├── index.css            # Tailwind CSS
│   ├── utils/
│   │   ├── phoneValidation.ts
│   │   ├── vcfGenerator.ts
│   │   └── rateLimiter.ts
│   └── lib/
│       └── supabase.ts      # (Legacy - not used with MongoDB)
├── server.js                # Express backend server
├── .env                     # Environment variables
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

## Notes

- The MongoDB connection is configured with authentication
- Phone numbers are stored without formatting (digits only)
- Contact names are stored as provided by users
- All submissions are timestamped for audit purposes
- The 250-contact limit is enforced at the application level

## Support

For issues or questions about the NUTTERX VCF System, please check:
1. MongoDB Atlas connection status
2. Network connectivity to backend API
3. Browser console for client-side errors
4. Server logs for backend errors

## License

MIT
