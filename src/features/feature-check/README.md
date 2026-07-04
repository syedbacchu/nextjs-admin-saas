# Feature Check System

Enterprise feature access control for the SaaS Transport Platform.

## 🎯 **Purpose**

Provides a comprehensive frontend system for:
- **Feature Access Control**: Check if users have access to specific features
- **Upgrade Prompts**: Guide users to upgrade when accessing premium features
- **Usage Limits**: Enforce subscription-based limits
- **UI Protection**: Hide/show UI elements based on feature availability

## 📁 **Structure**

```
feature-check/
├── README.md                    # This file
├── index.ts                     # Main exports
├── types.ts                     # TypeScript types
├── contexts/
│   └── FeatureContext.tsx      # Feature state context
├── hooks/
│   └── useFeatureCheck.ts      # Feature check hooks
├── components/
│   └── FeatureGuard.tsx        # Feature protection components
└── utils/
    └── featureUtils.ts         # Utility functions
```

## 🚀 **Quick Start**

### **1. Wrap Your App with FeatureProvider**

```typescript
// app.tsx or layout.tsx
import { FeatureProvider } from '@/features/feature-check'

export default function App() {
  return (
    <FeatureProvider>
      <YourApp />
    </FeatureProvider>
  )
}
```

### **2. Use Feature Guards in Components**

```typescript
import { FeatureGuard } from '@/features/feature-check'

function TripDashboard() {
  return (
    <FeatureGuard featureKey="trip.monitoring">
      <TripMonitoring />
    </FeatureGuard>
  )
}
```

### **3. Check Features Programmatically**

```typescript
import { useFeatureCheck } from '@/features/feature-check'

function MyComponent() {
  const { canUse } = useFeatureCheck()

  const handleExport = () => {
    if (canUse('reports.export')) {
      // Perform export
    } else {
      // Show upgrade prompt
    }
  }

  return <button onClick={handleExport}>Export Report</button>
}
```

## 📖 **Components**

### **FeatureGuard**
Basic protection - shows children if feature is available.

```tsx
<FeatureGuard featureKey="trip.monitoring" fallback={<UpgradePrompt />}>
  <TripContent />
</FeatureGuard>
```

### **FeatureGuardWithUpgrade**
Shows upgrade prompt when feature is not available.

```tsx
<FeatureGuardWithUpgrade featureKey="fuel.intelligence">
  <FuelAnalytics />
</FeatureGuardWithUpgrade>
```

### **LimitedFeatureGuard**
Enforces usage limits (e.g., vehicle limits).

```tsx
<LimitedFeatureGuard
  featureKey="vehicle.manage_5_10"
  currentUsage={currentVehicleCount}
>
  <AddVehicleButton />
</LimitedFeatureGuard>
```

### **AccessControlGuard**
CRUD permission-based protection.

```tsx
<AccessControlGuard featureKey="customer.management" permission="delete">
  <DeleteCustomerButton />
</AccessControlGuard>
```

### **FeatureBadge**
Display feature status badge.

```tsx
<FeatureBadge featureKey="trip.monitoring" type="status" />
```

## 🪝 **Hooks**

### **useFeatureCheck()**
Main feature checking hook.

```typescript
const { canUse, getFeatureStatus, checkUsageLimit } = useFeatureCheck()

// Simple check
if (canUse('trip.monitoring')) {
  // Show feature
}

// Detailed status
const status = getFeatureStatus('trip.monitoring')
console.log(status.allowed, status.reason)

// Check limits
const limit = checkUsageLimit('vehicle.manage_5_10', 3)
console.log(limit.allowed, limit.remaining)
```

### **useFeature(featureKey)**
Simplified hook for single feature.

```typescript
const { allowed, upgrade } = useFeature('trip.monitoring')

if (!allowed) {
  upgrade() // Show upgrade prompt
}
```

### **useVehicleTier()**
Vehicle tier-specific hook.

```typescript
const { tier, limit, hasVehicles } = useVehicleTier()

console.log(`Current tier: ${tier}`)
console.log(`Vehicle limit: ${limit}`)
```

### **useAccessControl(featureKey)**
CRUD permission checking.

```typescript
const { canCreate, canEdit, canDelete, canExport } = useAccessControl('customer.management')

if (canCreate) {
  // Show create button
}
```

## 🛠️ **Utilities**

### **FeatureUtils**

```typescript
import { FeatureUtils } from '@/features/feature-check'

// Get display name
const name = FeatureUtils.getDisplayName('trip.monitoring')

// Get vehicle tier
const tier = FeatureUtils.getVehicleTier(features)

// Check limit reached
const reached = FeatureUtils.isVehicleLimitReached(features, currentCount)

// Generate feature list
const list = FeatureUtils.generateFeatureList(features)
```

## 🎨 **Examples**

### **Protecting Navigation Items**

```typescript
function Sidebar() {
  const { canUse } = useFeatureCheck()

  return (
    <nav>
      {canUse('trip.monitoring') && (
        <NavLink to="/trips">Trips</NavLink>
      )}
      {canUse('fuel.management') && (
        <NavLink to="/fuel">Fuel</NavLink>
      )}
    </nav>
  )
}
```

### **Conditional Button Rendering**

```typescript
function VehicleList() {
  const { canUse } = useFeatureCheck()
  const vehicleCount = useVehicleCount()

  return (
    <div>
      <LimitedFeatureGuard
        featureKey="vehicle.manage_5_10"
        currentUsage={vehicleCount}
      >
        <Button>Add Vehicle</Button>
      </LimitedFeatureGuard>
    </div>
  )
}
```

### **Upgrade Flow Integration**

```typescript
function PremiumReport() {
  const { canUse, requestUpgrade } = useFeatureCheck()

  if (!canUse('reports.advanced_analytics')) {
    return (
      <UpgradePromptCard
        featureKey="reports.advanced_analytics"
        onUpgrade={() => requestUpgrade('reports.advanced_analytics')}
      />
    )
  }

  return <AdvancedReport />
}
```

### **Menu Item Protection**

```typescript
function MenuItem({ featureKey, children, ...props }) {
  const { canUse } = useFeatureCheck()

  if (!canUse(featureKey)) {
    return (
      <MenuItemWrapper
        {...props}
        onClick={() => requestUpgrade(featureKey)}
        className="locked-feature"
      >
        <LockIcon />
        {children}
      </MenuItemWrapper>
    )
  }

  return <MenuItemWrapper {...props}>{children}</MenuItemWrapper>
}
```

## 🔐 **Security Model**

### **Frontend + Backend Protection**

1. **Frontend**: Hides/disables features based on subscription
2. **Backend**: Enforces feature access via middleware
3. **API**: Returns 403 for unauthorized feature access

### **Feature Value Types**

- **Boolean**: Feature is enabled/disabled
- **Number**: Usage limit (e.g., 5 vehicles)
- **String**: Configuration value
- **Object**: Complex feature settings

## 📊 **Feature Categories**

- `vehicle` - Vehicle management tiers
- `trip` - Trip monitoring and management
- `fuel` - Fuel management and analytics
- `customer` - Customer relationship management
- `vendor` - Vendor and supplier management
- `employee` - Staff and HR management
- `payroll` - Salary and commission management
- `reports` - Reporting and analytics
- `operations` - Operational features
- `communication` - Notification and messaging
- `support` - Support and helpdesk

## 🎯 **Best Practices**

1. **Always protect UI elements** with FeatureGuard components
2. **Check features before API calls** using useFeatureCheck hook
3. **Show upgrade prompts** for unavailable features
4. **Respect usage limits** with LimitedFeatureGuard
5. **Provide meaningful fallbacks** for locked features

## 🧪 **Testing**

```typescript
import { render, screen } from '@testing-library/react'
import { FeatureProvider, FeatureGuard } from '@/features/feature-check'

test('shows content when feature is available', () => {
  const mockFeatures = { 'trip.monitoring': true }

  render(
    <FeatureProvider>
      <FeatureGuard featureKey="trip.monitoring">
        <div>Trip Content</div>
      </FeatureGuard>
    </FeatureProvider>
  )

  expect(screen.getByText('Trip Content')).toBeInTheDocument()
})
```

## 🔧 **Customization**

### **Custom Upgrade Modal**

```typescript
useEffect(() => {
  const handleUpgradePrompt = (event: CustomEvent) => {
    const { featureKey } = event.detail
    // Show your custom upgrade modal
    setShowUpgradeModal({ featureKey, show: true })
  }

  window.addEventListener('showUpgradePrompt', handleUpgradePrompt)

  return () => {
    window.removeEventListener('showUpgradePrompt', handleUpgradePrompt)
  }
}, [])
```

### **Custom Fallback Components**

```typescript
<FeatureGuard
  featureKey="premium.feature"
  fallback={<CustomLockedState />}
>
  <PremiumContent />
</FeatureGuard>
```

## 📈 **Performance**

- **Context Caching**: Feature state cached in context
- **Lazy Loading**: Features loaded once per session
- **Optimized Re-renders**: Context updates only when necessary
- **Memoized Checks**: Hook results memoized

## 🚨 **Important Notes**

1. **Frontend protection is UX only** - Backend enforces real security
2. **Always validate on backend** - Never trust frontend alone
3. **Feature caching** - Refresh features after subscription changes
4. **Error boundaries** - Wrap feature guards in error boundaries

## 🎓 **Learning Resources**

- [Feature-based access control pattern](https://docs.feature_flags.com)
- [SaaS subscription management](https://www.saasguides.com)
- [React Context patterns](https://react.dev/learn/scaling-up-with-reducer-and-context)

---

**Last Updated**: 2026-06-06  
**Maintained By**: Frontend Team  
**Version**: 1.0.0
