# RelioSkin Role-Based System

This document explains the two-role system implemented in RelioSkin.

## User Roles

### 1. Customer Role
**Purpose**: Book and receive facial treatments

**Capabilities**:
- Browse therapists in the marketplace
- Filter therapists by location, specialty, rating
- Book treatments with therapists
- View booking history and upcoming appointments
- Track booking status (pending, confirmed, in progress, completed, cancelled)
- Make payments for bookings
- Receive notifications about bookings
- Leave reviews after treatments

**Dashboard Features**:
- View upcoming bookings
- View past bookings
- View payment history
- Manage profile and preferences

### 2. Therapist Role
**Purpose**: Provide facial treatment services and manage bookings

**Capabilities**:
- Create and manage therapist profile
  - Set specialty, bio, experience
  - Upload certifications
  - Define service areas and locations
  - Set price range
  - Configure availability schedule
- Receive booking requests from customers
- Accept or decline bookings
- Update booking status
- View payment details for completed bookings
- Receive notifications for:
  - New booking requests
  - Booking cancellations
  - Payment confirmations
- View customer details for confirmed bookings

**Dashboard Features**:
- View pending booking requests
- View upcoming confirmed bookings
- View completed bookings and earnings
- Manage availability calendar
- View and respond to reviews

## Database Schema

### Users Table
- `role`: "customer" | "therapist"
- Basic user information (name, email, phone, etc.)

### Therapists Table
- Linked to users with therapist role
- Contains professional information:
  - Specialty, bio, experience
  - Certifications
  - Location and service areas
  - Price range
  - Availability schedule
  - Rating and review count

### Bookings Table
- Links customer and therapist
- Contains:
  - Treatment type
  - Scheduled date and time
  - Location/address
  - Status (pending, confirmed, in_progress, completed, cancelled)
  - Price and currency
  - Customer notes

### Payments Table
- Linked to bookings
- Tracks payment status
- Integration with Stripe
- Contains:
  - Amount, currency
  - Payment method
  - Status (pending, completed, failed, refunded)
  - Timestamps

### Notifications Table
- User-specific notifications
- Types:
  - `new_booking`: Therapist receives when customer books
  - `booking_confirmed`: Customer receives when therapist confirms
  - `booking_cancelled`: Both parties when booking is cancelled
  - `payment_received`: Therapist when payment is completed
  - `booking_reminder`: Both parties before appointment
- Read/unread status

### Reviews Table
- Linked to completed bookings
- Customer rates therapist (1-5 stars)
- Optional comment

## API Endpoints

### Therapists
- `convex/therapists.ts`
  - `list`: Get all active therapists (with filters)
  - `get`: Get single therapist details
  - `getMyProfile`: Get current user's therapist profile
  - `upsertProfile`: Create or update therapist profile

### Bookings
- `convex/bookings.ts`
  - `getMyBookings`: Get bookings for customer (current user)
  - `getTherapistBookings`: Get bookings for therapist (current user)
  - `create`: Create new booking
  - `updateStatus`: Update booking status (confirm, cancel, complete)

### Notifications
- `convex/notifications.ts`
  - `getMyNotifications`: Get notifications for current user
  - `getUnreadCount`: Get count of unread notifications
  - `markAsRead`: Mark single notification as read
  - `markAllAsRead`: Mark all notifications as read

## Workflow Examples

### Customer Books a Treatment

1. **Customer browses marketplace**
   - Uses filters (location, specialty)
   - Views therapist profiles, ratings, prices

2. **Customer creates booking**
   ```typescript
   await convex.mutation("bookings:create", {
     therapistId: "...",
     therapistProfileId: "...",
     treatmentType: "Anti-Aging Facial",
     scheduledDate: timestamp,
     scheduledTime: "14:00",
     duration: 90,
     address: "Customer's home address",
     price: 80,
     currency: "MYR"
   });
   ```

3. **System creates notification for therapist**
   - Therapist sees "New Booking Request" in dashboard

4. **Therapist confirms booking**
   ```typescript
   await convex.mutation("bookings:updateStatus", {
     bookingId: "...",
     status: "confirmed"
   });
   ```

5. **System creates notification for customer**
   - Customer sees "Booking Confirmed"

6. **On appointment day**
   - Therapist arrives at customer's location
   - Therapist updates status to "in_progress"
   - After treatment, therapist updates to "completed"

7. **Payment processed**
   - Payment record created
   - Therapist receives "Payment Received" notification

8. **Customer leaves review**
   - Rating and comment
   - Updates therapist's overall rating

### Therapist Manages Schedule

1. **Therapist sets up profile**
   ```typescript
   await convex.mutation("therapists:upsertProfile", {
     specialty: "Anti-Aging Specialist",
     experience: "8 years",
     location: "Kuala Lumpur",
     serviceArea: ["Kuala Lumpur", "Petaling Jaya", "Subang Jaya"],
     priceRange: { min: 60, max: 120 },
     availability: [
       { day: "monday", slots: ["09:00", "11:00", "14:00", "16:00"] },
       { day: "tuesday", slots: ["09:00", "11:00", "14:00", "16:00"] },
       // ...
     ]
   });
   ```

2. **Therapist views pending bookings**
   ```typescript
   const bookings = await convex.query("bookings:getTherapistBookings", {
     status: "pending"
   });
   ```

3. **Therapist accepts or declines**
   - Based on availability and location

4. **Therapist views confirmed schedule**
   - Dashboard shows all confirmed upcoming appointments
   - Can see customer details, addresses, treatment types

5. **After each job**
   - View payment details
   - Track earnings

## Future Enhancements

- Calendar integration for therapists
- Automated reminders (SMS/Email)
- In-app messaging between customer and therapist
- Recurring bookings
- Package deals (multiple treatments)
- Therapist teams/assistants
- Customer wishlist/favorite therapists
- Referral system
- Loyalty points

## Security Considerations

- Users can only access their own data
- Therapists can only see customer details for confirmed bookings
- Customers can only see therapist public profiles
- Payment information is handled securely via Stripe
- All mutations check authentication and authorization
