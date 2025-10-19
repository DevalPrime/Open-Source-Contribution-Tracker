# Open-Source-Contribution-Tracker

A platform that helps open source enthusiasts track their contributions to various projects. It includes features like integration with GitHub, contribution analytics, and progress tracking.

## Features

✨ **GitHub Integration**
- Fetch user profile information from GitHub
- View repositories, pull requests, and issues
- Display recent activity and events

📊 **Contribution Analytics**
- Track contribution statistics
- Visualize contribution breakdown by type
- Analyze most used programming languages
- View recent activity timeline

📈 **Progress Tracking**
- Manually track contributions to any project
- Categorize contributions (Pull Requests, Issues, Commits, Reviews, Documentation)
- Monitor contribution status (In Progress, Open, Merged, Closed)
- Add notes to track your progress

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- GitHub Personal Access Token (optional, for higher API rate limits)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/DevalPrime/Open-Source-Contribution-Tracker.git
cd Open-Source-Contribution-Tracker
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. (Optional) Add your GitHub Personal Access Token to `.env`:
```
GITHUB_TOKEN=your_github_token_here
```

To generate a GitHub token:
- Go to https://github.com/settings/tokens
- Click "Generate new token (classic)"
- Select scopes: `repo`, `read:user`
- Copy the generated token to your `.env` file

## Usage

### Starting the Server

Run the application:
```bash
npm start
```

Or for development:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

### Using the Web Interface

1. **View GitHub Contributions**:
   - Enter a GitHub username in the search box
   - Click "Fetch Contributions" to view their profile and statistics

2. **Track Custom Contributions**:
   - Fill out the "Add New Contribution" form
   - Select the contribution type and status
   - Click "Add Contribution" to save it
   - View all tracked contributions in the list below

3. **Manage Tracked Contributions**:
   - View all your tracked contributions
   - Delete contributions you no longer want to track

## API Endpoints

### GitHub Integration

- `GET /api/github/user/:username` - Get user profile information
- `GET /api/github/user/:username/repos` - Get user repositories
- `GET /api/github/user/:username/events` - Get user events
- `GET /api/github/user/:username/pullrequests` - Get user pull requests
- `GET /api/github/user/:username/issues` - Get user issues
- `GET /api/github/user/:username/stats` - Get contribution statistics

### Contribution Tracking

- `GET /api/contributions` - Get all tracked contributions
- `POST /api/contributions` - Add a new tracked contribution
- `GET /api/contributions/:id` - Get a specific contribution
- `PUT /api/contributions/:id` - Update a tracked contribution
- `DELETE /api/contributions/:id` - Delete a tracked contribution
- `GET /api/contributions/stats/:username` - Get contribution stats for a user

### Health Check

- `GET /api/health` - Check API status

## Project Structure

```
Open-Source-Contribution-Tracker/
├── public/              # Frontend files
│   ├── index.html      # Main HTML page
│   ├── styles.css      # CSS styles
│   └── app.js          # Frontend JavaScript
├── routes/             # API routes
│   ├── github.js       # GitHub API routes
│   └── contributions.js # Contribution tracking routes
├── services/           # Business logic
│   └── githubService.js # GitHub API integration
├── server.js           # Express server setup
├── package.json        # Dependencies and scripts
├── .env.example        # Environment variables template
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## Technologies Used

- **Backend**: Node.js, Express.js
- **GitHub API**: Axios for HTTP requests
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Environment**: dotenv for configuration

## Rate Limits

- **Without GitHub Token**: 60 requests per hour
- **With GitHub Token**: 5,000 requests per hour

It's recommended to use a GitHub Personal Access Token for better rate limits.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- GitHub API for providing access to contribution data
- Open source community for inspiration

## Future Enhancements

- [ ] Database integration for persistent storage
- [ ] User authentication
- [ ] Contribution goals and milestones
- [ ] Export contributions to CSV/PDF
- [ ] Integration with GitLab and Bitbucket
- [ ] Contribution calendar visualization
- [ ] Team collaboration features
- [ ] Email notifications for contribution updates

