import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [prompt, setPrompt] = useState('');
  const [article, setArticle] = useState(null);
  const [articles, setArticles] = useState([]);
  const [platforms, setPlatforms] = useState({
    twitter: false,
    facebook: false,
    linkedin: false
  });

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await axios.get('http://localhost:3000/articles');
      setArticles(response.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  const handleGenerate = async () => {
    try {
      const response = await axios.post('http://localhost:3000/generate', { prompt });
      setArticle(response.data.article);
      fetchArticles();
    } catch (error) {
      console.error('Error generating article:', error);
    }
  };

  const handlePost = async () => {
    if (!article) return;
    const selectedPlatforms = Object.keys(platforms).filter(p => platforms[p]);
    try {
      const response = await axios.post('http://localhost:3000/post', {
        articleId: article.id,
        platforms: selectedPlatforms
      });
      console.log('Post results:', response.data);
    } catch (error) {
      console.error('Error posting to social media:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>AI Blog & Social Media Poster</h1>
      <div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          style={{ width: '100%', height: '100px' }}
        />
        <button onClick={handleGenerate}>Generate</button>
      </div>
      {article && (
        <div>
          <h2>Generated Article</h2>
          <p>{article}</p>
          <div>
            <label>
              <input
                type="checkbox"
                checked={platforms.twitter}
                onChange={(e) => setPlatforms({ ...platforms, twitter: e.target.checked })}
              />
              Twitter
            </label>
            <label>
              <input
                type="checkbox"
                checked={platforms.facebook}
                onChange={(e) => setPlatforms({ ...platforms, facebook: e.target.checked })}
              />
              Facebook
            </label>
            <label>
              <input
                type="checkbox"
                checked={platforms.linkedin}
                onChange={(e) => setPlatforms({ ...platforms, linkedin: e.target.checked })}
              />
              LinkedIn
            </label>
            <button onClick={handlePost}>Post</button>
          </div>
        </div>
      )}
      <div>
        <h2>Previous Articles</h2>
        <ul>
          {articles.map((article) => (
            <li key={article.id}>
              <strong>Prompt:</strong> {article.prompt}<br />
              <strong>Content:</strong> {article.content}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App; 