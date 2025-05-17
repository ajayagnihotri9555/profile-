document.addEventListener('DOMContentLoaded', function() {
    // Navbar navigation
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
        });
    });

    // Modal elements
    const signInModal = document.getElementById('signInModal');
    const signUpModal = document.getElementById('signUpModal');
    const signInBtn = document.querySelector('.sign-in-btn');
    const signUpBtn = document.querySelector('.sign-up-btn');
    const closeButtons = document.querySelectorAll('.close-modal');

    // Form elements
    const signInForm = document.getElementById('signInForm');
    const signUpForm = document.getElementById('signUpForm');

    // Profile analysis elements
    const analyzeBtn = document.getElementById('analyzeBtn');
    const profileUrl = document.getElementById('profileUrl');
    const results = document.getElementById('results');
    const profileDetailsForm = document.getElementById('profileDetailsForm');
    const resultCard = document.querySelector('.result-card');

    // Contact form elements
    const contactForm = document.getElementById('contactForm');

    // Show modals
    if (signInBtn) {
        signInBtn.addEventListener('click', function() {
            signInModal.style.display = 'block';
        });
    }

    if (signUpBtn) {
        signUpBtn.addEventListener('click', function() {
            signUpModal.style.display = 'block';
        });
    }

    // Close modals
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            signInModal.style.display = 'none';
            signUpModal.style.display = 'none';
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === signInModal) {
            signInModal.style.display = 'none';
        }
        if (event.target === signUpModal) {
            signUpModal.style.display = 'none';
        }
    });

    // Handle Sign In Form Submission
    if (signInForm) {
        signInForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('signInEmail').value;
            const password = document.getElementById('signInPassword').value;
            // Add your sign in logic here
            console.log('Sign In:', { email, password });
            alert('Successfully signed in!');
            signInModal.style.display = 'none';
        });
    }

    // Handle Sign Up Form Submission
    if (signUpForm) {
        signUpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('signUpName').value;
            const email = document.getElementById('signUpEmail').value;
            const password = document.getElementById('signUpPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            // Add your sign up logic here
            console.log('Sign Up:', { name, email, password });
            alert('Successfully signed up!');
            signUpModal.style.display = 'none';
        });
    }

    // Handle social login buttons
    document.querySelectorAll('.google-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Here you would implement Google OAuth
            alert('Google login clicked');
        });
    });

    document.querySelectorAll('.facebook-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Here you would implement Facebook OAuth
            alert('Facebook login clicked');
        });
    });

    // Handle Google Sign-In response
    window.handleGoogleSignIn = async function(response) {
        console.log('Google Sign-In response:', response);
        const idToken = response.credential;

        try {
            const res = await fetch('http://localhost:5000/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token: idToken })
            });

            const data = await res.json();

            if (res.ok) {
                // Authentication successful
                localStorage.setItem('token', data.token);
                alert('Signed in with Google successfully!');
                signInModal.style.display = 'none';
                // Redirect or update UI as needed
            } else {
                // Authentication failed
                alert('Google Sign-In failed: ' + (data.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error during Google Sign-In:', error);
            alert('Google Sign-In failed. Please try again.');
        }
    };

    // Handle Google Sign-Up response (can be same as sign-in for now, backend handles user creation)
    window.handleGoogleSignUp = async function(response) {
         console.log('Google Sign-Up response:', response);
        const idToken = response.credential;

        try {
            const res = await fetch('http://localhost:5000/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token: idToken })
            });

            const data = await res.json();

            if (res.ok) {
                // Authentication successful
                localStorage.setItem('token', data.token);
                alert('Signed up with Google successfully!');
                 signUpModal.style.display = 'none';
                // Redirect or update UI as needed
            } else {
                // Authentication failed
                alert('Google Sign-Up failed: ' + (data.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error during Google Sign-Up:', error);
            alert('Google Sign-Up failed. Please try again.');
        }
    };

    // Show results section when analyze button is clicked
    if (analyzeBtn && profileUrl) {
        analyzeBtn.addEventListener('click', function() {
            if (profileUrl.value.trim() === '') {
                alert('Please enter a profile URL');
                return;
            }
            results.style.display = 'block';
            results.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Handle profile details form submission
    if (profileDetailsForm) {
        profileDetailsForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get all form values
            const formData = {
                url: profileUrl.value,
                name: document.getElementById('profileName').value,
                username: document.getElementById('profileUsername').value,
                followersCount: parseInt(document.getElementById('followersCount').value),
                followingCount: parseInt(document.getElementById('followingCount').value),
                postsCount: parseInt(document.getElementById('postsCount').value),
                avgLikes: parseInt(document.getElementById('avgLikes').value),
                accountAge: parseInt(document.getElementById('accountAge').value),
                highlightsCount: parseInt(document.getElementById('highlightsCount').value),
                bio: document.getElementById('profileBio').value,
                profilePic: document.getElementById('profilePic').value
            };

            try {
                // Send data to backend
                const response = await fetch('http://localhost:5000/api/analysis', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': localStorage.getItem('token') // If user is logged in
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    throw new Error('Analysis failed');
                }

                const analysisResult = await response.json();
                displayAnalysisResults(analysisResult);
            } catch (error) {
                console.error('Error:', error);
                let errorMessage = 'Failed to analyze profile. Please try again.';
                if (error.response && error.response.json) {
                    const errorBody = await error.response.json();
                    if (errorBody.message) {
                        errorMessage = errorBody.message;
                    }
                }
                alert(errorMessage);
            }
        });
    }

    // Function to display analysis results
    function displayAnalysisResults(result) {
        // Show result card
        resultCard.style.display = 'block';

        // Update profile info
        document.querySelector('#profileImage').src = result.profilePic;
        document.querySelector('#profileName').textContent = result.name;
        document.querySelector('#profileUsername').textContent = '@' + result.username;

        // Update analysis results
        document.querySelector('#authenticityScore').textContent = result.analysis.authenticityScore + '%';
        document.querySelector('#riskLevel').textContent = result.analysis.riskLevel;
        document.querySelector('#accountAge').textContent = result.accountAge + ' months';
        document.querySelector('#securityScore').textContent = result.analysis.securityScore + '%';
        document.querySelector('#activityScore').textContent = result.analysis.activityScore + '%';

        // Update detailed analysis
        const detailedAnalysis = result.analysis.detailedAnalysis;
        
        // Profile Picture Analysis
        const profilePictureList = document.getElementById('profilePictureAnalysis');
        profilePictureList.innerHTML = detailedAnalysis.profilePicture
            .map(item => `<li>${item}</li>`).join('');

        // Account Activity Analysis
        const accountActivityList = document.getElementById('accountActivityAnalysis');
        accountActivityList.innerHTML = detailedAnalysis.accountActivity
            .map(item => `<li>${item}</li>`).join('');

        // Followers Analysis
        const followersList = document.getElementById('followersAnalysis');
        followersList.innerHTML = detailedAnalysis.followers
            .map(item => `<li>${item}</li>`).join('');

        // Content Analysis
        const contentList = document.getElementById('contentAnalysis');
        contentList.innerHTML = detailedAnalysis.content
            .map(item => `<li>${item}</li>`).join('');

        // Security Analysis
        const securityList = document.getElementById('securityAnalysis');
        securityList.innerHTML = detailedAnalysis.security
            .map(item => `<li>${item}</li>`).join('');

        // Location Analysis
        const locationList = document.getElementById('locationAnalysis');
        locationList.innerHTML = detailedAnalysis.location
            .map(item => `<li>${item}</li>`).join('');

        // Recommendations
        const recommendationsList = document.getElementById('recommendationsList');
        recommendationsList.innerHTML = result.analysis.recommendations
            .map(item => `<li>${item}</li>`).join('');

        // Scroll to results
        resultCard.scrollIntoView({ behavior: 'smooth' });
    }

    // Add input validation
    if (profileUrl) {
        profileUrl.addEventListener('input', () => {
            const url = profileUrl.value.trim();
            if (url) {
                analyzeBtn.disabled = false;
            } else {
                analyzeBtn.disabled = true;
            }
        });
    }

    // Contact Form Handling
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const message = document.getElementById('contactMessage').value;
            // Add your contact form submission logic here
            console.log('Contact Form:', { name, email, message });
            alert('Message sent successfully!');
            contactForm.reset();
        });
    }
});

// Helper functions for profile analysis
function calculateAuthenticityScore(followers, following, posts, avgLikes, accountAge) {
    let score = 0;
    
    // Account age factor (max 30 points)
    score += Math.min(accountAge * 2, 30);
    
    // Follower to following ratio (max 20 points)
    const ratio = followers / following;
    if (ratio > 0.5 && ratio < 2) score += 20;
    else if (ratio > 0.2 && ratio < 5) score += 15;
    else if (ratio > 0.1 && ratio < 10) score += 10;
    
    // Post activity (max 25 points)
    score += Math.min(posts * 0.5, 25);
    
    // Engagement rate (max 25 points)
    const engagementRate = (avgLikes / followers) * 100;
    score += Math.min(engagementRate * 0.5, 25);
    
    return Math.round(score);
}

function calculateRiskLevel(authenticityScore) {
    if (authenticityScore >= 80) return 'Low Risk';
    if (authenticityScore >= 60) return 'Medium Risk';
    if (authenticityScore >= 40) return 'High Risk';
    return 'Very High Risk';
}

function calculateSecurityScore(bio, highlights) {
    let score = 50; // Base score
    
    // Bio length factor
    if (bio.length > 100) score += 10;
    if (bio.length > 200) score += 10;
    
    // Highlights factor
    score += Math.min(highlights * 5, 30);
    
    return Math.min(score, 100);
}

function calculateActivityScore(posts, avgLikes) {
    let score = 0;
    
    // Post frequency factor
    score += Math.min(posts * 2, 50);
    
    // Engagement factor
    score += Math.min(avgLikes * 0.1, 50);
    
    return Math.round(Math.min(score, 100));
}

function generateDetailedAnalysis(name, followers, following, posts, avgLikes, accountAge, bio) {
    // Profile Picture Analysis
    const profilePictureAnalysis = document.getElementById('profilePictureAnalysis');
    profilePictureAnalysis.innerHTML = `
        <li>Profile picture appears to be genuine</li>
        <li>No signs of stock photo usage</li>
        <li>Image quality is good</li>
    `;

    // Account Activity Analysis
    const accountActivityAnalysis = document.getElementById('accountActivityAnalysis');
    accountActivityAnalysis.innerHTML = `
        <li>Account age: ${accountAge} months</li>
        <li>Total posts: ${posts}</li>
        <li>Average likes per post: ${avgLikes}</li>
        <li>Post frequency: ${Math.round(posts/accountAge)} posts per month</li>
    `;

    // Followers Analysis
    const followersAnalysis = document.getElementById('followersAnalysis');
    const ratio = followers / following;
    followersAnalysis.innerHTML = `
        <li>Followers: ${followers}</li>
        <li>Following: ${following}</li>
        <li>Follower to following ratio: ${ratio.toFixed(2)}</li>
        <li>${ratio > 1 ? 'Healthy' : 'Unusual'} follower ratio</li>
    `;

    // Content Analysis
    const contentAnalysis = document.getElementById('contentAnalysis');
    contentAnalysis.innerHTML = `
        <li>Bio length: ${bio.length} characters</li>
        <li>Bio appears to be ${bio.length > 50 ? 'detailed' : 'minimal'}</li>
        <li>Content engagement rate: ${((avgLikes/followers)*100).toFixed(2)}%</li>
    `;

    // Security Analysis
    const securityAnalysis = document.getElementById('securityAnalysis');
    securityAnalysis.innerHTML = `
        <li>Account privacy settings: Public</li>
        <li>Profile information completeness: ${bio.length > 100 ? 'Good' : 'Basic'}</li>
        <li>Account verification status: Not verified</li>
    `;

    // Location Analysis
    const locationAnalysis = document.getElementById('locationAnalysis');
    locationAnalysis.innerHTML = `
        <li>Location information: Not available</li>
        <li>Account creation location: Unknown</li>
        <li>Activity patterns: Regular</li>
    `;

    // Recommendations
    const recommendationsList = document.getElementById('recommendationsList');
    recommendationsList.innerHTML = `
        <li>Consider enabling two-factor authentication</li>
        <li>Add more personal information to your bio</li>
        <li>Regularly review your privacy settings</li>
        <li>Be cautious with direct messages from unknown users</li>
    `;
} 