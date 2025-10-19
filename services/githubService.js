const axios = require('axios');

class GitHubService {
  constructor() {
    this.baseURL = 'https://api.github.com';
    this.token = process.env.GITHUB_TOKEN;
  }

  getHeaders() {
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Open-Source-Contribution-Tracker'
    };
    
    if (this.token) {
      headers['Authorization'] = `token ${this.token}`;
    }
    
    return headers;
  }

  async getUserInfo(username) {
    try {
      const response = await axios.get(`${this.baseURL}/users/${username}`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch user info: ${error.message}`);
    }
  }

  async getUserRepositories(username, page = 1, perPage = 30) {
    try {
      const response = await axios.get(`${this.baseURL}/users/${username}/repos`, {
        headers: this.getHeaders(),
        params: {
          page,
          per_page: perPage,
          sort: 'updated',
          direction: 'desc'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch repositories: ${error.message}`);
    }
  }

  async getUserEvents(username, page = 1, perPage = 30) {
    try {
      const response = await axios.get(`${this.baseURL}/users/${username}/events`, {
        headers: this.getHeaders(),
        params: {
          page,
          per_page: perPage
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch user events: ${error.message}`);
    }
  }

  async getRepositoryCommits(owner, repo, author, since = null) {
    try {
      const params = { author };
      if (since) {
        params.since = since;
      }
      
      const response = await axios.get(`${this.baseURL}/repos/${owner}/${repo}/commits`, {
        headers: this.getHeaders(),
        params
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch commits: ${error.message}`);
    }
  }

  async getUserPullRequests(username) {
    try {
      const response = await axios.get(`${this.baseURL}/search/issues`, {
        headers: this.getHeaders(),
        params: {
          q: `author:${username} type:pr`,
          sort: 'created',
          order: 'desc',
          per_page: 100
        }
      });
      return response.data.items;
    } catch (error) {
      throw new Error(`Failed to fetch pull requests: ${error.message}`);
    }
  }

  async getUserIssues(username) {
    try {
      const response = await axios.get(`${this.baseURL}/search/issues`, {
        headers: this.getHeaders(),
        params: {
          q: `author:${username} type:issue`,
          sort: 'created',
          order: 'desc',
          per_page: 100
        }
      });
      return response.data.items;
    } catch (error) {
      throw new Error(`Failed to fetch issues: ${error.message}`);
    }
  }

  async getContributionStats(username) {
    try {
      const [events, pullRequests, issues, repos] = await Promise.all([
        this.getUserEvents(username, 1, 100),
        this.getUserPullRequests(username),
        this.getUserIssues(username),
        this.getUserRepositories(username, 1, 100)
      ]);

      // Analyze contribution types from events
      const contributionTypes = {
        pushEvents: 0,
        pullRequestEvents: 0,
        issueEvents: 0,
        createEvents: 0,
        forkEvents: 0,
        watchEvents: 0,
        other: 0
      };

      events.forEach(event => {
        switch (event.type) {
          case 'PushEvent':
            contributionTypes.pushEvents++;
            break;
          case 'PullRequestEvent':
            contributionTypes.pullRequestEvents++;
            break;
          case 'IssuesEvent':
            contributionTypes.issueEvents++;
            break;
          case 'CreateEvent':
            contributionTypes.createEvents++;
            break;
          case 'ForkEvent':
            contributionTypes.forkEvents++;
            break;
          case 'WatchEvent':
            contributionTypes.watchEvents++;
            break;
          default:
            contributionTypes.other++;
        }
      });

      // Calculate statistics
      const stats = {
        totalEvents: events.length,
        totalPullRequests: pullRequests.length,
        totalIssues: issues.length,
        totalRepositories: repos.length,
        ownedRepositories: repos.filter(r => !r.fork).length,
        forkedRepositories: repos.filter(r => r.fork).length,
        contributionBreakdown: contributionTypes,
        languages: this.extractLanguages(repos),
        recentActivity: events.slice(0, 10).map(e => ({
          type: e.type,
          repo: e.repo.name,
          created_at: e.created_at
        }))
      };

      return stats;
    } catch (error) {
      throw new Error(`Failed to get contribution stats: ${error.message}`);
    }
  }

  extractLanguages(repos) {
    const languages = {};
    repos.forEach(repo => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });
    return Object.entries(languages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .reduce((obj, [lang, count]) => {
        obj[lang] = count;
        return obj;
      }, {});
  }
}

module.exports = new GitHubService();
