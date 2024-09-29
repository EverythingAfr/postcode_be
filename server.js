const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

app.get('/proxy-api/autocomplete/:postcode', async (req, res) => {
  try {
    const postcode = encodeURIComponent(req.params.postcode);
    const apiResponse = await axios.get(`https://api.woosmap.com/localities/autocomplete/?input=${postcode}&key=${process.env.APIKEY}`, {
      headers: { 
        'Referer': process.env.REFERER || 'http://localhost'
      }
    });
    res.json(apiResponse.data);
  } catch (error) {
    console.error('Error in /proxy-api/autocomplete:', error.message);
    res.status(error.response?.status || 500).json({ error: 'Error fetching data from third-party API' });
  }
});

app.get('/proxy-api/details/:publicID', async (req, res) => {
  try {
    const publicID = encodeURIComponent(req.params.publicID);
    const apiResponse = await axios.get(`https://api.woosmap.com/localities/details?public_id=${publicID}&key=${process.env.APIKEY}`, {
      headers: { 
        'Referer': process.env.REFERER || 'http://localhost'
      }
    });
    res.json(apiResponse.data);
  } catch (error) {
    console.error('Error in /proxy-api/details:', error.message);
    res.status(error.response?.status || 500).json({ error: 'Error fetching data from third-party API' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Proxy server running on port ${port}`);
});