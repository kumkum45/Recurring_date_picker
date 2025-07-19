# Recurring Date Picker Component

A sophisticated, reusable React component for creating recurring date patterns similar to the TickTick app. Built with modern React, Zustand for state management, and Tailwind CSS for styling.

## 🚀 Features

### Recurrence Types
- **Daily**: Every X days (1-365 days interval)
- **Weekly**: Specific days of the week with customizable intervals
- **Monthly**: Day of month or week patterns (e.g., "2nd Tuesday of every month")
- **Yearly**: Annual patterns perfect for birthdays and anniversaries

### Advanced Features
- **Date Range Selection**: Start date (required) and optional end date
- **Mini Calendar Preview**: Visual representation of recurring dates
- **Real-time Validation**: Comprehensive date validation with helpful error messages
- **Pattern Summaries**: Clear descriptions of selected recurrence patterns
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Beautiful, accessible interface with smooth animations

### Technical Features
- **State Management**: Zustand for efficient state management
- **Date Handling**: date-fns for robust date manipulation
- **Testing**: Comprehensive unit and integration tests
- **Type Safety**: Full TypeScript support (can be easily converted)
- **Modular Architecture**: Break down into reusable components

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd recurring-datepicker

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## 🛠️ Dependencies

### Core Dependencies
- **React 19.1.0**: Latest React with concurrent features
- **Zustand 5.0.6**: Lightweight state management
- **date-fns 3.6.0**: Modern date utility library
- **lucide-react 0.468.0**: Beautiful icons

### Development Dependencies
- **Vite 7.0.4**: Fast build tool and dev server
- **Tailwind CSS 3.4.17**: Utility-first CSS framework
- **Vitest 2.1.8**: Fast unit testing framework
- **Testing Library**: React testing utilities

## 🎯 Usage

### Basic Usage

```jsx
import RecurringDatePicker from './components/RecurringDatePicker';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <RecurringDatePicker />
    </div>
  );
}
```

### Advanced Usage with Custom Handlers

```jsx
import { useEffect } from 'react';
import useRecurringStore from './store/recurrenceStore';

function MyApp() {
  const {
    startDate,
    endDate,
    recurrenceType,
    settings,
    generatedDates,
    validationError
  } = useRecurringStore();

  useEffect(() => {
    if (generatedDates.length > 0) {
      console.log('Generated dates:', generatedDates);
      // Handle the generated dates (save to database, etc.)
    }
  }, [generatedDates]);

  return (
    <div>
      <RecurringDatePicker />
      
      {validationError && (
        <div className="error">{validationError}</div>
      )}
      
      {generatedDates.length > 0 && (
        <div>
          <h3>Generated Dates:</h3>
          <ul>
            {generatedDates.map((date, index) => (
              <li key={index}>{date.toLocaleDateString()}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

## 🧪 Testing

The project includes comprehensive testing with Vitest and Testing Library.

### Running Tests

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm test -- --watch
```

### Test Coverage

- **Unit Tests**: Individual component and store functionality
- **Integration Tests**: Complete user workflows
- **State Management Tests**: Zustand store operations
- **Date Logic Tests**: Recurrence pattern generation

### Test Structure

```
src/test/
├── RecurringDatePicker.test.jsx    # Main component tests
├── recurrenceStore.test.js         # State management tests
├── integration.test.jsx            # End-to-end workflows
└── setup.js                        # Test configuration
```

## 🏗️ Architecture

### Component Structure

```
src/
├── components/
│   ├── RecurringDatePicker.jsx     # Main component
│   ├── DateRangeSelector.jsx       # Date input component
│   ├── DailySettings.jsx           # Daily recurrence settings
│   ├── WeeklySettings.jsx          # Weekly recurrence settings
│   ├── MonthlySettings.jsx         # Monthly recurrence settings
│   ├── YearlySettings.jsx          # Yearly recurrence settings
│   └── CalendarPreview.jsx         # Mini calendar preview
├── store/
│   └── recurrenceStore.js          # Zustand store
└── utils/
    └── generateRecurringDates.js   # Date generation utilities
```

### State Management

The component uses Zustand for state management with the following structure:

```javascript
{
  startDate: string,
  endDate: string,
  recurrenceType: 'daily' | 'weekly' | 'monthly' | 'yearly',
  settings: {
    // Daily settings
    everyXDays: number,
    
    // Weekly settings
    everyXWeeks: number,
    daysOfWeek: number[],
    
    // Monthly settings
    everyXMonths: number,
    dayOfMonth: number,
    weekOfMonth: number,
    dayOfWeek: number,
    
    // Yearly settings
    everyXYears: number,
    month: number,
    day: number,
  },
  validationError: string,
  generatedDates: Date[]
}
```

## 🎨 Customization

### Styling

The component uses Tailwind CSS and can be easily customized:

```css
/* Custom colors */
:root {
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --success-500: #22c55e;
  --error-500: #ef4444;
}

/* Custom animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### Theme Configuration

Modify `tailwind.config.js` to customize the design system:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          // ... more shades
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
      }
    }
  }
}
```

## 📱 Responsive Design

The component is fully responsive and works on all screen sizes:

- **Desktop**: Full layout with side-by-side configuration and preview
- **Tablet**: Stacked layout with optimized spacing
- **Mobile**: Single column layout with touch-friendly controls

## ♿ Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: ARIA labels and semantic HTML
- **Color Contrast**: WCAG AA compliant color scheme
- **Focus Management**: Proper focus indicators and management

## 🔧 Configuration

### Environment Variables

```bash
# Development
VITE_APP_TITLE=Recurring Date Picker
VITE_APP_VERSION=1.0.0

# Production
VITE_APP_API_URL=https://api.example.com
```

### Build Configuration

```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
})
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Various Platforms

**Vercel:**
```bash
npm install -g vercel
vercel
```

**Netlify:**
```bash
npm run build
# Upload dist/ folder to Netlify
```

**GitHub Pages:**
```bash
npm run build
# Push dist/ folder to gh-pages branch
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **TickTick**: Inspiration for the recurring date patterns
- **date-fns**: Excellent date manipulation library
- **Zustand**: Simple and effective state management
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide**: Beautiful icon library

## 📞 Support

For support, please open an issue on GitHub or contact the maintainers.

---

**Built with ❤️ using React, Zustand, and Tailwind CSS**
