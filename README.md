# Bhargava GPT

A comprehensive GPT model designed to simulate integration with various Large Language Models, featuring a saffron-themed chat interface powered by the Gemini API.

## Features

- 🌐 Multi-language support (English, Hindi, Bengali, Tamil, Telugu, and more)
- 🎭 Multiple AI personas with customizable instructions
- 🔊 Voice input and output capabilities
- 💬 Chat history management
- 🎨 Beautiful saffron-themed UI
- 📱 Responsive design for all devices
- 🚀 Optimized for production

## Prerequisites

- Node.js (v16 or higher)
- Gemini API key from Google AI Studio

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd bhargava-gpt
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the root directory with your Gemini API key:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Start the development server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Production Deployment

### 1. Build the application

```bash
npm run build
```

This will create a `dist` directory with optimized production files.

### 2. Preview the production build locally

```bash
npm run preview
```

### 3. Deploy to a hosting service

The `dist` directory can be deployed to any static hosting service like Vercel, Netlify, or GitHub Pages.

#### Environment Variables for Production

Make sure to set the `GEMINI_API_KEY` environment variable in your hosting provider's settings.

## Project Structure

- `components/` - React components
- `services/` - API services
- `hooks/` - Custom React hooks
- `public/` - Static assets
- `types.ts` - TypeScript type definitions
- `personas.ts` - AI persona configurations
- `translations.ts` - Multi-language support

## Technologies Used

- React 19
- TypeScript
- Vite
- Google Gemini API
- Web Speech API for voice capabilities
- TailwindCSS for styling

## License

All rights reserved. Developed by Sumit Bhargava.
