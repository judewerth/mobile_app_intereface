import axios from "axios";

// Define the types for the response data
interface AdafruitData {
  value: string;
  created_at: string;
  // updated_at: string;
}

// constant values (credentials)
const ADAFRUIT_IO_KEY = 'aio_rSMn16oXVn6HTUrOxx2Pp3jv1Gic';
const ADAFRUIT_IO_USERNAME = 'youngwyatt';

// Function to fetch a value from a feed key (input)
export const fetchAdafruitIOData = async (feedKey: string): Promise<AdafruitData | null> => {
  try {
    const response = await axios.get<AdafruitData>(
      `https://io.adafruit.com/api/v2/${ADAFRUIT_IO_USERNAME}/feeds/${feedKey}/data/last`,
      {
        headers: {
          'X-AIO-Key': ADAFRUIT_IO_KEY,
        }
      }
    );

    console.log('Fetched data from Adafruit IO:', response.data);
    return response.data;

  } catch (error) {
    console.error('Error fetching data from Adafruit IO:', error);
    return null;
  }
};

// Define the types for the response data
interface AdafruitResponse {
  id: string;
  value: string;
  created_at: string;
}

export const exportAdafruitIOData = async (value: number, feedKey: string): Promise<AdafruitResponse | null> => {
  try {
    const response = await axios.post<AdafruitResponse>(
      `https://io.adafruit.com/api/v2/${ADAFRUIT_IO_USERNAME}/feeds/${feedKey}/data`, // URL for sending data to Adafruit IO
      { value }, // Send the value as part of the request body
      {
        headers: {
          'X-AIO-Key': ADAFRUIT_IO_KEY, // Include the API key for authentication
        },
      }
    );

    console.log('Successfully posted data to Adafruit IO:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error posting data to Adafruit IO:', error);
    return null;
  }
};

