const express = require('express');
const router = express.Router();
const githubService = require('../services/githubService');

// Get user information
router.get('/user/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const userInfo = await githubService.getUserInfo(username);
    res.json(userInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user repositories
router.get('/user/:username/repos', async (req, res) => {
  try {
    const { username } = req.params;
    const { page = 1, perPage = 30 } = req.query;
    const repos = await githubService.getUserRepositories(username, page, perPage);
    res.json(repos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user events
router.get('/user/:username/events', async (req, res) => {
  try {
    const { username } = req.params;
    const { page = 1, perPage = 30 } = req.query;
    const events = await githubService.getUserEvents(username, page, perPage);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user pull requests
router.get('/user/:username/pullrequests', async (req, res) => {
  try {
    const { username } = req.params;
    const pullRequests = await githubService.getUserPullRequests(username);
    res.json(pullRequests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user issues
router.get('/user/:username/issues', async (req, res) => {
  try {
    const { username } = req.params;
    const issues = await githubService.getUserIssues(username);
    res.json(issues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get contribution statistics
router.get('/user/:username/stats', async (req, res) => {
  try {
    const { username } = req.params;
    const stats = await githubService.getContributionStats(username);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
