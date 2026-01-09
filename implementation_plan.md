# Personal Dashboard & Calendar Implementation Plan

This plan details the steps to implement the "My Rehabilitation Journey" dashboard and the "Easy Calendar" feature as approved in the proposal.

## User Review Required

> [!IMPORTANT]
> This implementation relies on **mock data** (`mock-admin-data.ts`) to simulate user login and persistence. In a real production environment, this would need to be replaced with a real database and authentication system (e.g., Supabase Auth, NextAuth).

## Proposed Changes

### Data Layer

#### [MODIFY] [mock-admin-data.ts](file:///c:/Users/highs/OneDrive/Desktop/crusor/hospital_data/lib/mock-admin-data.ts)

- Extend `AdminUser` interface to include `calendar_events` and `completed_actions`.
- Add `CalendarEvent` interface.
- Populate `MOCK_USERS` with sample calendar data and actionable items for testing.

### UI Components (New 'dashboard' module)

#### [NEW] [components/dashboard/DashboardHeader.tsx](file:///c:/Users/highs/OneDrive/Desktop/crusor/hospital_data/components/dashboard/DashboardHeader.tsx)

- Displays user greeting and overall progress bar.
- Shows "current step" clearly.

#### [NEW] [components/dashboard/ActionChecklist.tsx](file:///c:/Users/highs/OneDrive/Desktop/crusor/hospital_data/components/dashboard/ActionChecklist.tsx)

- Fetches actions for the current step.
- Render checkboxes.
- Handles toggle logic (updating mock state).

#### [NEW] [components/dashboard/EasyCalendarWidget.tsx](file:///c:/Users/highs/OneDrive/Desktop/crusor/hospital_data/components/dashboard/EasyCalendarWidget.tsx)

- **Calendar View**: Displays a simple month view with event dots (Hospital, Admin, Rehab).
- **One-Click Log**: Buttons for "Visited Hospital Today", "Applied for Benefits Today".
- **Event List**: Shows selected date's events.

#### [NEW] [components/dashboard/CuratedContent.tsx](file:///c:/Users/highs/OneDrive/Desktop/crusor/hospital_data/components/dashboard/CuratedContent.tsx)

- Displays "Required Documents" for the current step.
- Displays "Recommended Videos" (placeholder UI).
- Displays "Step Warnings" (Tips).

### Page Implementation

#### [NEW] [app/dashboard/page.tsx](file:///c:/Users/highs/OneDrive/Desktop/crusor/hospital_data/app/dashboard/page.tsx)

- Assembles the above components.
- Simulates fetching the "logged-in user" (hardcoded to 'user-1' or derived from a simple cookie/context for demo).

### Navigation

#### [MODIFY] [components/Navbar.tsx](file:///c:/Users/highs/OneDrive/Desktop/crusor/hospital_data/components/Navbar.tsx)

- Add a "나의 여정" (My Journey) link to the navigation bar.
- Add a notification badge (optional, static for now).

## Verification Plan

### Automated Tests

- None planned for this prototype phase.

### Manual Verification

1.  **Dashboard Access**: Click "나의 여정" in the header. Verify it loads `app/dashboard/page.tsx`.
2.  **Data Rendering**: Confirm 'Hong Gil-dong' (user-1) sees 'Step 2' content.
3.  **Checklist Interaction**: Click a todo item. Verify the checkbox toggles.
4.  **Calendar Interaction**:
    - Click "Today's Hospital Visit". Verify a dot appears on today's date in the calendar.
    - Click a calendar date. Verify it shows events for that day.
