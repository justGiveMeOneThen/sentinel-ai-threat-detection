# Sentinel AI - Threat Detection System

An AI-powered real-time threat detection and monitoring system with intelligent analysis capabilities.

## 🚀 Features

- **Real-time Threat Monitoring** - Live threat detection with automatic updates
- **AI-Powered Analysis** - Google Gemini integration for threat intelligence
- **Interactive Dashboard** - Visual analytics with charts and graphs
- **Threat Log Explorer** - Searchable, filterable threat database
- **Geographic Mapping** - Visual representation of threat origins
- **CSV Export** - Export threat data for further analysis

## 🛠️ Tech Stack

- **Frontend:** React + TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **AI:** Google Gemini API
- **Build Tool:** Vite

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Google Gemini API Key

## 🔧 Installation

1. **Clone the repository:**
```bash
git clone https://github.com/YOUR_USERNAME/sentinel-ai-threat-detection.git
cd sentinel-ai-threat-detection
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**

Create a `.env` file in the root directory:
```properties
VITE_API_KEY=your_google_gemini_api_key_here
```

4. **Start the development server:**
```bash
npm run dev
```

5. **Open your browser:**
Navigate to `http://localhost:5173`

## 🚀 Production Build
```bash
npm run build
npm run preview
```

## 📁 Project Structure
```
sentinel-ai/
├── src/
│   ├── components/      # React components
│   ├── services/        # API and data services
│   ├── types.ts         # TypeScript type definitions
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
├── public/              # Static assets
├── .env                 # Environment variables (DO NOT COMMIT)
├── package.json         # Dependencies
└── README.md           # This file
```

## 🔐 Security Notes

- **Never commit `.env` files** to version control
- Keep your API keys secure
- Use environment variables for sensitive data
- Review the Integration Guide for production deployment

## 📚 Documentation

See `INTEGRATION_GUIDE.md` for detailed instructions on:
- Replacing mock data with real threat intelligence
- API integration
- Data source configuration
- Deployment guidelines

## 👥 Team Access

Team members should:
1. Clone the repository
2. Run `npm install`
3. Get API keys from the team lead
4. Create their own `.env` file
5. Start development with `npm run dev`

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add some feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request

## 📝 License

[Your License Here]

## 📧 Contact

For questions or support, contact: [Your Email]
