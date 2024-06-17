// pages/api/claude.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { prompt } = req.body;
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const response = await axios.post(
      'https://api.anthropic.com/v1/complete',
      {
        prompt,
        // Add any additional parameters required by the API
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        },
      }
    );

    const assistantResponse = response.data.result; // Adjust based on the API response structure

    res.status(200).json({ result: assistantResponse });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
}