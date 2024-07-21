import { calculateJourney } from '../utils/api';

describe('calculateJourney', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve('30,10;'),
      })
    ) as jest.Mock;
  });

  it('calculates journey correctly', async () => {
    const result = await calculateJourney(['Pl26 7AX', 'M3 5EH']);
    expect(result).toEqual([{ time: 30, distance: 10 }]);
    expect(fetch).toHaveBeenCalledWith(
      'https://media.carecontrolsystems.co.uk/Travel/JourneyPlan.aspx?Route=Pl26 7AX,M3 5EH&Format=Miles&TravelMode=Driving'
    );
  });

  it('handles API errors', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      })
    );

    await expect(calculateJourney(['Pl26 7AX', 'M3 5EH'])).rejects.toThrow('Network response was not ok: 404 Not Found');
  });

  it('handles invalid API response', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve('invalid response'),
      })
    );
  
    const result = await calculateJourney(['Pl26 7AX', 'M3 5EH']);
    expect(result).toEqual([{ time: 0, distance: undefined }]);
  });
});