// API base URL
const API_BASE = '/api';

// Fetch user data from GitHub
async function fetchUserData() {
    const username = document.getElementById('username').value.trim();
    
    if (!username) {
        alert('Please enter a GitHub username');
        return;
    }

    showLoading(true);
    hideError();

    try {
        // Fetch user profile
        const userResponse = await fetch(`${API_BASE}/github/user/${username}`);
        if (!userResponse.ok) throw new Error('User not found');
        const userData = await userResponse.json();
        displayUserProfile(userData);

        // Fetch contribution stats
        const statsResponse = await fetch(`${API_BASE}/github/user/${username}/stats`);
        if (!statsResponse.ok) throw new Error('Failed to fetch stats');
        const statsData = await statsResponse.json();
        displayContributionAnalytics(statsData);
        displayRecentActivity(statsData.recentActivity);

    } catch (error) {
        showError(`Error: ${error.message}`);
        console.error('Error fetching data:', error);
    } finally {
        showLoading(false);
    }
}

// Display user profile
function displayUserProfile(user) {
    const profileSection = document.getElementById('userProfile');
    const profileContent = document.getElementById('profileContent');
    
    profileContent.innerHTML = `
        <div class="profile-grid">
            <img src="${user.avatar_url}" alt="${user.login}" class="profile-avatar" />
            <div class="profile-info">
                <h3>${user.name || user.login}</h3>
                <p><strong>Username:</strong> @${user.login}</p>
                ${user.bio ? `<p><strong>Bio:</strong> ${user.bio}</p>` : ''}
                ${user.location ? `<p><strong>Location:</strong> ${user.location}</p>` : ''}
                ${user.company ? `<p><strong>Company:</strong> ${user.company}</p>` : ''}
                <p><strong>Public Repos:</strong> ${user.public_repos}</p>
                <p><strong>Followers:</strong> ${user.followers} | <strong>Following:</strong> ${user.following}</p>
                ${user.blog ? `<p><strong>Website:</strong> <a href="${user.blog}" target="_blank">${user.blog}</a></p>` : ''}
            </div>
        </div>
    `;
    
    profileSection.style.display = 'block';
}

// Display contribution analytics
function displayContributionAnalytics(stats) {
    const analyticsSection = document.getElementById('contributionAnalytics');
    const analyticsContent = document.getElementById('analyticsContent');
    
    // Create stats grid
    const statsHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="number">${stats.totalEvents}</div>
                <div class="label">Recent Events</div>
            </div>
            <div class="stat-card">
                <div class="number">${stats.totalPullRequests}</div>
                <div class="label">Pull Requests</div>
            </div>
            <div class="stat-card">
                <div class="number">${stats.totalIssues}</div>
                <div class="label">Issues Created</div>
            </div>
            <div class="stat-card">
                <div class="number">${stats.totalRepositories}</div>
                <div class="label">Repositories</div>
            </div>
        </div>

        <h3 style="margin-top: 25px;">Contribution Breakdown</h3>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="number">${stats.contributionBreakdown.pushEvents}</div>
                <div class="label">Push Events</div>
            </div>
            <div class="stat-card">
                <div class="number">${stats.contributionBreakdown.pullRequestEvents}</div>
                <div class="label">PR Events</div>
            </div>
            <div class="stat-card">
                <div class="number">${stats.contributionBreakdown.issueEvents}</div>
                <div class="label">Issue Events</div>
            </div>
            <div class="stat-card">
                <div class="number">${stats.contributionBreakdown.createEvents}</div>
                <div class="label">Create Events</div>
            </div>
        </div>

        ${Object.keys(stats.languages).length > 0 ? `
            <h3 style="margin-top: 25px;">Top Languages</h3>
            <div class="languages-list">
                ${Object.entries(stats.languages).map(([lang, count]) => 
                    `<div class="language-tag">${lang}<span class="count">${count}</span></div>`
                ).join('')}
            </div>
        ` : ''}
    `;
    
    analyticsContent.innerHTML = statsHTML;
    analyticsSection.style.display = 'block';
}

// Display recent activity
function displayRecentActivity(activities) {
    const activitySection = document.getElementById('recentActivity');
    const activityContent = document.getElementById('activityContent');
    
    if (!activities || activities.length === 0) {
        activityContent.innerHTML = '<p class="no-data">No recent activity found</p>';
        activitySection.style.display = 'block';
        return;
    }
    
    const activityHTML = `
        <ul class="activity-list">
            ${activities.map(activity => `
                <li class="activity-item">
                    <div class="type">${formatEventType(activity.type)}</div>
                    <div class="repo">📦 ${activity.repo}</div>
                    <div class="time">🕒 ${formatDate(activity.created_at)}</div>
                </li>
            `).join('')}
        </ul>
    `;
    
    activityContent.innerHTML = activityHTML;
    activitySection.style.display = 'block';
}

// Format event type for display
function formatEventType(type) {
    const typeMap = {
        'PushEvent': '📤 Push',
        'PullRequestEvent': '🔀 Pull Request',
        'IssuesEvent': '🐛 Issue',
        'CreateEvent': '✨ Create',
        'ForkEvent': '🍴 Fork',
        'WatchEvent': '⭐ Star',
        'IssueCommentEvent': '💬 Comment'
    };
    return typeMap[type] || type;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
}

// Handle contribution form submission
document.getElementById('contributionForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const contribution = {
        username: document.getElementById('trackUsername').value.trim(),
        repository: document.getElementById('repository').value.trim(),
        type: document.getElementById('type').value,
        title: document.getElementById('title').value.trim(),
        url: document.getElementById('url').value.trim(),
        status: document.getElementById('status').value,
        notes: document.getElementById('notes').value.trim()
    };
    
    try {
        const response = await fetch(`${API_BASE}/contributions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contribution)
        });
        
        if (!response.ok) throw new Error('Failed to add contribution');
        
        // Reset form
        document.getElementById('contributionForm').reset();
        
        // Refresh tracked contributions
        loadTrackedContributions();
        
        alert('Contribution added successfully!');
    } catch (error) {
        showError(`Error: ${error.message}`);
        console.error('Error adding contribution:', error);
    }
});

// Load tracked contributions
async function loadTrackedContributions() {
    try {
        const response = await fetch(`${API_BASE}/contributions`);
        if (!response.ok) throw new Error('Failed to load contributions');
        
        const contributions = await response.json();
        displayTrackedContributions(contributions);
    } catch (error) {
        console.error('Error loading contributions:', error);
    }
}

// Display tracked contributions
function displayTrackedContributions(contributions) {
    const container = document.getElementById('trackedContributions');
    
    if (!contributions || contributions.length === 0) {
        container.innerHTML = '<p class="no-data">No contributions tracked yet. Add one above!</p>';
        return;
    }
    
    const contributionsHTML = contributions.map(c => `
        <div class="contribution-item">
            <div class="contribution-header">
                <div>
                    <span class="contribution-badge badge-${c.type}">${c.type.replace('_', ' ').toUpperCase()}</span>
                    <span class="status-badge status-${c.status}">${c.status.replace('_', ' ').toUpperCase()}</span>
                </div>
            </div>
            <div class="contribution-title">${c.title || 'Untitled'}</div>
            <div class="contribution-meta">
                <strong>Repository:</strong> ${c.repository}<br>
                <strong>User:</strong> @${c.username}<br>
                ${c.url ? `<strong>URL:</strong> <a href="${c.url}" target="_blank">${c.url}</a><br>` : ''}
                <strong>Created:</strong> ${new Date(c.createdAt).toLocaleDateString()}
            </div>
            ${c.notes ? `<div class="contribution-notes"><strong>Notes:</strong> ${c.notes}</div>` : ''}
            <div class="contribution-actions">
                <button class="delete-btn" onclick="deleteContribution(${c.id})">Delete</button>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = contributionsHTML;
}

// Delete contribution
async function deleteContribution(id) {
    if (!confirm('Are you sure you want to delete this contribution?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/contributions/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete contribution');
        
        loadTrackedContributions();
        alert('Contribution deleted successfully!');
    } catch (error) {
        showError(`Error: ${error.message}`);
        console.error('Error deleting contribution:', error);
    }
}

// Show/hide loading indicator
function showLoading(show) {
    document.getElementById('loadingIndicator').style.display = show ? 'block' : 'none';
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    const container = document.querySelector('.container');
    const firstCard = container.querySelector('.card');
    firstCard.parentNode.insertBefore(errorDiv, firstCard.nextSibling);
    
    setTimeout(() => errorDiv.remove(), 5000);
}

// Hide error messages
function hideError() {
    const errors = document.querySelectorAll('.error-message');
    errors.forEach(error => error.remove());
}

// Load tracked contributions on page load
document.addEventListener('DOMContentLoaded', () => {
    loadTrackedContributions();
});

// Allow Enter key to trigger search
document.getElementById('username').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        fetchUserData();
    }
});
