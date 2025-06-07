# Weather Forecast App

This is a weather forecast application built with Next.js, React, and Tailwind CSS, featuring real-time weather data, hourly forecasts, 5-day forecasts with charting, theme toggling, location search, favorite locations, and PWA capabilities.

## Tech Stack

- **Framework:** Next.js 14.1.0 with App Router
- **UI Library:** React 18.2.0
- **Styling:** 
  - Tailwind CSS 3.3.3
  - shadcn/ui components
  - Radix UI primitives
- **State Management:** React Context API
- **Data Visualization:** Recharts 2.10.3
- **Type Safety:** TypeScript 5.2.2
- **API Integration:** Weather API
- **Date Handling:** date-fns 2.30.0
- **PWA Support:** 
  - Service Workers
  - Web App Manifest
- **Development Tools:** 
  - ESLint 8.49.0
  - PostCSS 8.4.30
  - Autoprefixer 10.4.15

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Main page component
│   ├── providers.tsx      # Context providers
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── weather/          # Weather-specific components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── public/              # Static assets
├── types/               # TypeScript type definitions
└── styles/              # Additional styles
```

## Features

- 🌤️ Real-time weather data
- 📅 5-day weather forecast
- 📊 Interactive temperature charts
- 🌙 Dark/Light theme support
- 🔍 Location search with autocomplete
- ⭐ Favorite locations (up to 3 locations)
- 📱 PWA support for offline access
- 📍 Geolocation support
- 🌡️ Temperature unit conversion (Celsius/Fahrenheit)
- 🎨 Responsive design
- ⚡ Fast and optimized performance

## Setup and Running Locally

1. **Clone the repository:**

    ```bash
    git clone https://github.com/Ayushmanonlycode/weather_app
    cd weather_app
    ```

2. **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3. **Set up environment variables:**

    Create a `.env` file in the root directory and add your weather API key:

    ```env
    NEXT_PUBLIC_WEATHER_API_KEY=your_api_key_here
    ```

    Replace `your_api_key_here` with your actual API key from a weather data provider (e.g., WeatherAPI, OpenWeatherMap).

4. **Run the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

5. **Build for production (optional):**

    ```bash
    npm run build
    # or
    yarn build
    # or
    pnpm build
    ```

6. **Start the production server (optional):**

    ```bash
    npm run start
    # or
    yarn start
    # or
    pnpm start
    ```

## Key Decisions and Thought Processes

### State Management
- **React Context API:** Used via the UserPreferencesContext and UserPreferencesProvider to manage global user preferences like theme, temperature unit, and favorite locations.
- **Local State:** Used within various components and custom hooks to manage component-specific state.

### Styling
- **Tailwind CSS:** Primary styling approach using utility classes
- **CSS-in-JS (styled-jsx):** Used for component-specific CSS and animations
- **Inline Styles:** Applied for dynamic styles and background effects
- **Utility Functions:** `cn` function from `@/lib/utils` for conditional class names

### Component Structure
- **Layout (`app/layout.tsx`):** Global structure and elements
- **Page (`app/page.tsx`):** Main route content
- **Weather Components:** Feature-specific components for weather display
- **UI Components:** Reusable presentational components
- **Custom Hooks:** Encapsulated stateful logic

### PWA Implementation
- **Web Manifest:** Configuration for installable PWA
- **Service Worker:** Offline support and caching
- **Registration:** Automatic service worker registration

### Error Handling
- **Input Validation:** Location search error handling
- **API Error Handling:** Network and server error management
- **Offline Support:** Network status monitoring

### Background Effects
- Static background image with transparent content overlays
- Responsive design considerations

### Charting
- Recharts library for temperature visualization
- Interactive charts with tooltips and legends
- Unit conversion support

### User Preferences
- **Theme Toggle:** Switch between light and dark modes
- **Temperature Unit:** Toggle between Celsius and Fahrenheit
- **Favorite Locations:** Save up to 3 frequently accessed locations
  - Click the star icon in the search bar to add/remove locations
  - Quick access buttons appear below the search bar
  - Persists across browser sessions using local storage

## Deployment

1. **Build the project:**
    ```bash
    npm run build
    ```

2. **Choose a hosting platform:**
    - Vercel (recommended)
    - Netlify
    - AWS Amplify
    - Render
    - Custom Node.js server

3. **Configure environment variables:**
    - Set `NEXT_PUBLIC_WEATHER_API_KEY` on your hosting platform

## Development Guidelines

### Code Style
- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Write clean, documented code

### Component Structure
- Keep components small and focused
- Use custom hooks for complex logic
- Implement proper prop typing
- Follow established naming conventions

### State Management
- Use Context API for global state
- Use local state for component-specific data
- Implement proper loading and error states

### Testing
- Write unit tests for critical components
- Test error scenarios
- Ensure responsive design works
- Test PWA functionality

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Weather API for providing weather data
- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Recharts for the charting library
