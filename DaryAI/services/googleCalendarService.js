import { GOOGLE_CALENDAR_CONFIG, GOOGLE_CALENDAR_API } from '../config/googleCalendarConfig';

class GoogleCalendarService {
  // Placeholder for Google Sign-In (reuse logic from GooglePhotosService if needed)
  async signInWithGoogle() {
    // Implement OAuth2 logic here
  }

  // Create a new event in Google Calendar
  async createEvent(accessToken, event) {
    try {
      const response = await fetch(
        `${GOOGLE_CALENDAR_API.baseUrl}${GOOGLE_CALENDAR_API.events}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        }
      );
      if (!response.ok) throw new Error('Error creating event');
      return await response.json();
    } catch (error) {
      console.error('GoogleCalendarService.createEvent:', error);
      throw error;
    }
  }
}

export default new GoogleCalendarService();
