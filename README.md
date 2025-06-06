# Weather Forecast App

This is a weather forecast application built with Next.js, React, and Tailwind CSS, featuring real-time weather data, an hourly forecast of 5 day, a 5-day forecast with charting, theme toggling, location search, and PWA capabilities.

## Tech Stack

- **Framework:** Next.js 14 with App Router
- **UI Library:** React 18
- **Styling:** Tailwind CSS with shadcn/ui components
- **State Management:** React Context API
- **Data Visualization:** Recharts
- **Type Safety:** TypeScript
- **API Integration:** Weather API
- **PWA Support:** Service Workers
- **Development Tools:** ESLint, PostCSS

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
- 📱 PWA support for offline access
- 📍 Geolocation support
- 🌡️ Temperature unit conversion (Celsius/Fahrenheit)
- 🎨 Responsive design
- ⚡ Fast and optimized performance

## Setup and Running Locally

1.  **Clone the repository:**

    ```bash
    git clone <your-repo-url>
    cd <your-repo-directory>
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the root directory and add your weather API key:

    ```env
    NEXT_PUBLIC_WEATHER_API_KEY=your_api_key_here
    ```

    Replace `your_api_key_here` with your actual API key from a weather data provider (e.g., WeatherAPI, OpenWeatherMap).

4.  **Run the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

5.  **Build for production (optional):**

    ```bash
    npm run build
    # or
    yarn build
    # or
    pnpm build
    ```

6.  **Start the production server (optional):**

    ```bash
    npm run start
    # or
    yarn start
    # or
    pnpm start
    ```

## Key Decisions and Thought Processes

*   **State Management:** React Context API: This is used via the UserPreferencesContext and UserPreferencesProvider to manage global user preferences like theme and temperature unit.\nlocal state (useState): This is used within various components and custom hooks to manage component-specific state, such as the list of stars in the background effects or the selected day in the forecast.
*   **Styling:** The primary styling approach in this project is through **Tailwind CSS**, augmented by some **inline styles** and **CSS-in-JS (styled-jsx)** for specific components.
    1.  **Tailwind CSS Utility Classes:** This is the most prevalent method. Utility classes like `className="min-h-screen"`, `"w-full max-w-5xl mx-auto p-4"`, `"text-3xl font-bold"` are applied directly to JSX elements. These classes provide pre-defined styles for layout, typography, spacing, sizing, and more. The `@tailwind` directives in `app/globals.css` integrate Tailwind's base styles, components, and utilities.
    2.  **CSS-in-JS (styled-jsx):** Used in the background effect components. This allows writing component-specific CSS within a `<style jsx>` block for defining `@keyframes` animations.
    3.  **Inline Styles:** Applied directly using the `style` prop for dynamic styles, such as background images, positions, sizes, animations, and transparent backgrounds on content elements.
    4.  **Utility Functions for Class Management:** The `cn` function from `@/lib/utils` is used to conditionally join class names.
*   **Component Structure:** The application is broken down into components based on their role and responsibility to enhance modularity, reusability, maintainability, readability, testability, and collaboration. Key components include:
    *   **Layout (`app/layout.tsx`):** Defines the global structure and elements present on all pages, such as global styles, metadata, and providers.
    *   **Page (`app/page.tsx`):** Represents a specific route and renders the main content for that route.
    *   **Main Application Component (`components/weather/weather-app.tsx`):** Acts as the central orchestrator, managing data fetching and state using hooks and conditionally rendering other weather components.
    *   **Feature-Specific Components (`components/weather/weather-search.tsx`, `components/weather/current-weather.tsx`, `components/weather/forecast-detail.tsx`):** Handle specific features of the weather application like searching, displaying current weather, and showing forecast details.
    *   **Smaller/Reusable Presentational Components (`components/ui/*`, `components/weather/forecast-day-card.tsx`, etc.):** Focused on rendering specific UI elements and are designed for reusability.
    *   **Custom Hooks (`hooks/*`):** Encapsulate stateful logic and side effects, promoting reusability and cleaner component code.
*   **PWA Implementation:** The application is made installable as a Progressive Web App (PWA) with basic offline support through the following steps:
    1.  **Web Manifest File (`public/manifest.json`):** A `manifest.json` file was created, providing metadata about the application (name, icons, start URL, display mode, etc.) to enable the browser's install feature.
    2.  **Service Worker (`public/service-worker.js`):** A service worker was implemented to intercept network requests. It caches essential assets during installation and serves them when the user is offline, providing basic offline capabilities.
    3.  **Registration:** The `manifest.json` file is linked in the `<head>` of `app/layout.tsx`, and a script is included in the body to register the `service-worker.js` file when the page loads, activating the PWA features and caching.
*   **Error Handling:** The application includes mechanisms to handle various error scenarios gracefully:
    *   **Invalid City/ZIP Code Input:** When a location search yields no data, the `useWeatherSearch` hook sets an error state with the message "Could not find weather data for this location". This is displayed to the user in a destructive Alert component.
    *   **API Rate Limits or Server Errors:** API calls are wrapped in `try...catch` blocks. Any errors during the request (network issues, server errors) are caught, and the error message is captured and set in the `useWeatherSearch` error state, also displayed in a destructive Alert.
    *   **No Internet Connection:** The `useNetworkStatus` hook tracks the online/offline status. If offline, the `WeatherApp` component renders an `OfflineAlert` component with a warning message and a `WifiOff` icon, informing the user they are offline and may be viewing mock data.
*   **Background Effects:** Several background effects were explored during development, including different iterations of falling stars and a space background with gradients and nebulae. Ultimately, a simple rain effect was implemented and later replaced with a static background image (`/back.jpg`) set on the `body` element in the layout, with content backgrounds made transparent to ensure visibility.
*   **Charting:** Recharts was chosen as the charting library to visualize temperature trends due to its composability and ease of integration with React. A LineChart is used in the `ForecastDetail` component to display the minimum and maximum temperatures for the 5-day forecast. The chart data is prepared by mapping the forecast data to an array with date, minTemp, and maxTemp properties, ensuring the correct temperature unit (°C or °°F) is used based on user preferences. Tooltips and a legend are included for better readability.

## Deployment

This Next.js application can be deployed to various platforms. Here are general instructions:

1.  **Build the project:**

    Run the build command (`npm run build`, `yarn build`, or `pnpm build`). This creates an optimized production build in the `.next` folder.

2.  **Choose a hosting platform:**

    Popular choices for Next.js include:
    *   Vercel (recommended by Next.js, zero configuration)
    *   Netlify
    *   AWS Amplify
    *   Render
    *   Your own server (Node.js server)

3.  **Follow the platform's deployment guide:**

    Each platform has specific instructions for deploying Next.js applications. Generally, you will connect your GitHub repository, configure environment variables (like `NEXT_PUBLIC_WEATHER_API_KEY`), and the platform will automatically build and deploy your application.

    *   For Vercel deployment, refer to their documentation.
    *   For Netlify deployment, refer to their documentation.

Remember to configure the `NEXT_PUBLIC_WEATHER_API_KEY` environment variable on your hosting platform.

## Development Guidelines

### Code Style
- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Write clean, documented code
- Follow the component structure guidelines

### Component Structure
- Keep components small and focused
- Use custom hooks for complex logic
- Implement proper prop typing
- Follow the established file naming convention

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