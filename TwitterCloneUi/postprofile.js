async function getPosts() {
    const currentToken = localStorage.getItem('token');
    
    try {
        const response = await fetch("/api/v1/posts", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${currentToken}`
            }
        });
        const posts = await response.json();
        return posts;
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error; // Rethrow the error for handling in the calling function
    }
}


async function displayPosts() {
    try {
        const posts = await getPosts();

        const feedSection = document.querySelector('.feed');

        // Clear existing posts in the feed
        feedSection.innerHTML = '';

        // Iterate through the fetched posts and append them to the feed
        posts.forEach(post => {
            const postElement = createPostElement(post);
            feedSection.appendChild(postElement);
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

function createPostElement(post) {
    const postContainer = document.createElement('div');
    postContainer.classList.add('post');

    const postProfileImage = document.createElement('div');
    postProfileImage.classList.add('post_profile-image');
    postProfileImage.innerHTML = `
        <img src="feedimages/Capy-profile.png" alt="${post.postedBy}-profile-image">
    `;
    postContainer.appendChild(postProfileImage);

    const postBody = document.createElement('div');
    postBody.classList.add('post_body');

    postBody.innerHTML = `
        <div class="post_header">
            <div class="post_header-text">
                <h3>${post.postedBy}
                    <span class="header-icon-section">
                        <span class="material-icons post_badge">verified</span>@${post.postedBy}
                    </span>
                    <span class="header-icon-section"> · ${formatElapsedTime(post.dateTimePosted)}</span>
                </h3>
            </div>
            <div class="post_header-discription">
                <p>${post.content}</p>
                
                
            </div>
        </div>
        
        <div class="post_footer">
            <span class="material-icons">chat</span>
            <span id="repeatIcon_${post.postId}" class="material-icons repeat-icon">repeat</span>
            <span id="favoriteIcon_${post.postId}" class="material-icons favorite-icon">favorite_border</span>
            <span class="material-icons">file_upload</span>
        </div>
    `;

    postContainer.appendChild(postBody);

    // Event listeners for favorite and repeat icons
    const favoriteIcon = postContainer.querySelector(`#favoriteIcon_${post.postId}`);
    const repeatIcon = postContainer.querySelector(`#repeatIcon_${post.postId}`);

    favoriteIcon.addEventListener("click", function() {
        // Toggle the clicked class on click
        favoriteIcon.classList.toggle("favorite-icon-clicked");
    });

    favoriteIcon.addEventListener("mouseover", function() {
        // Add the hover class on mouseover
        favoriteIcon.classList.add("favorite-icon-hover");
    });

    favoriteIcon.addEventListener("mouseout", function() {
        // Remove the hover class on mouseout
        favoriteIcon.classList.remove("favorite-icon-hover");
    });

    repeatIcon.addEventListener("click", function() {
        // Toggle the clicked class for repeat icon on click
        repeatIcon.classList.toggle("repeat-icon-clicked");
    });

    repeatIcon.addEventListener("mouseover", function() {
        // Add the hover class for repeat icon on mouseover
        repeatIcon.classList.add("repeat-icon-hover");
    });

    repeatIcon.addEventListener("mouseout", function() {
        // Remove the hover class for repeat icon on mouseout
        repeatIcon.classList.remove("repeat-icon-hover");
    });

    return postContainer;
}


// Function to format date and time

function formatElapsedTime(dateTimeString) {
    const postDate = new Date(dateTimeString);
    const now = new Date();
    const elapsedMilliseconds = now - postDate;

    // Calculate elapsed time in seconds, minutes, hours, or days
    if (elapsedMilliseconds < 1000) {
        return 'Just now';
    } else if (elapsedMilliseconds < 60 * 1000) {
        return `${Math.floor(elapsedMilliseconds / 1000)}s ago`;
    } else if (elapsedMilliseconds < 60 * 60 * 1000) {
        return `${Math.floor(elapsedMilliseconds / (60 * 1000))}m ago`;
    } else if (elapsedMilliseconds < 24 * 60 * 60 * 1000) {
        return `${Math.floor(elapsedMilliseconds / (60 * 60 * 1000))}h ago`;
    } else {
        return `${Math.floor(elapsedMilliseconds / (24 * 60 * 60 * 1000))}d ago`;
    }
}




    // Initial display of posts when the page loads
    displayPosts();

