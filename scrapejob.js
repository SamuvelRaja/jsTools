const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// Read the CSV file
const csvFilePath = './assets/remote.csv';
const csv = require('csvtojson');
let matchedurl=""

const keywords = [' frontend', 'react.js', 'react', 'nextjs', 'next.js', 'nodejs'];

const urlVariations = [
  '', // for the main URL
  '/careers',
  '/jobs',  
  'careers.',
  'jobs.',
  '/vacancies'
];

const checkForKeywords = async (baseURL) => {
  for (let variation of urlVariations) {
    let url;
    if (variation.includes('.')) {
      url = baseURL.replace('https://', `https://${variation}`);
    } else {
      url = `${baseURL}${variation}`;
    }

    try {
      const response = await axios.get(url);
      const html = response.data;
      const $ = cheerio.load(html);
      const text = $('body').text().toLowerCase();

      if (keywords.some(keyword => text.includes(keyword))) {
        matchedurl=url
        return true;
      }
    } catch (error) {
      console.error(`Error fetching URL: ${url}`, error.message);
      continue;
    }
  }
  return false;
};

const processCompanies = async () => {
  const companies = await csv().fromFile(csvFilePath);
  const results = [];

  for (const company of companies) {
    const website = company.Website;
    const isHiring = await checkForKeywords(website);

    if (isHiring) {
      results.push({
        name: company.Name,
        website: company.Website,
        matchURL:matchedurl,
        region: company.Region,
      });
    }
  }

  // Write results to a JSON file
  fs.writeFileSync('hiring_companies.json', JSON.stringify(results, null, 2));
  console.log('Filtered companies saved to hiring_companies.json');
};

processCompanies();
