const API_BASE_URL = 'https://media.carecontrolsystems.co.uk/Travel/JourneyPlan.aspx';

export interface JourneySegment {
  time: number;
  distance: number;
}

export const calculateJourney = async (postcodes: string[]): Promise<JourneySegment[]> => {
  const route = postcodes.join(',');
  const url = `${API_BASE_URL}?Route=${route}&Format=Miles&TravelMode=Driving`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.text();
    const segments = data.split(';').filter(segment => segment.trim() !== '');

    if (segments.length !== postcodes.length - 1) {
      throw new Error('Invalid response from the server. Please check your postcodes.');
    }

    return segments.map(segment => {
      const [time, distance] = segment.split(',').map(Number);
      return { time, distance };
    });
  } catch (error) {
    console.error('Error calculating journey:', error);
    throw error;
  }
};