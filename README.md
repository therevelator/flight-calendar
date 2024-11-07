# Flight Price Calendar

An interactive calendar that shows Ryanair flight prices, allowing users to find the cheapest flights for their desired routes.

## Features
- 🗓️ Interactive price calendar
- ✈️ Return flight support
- 💰 Price-based color coding (green for cheap, orange for medium, red for expensive)
- 💡 Cheapest flight recommendations within selected month
- 🌍 Multiple currencies support
- 👥 Passenger selection (adults, teens, children, infants)
- 🎨 Modern glass-morphism design with gradient background

## Running Locally

### Prerequisites
- Node.js (v14 or higher)
- Yarn (install via `npm install -g yarn`)

### Installation
1. Clone the repository:
   ```bash
   git clone [your-repo-url]
   cd flight-calendar
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Start the development server:
   ```bash
   yarn start
   ```

The app will open automatically in your default browser at [http://localhost:3000](http://localhost:3000)

## API Documentation

The application uses Ryanair's public API endpoints. Here are the main API calls:

### 1. Outbound Flights
```http
GET https://www.ryanair.com/api/farfnd/v4/oneWayFares/{origin}/{destination}/cheapestPerDay
```

Fetches available outbound flights and their prices.

#### Parameters:
- `origin`: Origin airport code (e.g., 'DUB')
- `destination`: Destination airport code (e.g., 'OTP')
- `outboundMonthOfDate`: Date in YYYY-MM-DD format
- `currency`: Currency code (e.g., 'EUR')

#### Response Example:
```json
{
  "outbound": {
    "fares": [
      {
        "day": "2024-03-15",
        "price": {
          "value": 49.99,
          "currencyCode": "EUR",
          "currencySymbol": "€"
        },
        "departureDate": "2024-03-15T06:30:00",
        "arrivalDate": "2024-03-15T10:15:00",
        "unavailable": false
      }
    ],
    "minFare": { ... },
    "maxFare": { ... }
  }
}
```

### 2. Return Flights
```http
GET https://www.ryanair.com/api/farfnd/v4/oneWayFares/{destination}/{origin}/cheapestPerDay
```

Fetches available return flights and their prices.

#### Parameters:
Same as outbound flights, but with origin/destination swapped.

### 3. Price Color Coding
The application uses a color-coding system for prices:
- Green (#00FF5E): ≤ €50
- Amber (#FFC107): ~€100
- Red (#FF3D3D): ≥ €150

## iOS App Conversion

### Prerequisites
- Mac computer
- Xcode (latest version from App Store)
- Apple Developer account ($99/year)
- Xcode Command Line Tools
- CocoaPods (install via `sudo gem install cocoapods`)

### Steps to Convert
1. Install Capacitor:
   ```bash
   yarn add @capacitor/core @capacitor/cli @capacitor/ios
   npx cap init
   ```

2. Build the React app:
   ```bash
   yarn build
   ```

3. Add iOS platform:
   ```bash
   npx cap add ios
   ```

4. Sync the project:
   ```bash
   npx cap sync
   ```

5. Open in Xcode:
   ```bash
   npx cap open ios
   ```

6. Configure in Xcode:
   - Sign in with your Apple Developer account
   - Configure your Bundle Identifier
   - Set up your signing certificate
   - Configure app capabilities
   - Test on simulator or real device

## Project Structure
```
flight-calendar/
├── src/
│   ├── components/
│   │   ├── Calendar.jsx        # Main calendar component
│   │   ├── ReturnDatePicker.jsx    # Return flight calendar
│   │   └── RecommendedFlights.jsx  # Flight recommendations
│   ├── App.jsx                 # Main application logic
│   └── App.css                 # Styles including glass-morphism
├── public/
│   └── index.html             # Entry HTML file
└── package.json               # Project dependencies
```

## Technologies
- React 18
- Moment.js for date handling
- Modern CSS features:
  - Glass-morphism effects
  - CSS Grid for calendar
  - Custom gradient backgrounds
  - Responsive design

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
MIT License - feel free to use this project for your own purposes.



