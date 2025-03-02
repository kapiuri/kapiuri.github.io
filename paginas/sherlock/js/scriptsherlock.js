// script.js

function searchProfiles() {
    const username = document.getElementById('username').value.trim();
    const resultsDiv = document.getElementById('results');
    
    resultsDiv.innerHTML = ''; // Limpiar resultados previos

    if (username === '') {
        resultsDiv.innerHTML = '<p>Por favor, ingresa un nombre de usuario.</p>';
        return;
    }

    // URLs para las redes sociales
    const profiles = [
        { name: 'Facebook', url: `https://www.facebook.com/${username}` },
        { name: 'Twitter', url: `https://twitter.com/${username}` },
        { name: 'Instagram', url: `https://www.instagram.com/${username}` },
        { name: 'LinkedIn', url: `https://www.linkedin.com/in/${username}` },
        { name: 'GitHub', url: `https://github.com/${username}` },
        { name: 'Reddit', url: `https://www.reddit.com/user/${username}` },
        { name: 'YouTube', url: `https://www.youtube.com/user/${username}` },
        { name: 'Twitch', url: `https://www.twitch.tv/${username}` },
        { name: 'Tumblr', url: `https://www.tumblr.com/${username}` },
        { name: 'Pinterest', url: `https://www.pinterest.com/${username}` },
        { name: 'Snapchat', url: `https://www.snapchat.com/add/${username}` },
        { name: 'Flickr', url: `https://www.flickr.com/photos/${username}` },
        { name: 'SoundCloud', url: `https://soundcloud.com/${username}` },
        { name: 'Vimeo', url: `https://vimeo.com/${username}` },
        { name: 'Dailymotion', url: `https://www.dailymotion.com/${username}` },
        { name: 'Behance', url: `https://www.behance.net/${username}` },
        { name: 'Dribbble', url: `https://dribbble.com/${username}` },
        { name: 'Goodreads', url: `https://www.goodreads.com/user/show/${username}` },
        { name: 'Slack', url: `https://${username}.slack.com` },
        { name: 'Spotify', url: `https://open.spotify.com/user/${username}` }
    ];

    // Mostrar resultados basados en la construcción de URL
    profiles.forEach(profile => {
        const profileLink = document.createElement('a');
        profileLink.href = profile.url;
        profileLink.target = '_blank';
        profileLink.className = 'result-item';
        profileLink.textContent = `${profile.name}: ${profile.url}`;

        resultsDiv.appendChild(profileLink);
    });

    if (resultsDiv.innerHTML === '') {
        resultsDiv.innerHTML = '<p>No se encontraron perfiles.</p>';
    }
}
