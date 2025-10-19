# Quick Start Guide

## Getting Started with Open Source Contribution Tracker

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DevalPrime/Open-Source-Contribution-Tracker.git
   cd Open-Source-Contribution-Tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment (Optional)**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your GitHub Personal Access Token:
   ```
   GITHUB_TOKEN=your_token_here
   ```

4. **Start the application**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Features Overview

#### 1. GitHub Integration
- Enter any GitHub username to fetch their contribution data
- View profile information, repositories, and statistics
- See recent activity and contribution breakdown

#### 2. Track Your Contributions
- Manually add contributions you're working on
- Choose from different types: Pull Requests, Issues, Commits, Reviews, Documentation
- Track status: In Progress, Open, Merged, Closed
- Add notes and URLs for reference

#### 3. View Analytics
- See contribution statistics and breakdowns
- View most used programming languages
- Track recent activity timeline

### Example Usage

1. **Fetch GitHub Data**
   - Enter "octocat" in the GitHub username field
   - Click "Fetch Contributions"
   - View the profile and statistics

2. **Track a Contribution**
   - Fill in your GitHub username
   - Enter repository (e.g., "facebook/react")
   - Select type (e.g., "Pull Request")
   - Add title and URL
   - Click "Add Contribution"

3. **Manage Contributions**
   - View all tracked contributions below
   - Delete contributions when completed

### Tips

- Without a GitHub token, you're limited to 60 API requests per hour
- With a token, you get 5,000 requests per hour
- The app uses in-memory storage, so data resets when the server restarts
- For production use, consider adding database integration

### Troubleshooting

**GitHub API Rate Limit**
- If you see "403" errors, you've hit the rate limit
- Add a GitHub Personal Access Token to `.env`
- Wait an hour for the rate limit to reset

**Port Already in Use**
- Change the PORT in `.env` file
- Or stop other applications using port 3000

**Server Won't Start**
- Ensure Node.js v14+ is installed
- Run `npm install` again
- Check for error messages in the console

### Next Steps

- Explore the API endpoints in the README
- Customize the frontend styling in `public/styles.css`
- Add more features or integrations
- Consider adding database support for persistent storage

Enjoy tracking your open source contributions! 🚀
