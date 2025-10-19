const express = require('express');
const router = express.Router();

// In-memory storage for tracked contributions (in production, use a database)
let trackedContributions = [];
let contributionId = 1;

// Get all tracked contributions
router.get('/', (req, res) => {
  res.json(trackedContributions);
});

// Get a specific tracked contribution
router.get('/:id', (req, res) => {
  const contribution = trackedContributions.find(c => c.id === parseInt(req.params.id));
  if (!contribution) {
    return res.status(404).json({ error: 'Contribution not found' });
  }
  res.json(contribution);
});

// Add a new tracked contribution
router.post('/', (req, res) => {
  const { username, repository, type, title, url, status, notes } = req.body;
  
  if (!username || !repository || !type) {
    return res.status(400).json({ error: 'Username, repository, and type are required' });
  }

  const newContribution = {
    id: contributionId++,
    username,
    repository,
    type, // 'pull_request', 'issue', 'commit', 'review', etc.
    title: title || '',
    url: url || '',
    status: status || 'in_progress', // 'in_progress', 'merged', 'closed', 'open'
    notes: notes || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  trackedContributions.push(newContribution);
  res.status(201).json(newContribution);
});

// Update a tracked contribution
router.put('/:id', (req, res) => {
  const index = trackedContributions.findIndex(c => c.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ error: 'Contribution not found' });
  }

  const { repository, type, title, url, status, notes } = req.body;
  
  const updatedContribution = {
    ...trackedContributions[index],
    repository: repository || trackedContributions[index].repository,
    type: type || trackedContributions[index].type,
    title: title !== undefined ? title : trackedContributions[index].title,
    url: url !== undefined ? url : trackedContributions[index].url,
    status: status || trackedContributions[index].status,
    notes: notes !== undefined ? notes : trackedContributions[index].notes,
    updatedAt: new Date().toISOString()
  };

  trackedContributions[index] = updatedContribution;
  res.json(updatedContribution);
});

// Delete a tracked contribution
router.delete('/:id', (req, res) => {
  const index = trackedContributions.findIndex(c => c.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ error: 'Contribution not found' });
  }

  trackedContributions.splice(index, 1);
  res.status(204).send();
});

// Get contribution statistics for a user
router.get('/stats/:username', (req, res) => {
  const { username } = req.params;
  const userContributions = trackedContributions.filter(c => c.username === username);

  const stats = {
    total: userContributions.length,
    byType: {},
    byStatus: {},
    recentContributions: userContributions
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
  };

  userContributions.forEach(contribution => {
    stats.byType[contribution.type] = (stats.byType[contribution.type] || 0) + 1;
    stats.byStatus[contribution.status] = (stats.byStatus[contribution.status] || 0) + 1;
  });

  res.json(stats);
});

module.exports = router;
