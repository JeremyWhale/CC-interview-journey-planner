const API_BASE_URL = 'https://media.carecontrolsystems.co.uk/Travel/JourneyPlan.aspx';

export interface JourneySegment {
  time: number;
  distance: number | undefined;
}

export const calculateJourney = async (postcodes: string[]): Promise<JourneySegment[]> => {
  const url = `https://media.carecontrolsystems.co.uk/Travel/JourneyPlan.aspx?Route=${postcodes.join(',')}&Format=Miles&TravelMode=Driving`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
    }
    const data = await response.text();
    const segments = data.split(';').filter(segment => segment.trim() !== '');
    return segments.map(segment => {
      const [time, distance] = segment.split(',').map(Number);
      return {
        time: isNaN(time) ? 0 : time,
        distance: isNaN(distance) ? undefined : distance
      };
    });
  } catch (error) {
    console.error('Error calculating journey:', error);
    throw error;
  }
};