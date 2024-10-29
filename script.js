// Handle OAuth form submission
document.getElementById('oauth-form').onsubmit = (e) => {
    e.preventDefault();

    // Retrieve user-entered OAuth credentials
    const clientID = document.getElementById('client-id').value;
    const clientSecret = document.getElementById('client-secret').value; // Not used in the implicit flow
    const redirectURI = document.getElementById('redirect-uri').value;

    // Construct the Google OAuth URL with the user's credentials
    const authURL = `https://accounts.google.com/o/oauth2/auth?client_id=${clientID}&redirect_uri=${redirectURI}&scope=https://www.googleapis.com/auth/drive.readonly&response_type=token`;
    
    // Redirect to Google OAuth screen
    window.location.href = authURL;
};

// Capture the access token after redirection
window.onload = () => {
    const hash = window.location.hash;
    if (hash.includes('access_token')) {
        const accessToken = new URLSearchParams(hash.substring(1)).get('access_token');
        
        // Hide form and display video container
        document.getElementById('oauth-form').style.display = 'none';
        document.getElementById('video-container').style.display = 'block';
        
        // Fetch and display video from Google Drive
        fetchVideoList(accessToken);
    }
};

// Fetch video files from Google Drive
function fetchVideoList(accessToken) {
    fetch('https://www.googleapis.com/drive/v3/files?q=mimeType=\'video/mp4\' or mimeType=\'video/x-matroska\'&fields=files(id,name)', {
        headers: { Authorization: `Bearer ${accessToken}` }
    })
    .then(response => response.json())
    .then(data => {
        if (data.files.length > 0) {
            loadVideo(data.files[0].id, accessToken); // Load the first video
        }
    })
    .catch(error => console.error('Error fetching videos:', error));
}

// Load video into the Video.js player
function loadVideo(fileID, accessToken) {
    const player = videojs('player'); // Initialize Video.js player
    const videoSrc = `https://www.googleapis.com/drive/v3/files/${fileID}?alt=media&access_token=${accessToken}`;
    
    player.src({ 
        src: videoSrc,
        type: 'video/x-matroska' // Set the appropriate type for MKV files
    });

    player.ready(() => {
        player.play(); // Optionally, play automatically
    });
}
