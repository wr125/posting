const express = require('express');
const { OpenAI } = require('openai');
const { TwitterApi } = require('twitter-api-v2');
const { FacebookAdsApi } = require('facebook-nodejs-business-sdk');
const Linkedin = require('node-linkedin')();
const sqlite3 = require('sqlite3').verbose();
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Initialize social media clients (replace with actual OAuth tokens)
const twitterClient = new TwitterApi(process.env.TWITTER_API_KEY);
const facebookClient = FacebookAdsApi.init(process.env.FACEBOOK_ACCESS_TOKEN);
const linkedinClient = Linkedin.init(process.env.LINKEDIN_ACCESS_TOKEN);

// Initialize SQLite database
const db = new sqlite3.Database('./blog.db', (err) => {
  if (err) console.error('Error opening database', err);
  else console.log('Connected to SQLite database');
});

// Create articles table if not exists
db.run(`CREATE TABLE IF NOT EXISTS articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  prompt TEXT,
  content TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Endpoint to generate a blog article
app.post('/generate', async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });
    const article = response.choices[0].message.content;
    db.run('INSERT INTO articles (prompt, content) VALUES (?, ?)', [prompt, article], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, article });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to post article to social media
app.post('/post', async (req, res) => {
  const { articleId, platforms } = req.body;
  db.get('SELECT content FROM articles WHERE id = ?', [articleId], async (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Article not found' });

    const results = {};
    if (platforms.includes('twitter')) {
      try {
        await twitterClient.v2.tweet(row.content);
        results.twitter = 'Posted successfully';
      } catch (error) {
        results.twitter = error.message;
      }
    }
    if (platforms.includes('facebook')) {
      try {
        // Example: Post to Facebook (replace with actual implementation)
        results.facebook = 'Posted successfully';
      } catch (error) {
        results.facebook = error.message;
      }
    }
    if (platforms.includes('linkedin')) {
      try {
        // Post to LinkedIn using node-linkedin
        await new Promise((resolve, reject) => {
          linkedinClient.people.share({
            comment: row.content,
            visibility: { code: 'anyone' }
          }, (err, data) => {
            if (err) reject(err);
            else resolve(data);
          });
        });
        results.linkedin = 'Posted successfully';
      } catch (error) {
        results.linkedin = error.message;
      }
    }
    res.json(results);
  });
});

// Endpoint to get all articles
app.get('/articles', (req, res) => {
  db.all('SELECT * FROM articles ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 