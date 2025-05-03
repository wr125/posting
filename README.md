# AI Blog & Social Media Poster

This app lets users write a prompt in their dashboard, generates a blog article using AI, and automatically posts it to social media platforms (X, Facebook, LinkedIn).

## Features
- User dashboard for entering prompts
- AI-generated blog articles using OpenAI
- Automatic posting to X, Facebook, and LinkedIn
- History of generated articles

## Tech Stack
- **Frontend**: React
- **Backend**: Node.js/Express
- **AI**: OpenAI API
- **Social Media**: X, Facebook, LinkedIn APIs
- **Database**: SQLite

## Setup

### Prerequisites
- Node.js (v14+)
- npm or yarn
- OpenAI API key
- Social media API keys/tokens

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ai-blog-social-poster
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   OPENAI_API_KEY=your_openai_api_key
   TWITTER_API_KEY=your_twitter_api_key
   FACEBOOK_ACCESS_TOKEN=your_facebook_access_token
   LINKEDIN_ACCESS_TOKEN=your_linkedin_access_token
   PORT=3000
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`.

## Usage
- Enter a prompt in the dashboard.
- Click "Generate" to create a blog article.
- Select social media platforms and click "Post" to share the article.

## License
MIT 

![Image](https://github.com/user-attachments/assets/dd7a0c0d-adaa-4bad-8eb1-a83b6a39e040)
