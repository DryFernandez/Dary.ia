// Google Calendar API configuration
export const GOOGLE_CALENDAR_CONFIG = {
  clientId: 'TU_CLIENT_ID_DE_GOOGLE.apps.googleusercontent.com',
  scopes: [
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/calendar',
    'profile',
    'email'
  ],
  redirectUri: 'com.daryf.daryai:/oauth2redirect'
};

export const GOOGLE_CALENDAR_API = {
  baseUrl: 'https://www.googleapis.com/calendar/v3',
  events: '/calendars/primary/events'
};
