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

async function createPost(postContent) {
    const currentToken = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    try {
        const response = await fetch("/api/v1/posts", {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${currentToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                content: postContent
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log("New post created successfully!");

        // After posting, refresh the posts
        await displayPosts();

    } catch (error) {
        console.error('Error posting:', error);
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

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('signupForm');

    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent default form submission

        const userPost = document.getElementById('userPost');
        const postContent = userPost.value;
        userPost.value = ''; // Reset the input field

        createPost(postContent);
    });

    const followButton = document.getElementById('followOne');
    
    followButton.addEventListener('click', async function() {
        console.log('tester');
        const token = localStorage.getItem('token');
        const userToFollow = localStorage.getItem('username');
        const userToBeFollowed = 'johndoe';

        if (followButton.textContent == 'Follow') {
            try {
                await followUser(userToFollow, userToBeFollowed);
                followButton.textContent = 'Unfollow'
            } catch (error) {
                console.error('Error following user:', error);
            }
        }
        else {
            try {
                const response = await unfollowUser(userToFollow, userToBeFollowed);
                followButton.textContent = 'Follow'
                console.log('User has successfully been unfollowed');
            } catch (error) {
                console.error('Error unfollowing user:', error);
            }
        }
    });
    const followButtonTwo = document.getElementById('followTwo');
    
    followButtonTwo.addEventListener('click', async function() {
        const token = localStorage.getItem('token');
        const userToFollow = localStorage.getItem('username');
        const userToBeFollowed = 'janesmith';

        if (followButtonTwo.textContent == 'Follow') {
            try {
                await followUser(userToFollow, userToBeFollowed);
                followButtonTwo.textContent = 'Unfollow'
            } catch (error) {
                console.error('Error following user:', error);
            }
        }
        else {
            try {
                const response = await unfollowUser(userToFollow, userToBeFollowed);
                followButtonTwo.textContent = 'Follow'
                console.log('User has successfully been unfollowed');
            } catch (error) {
                console.error('Error unfollowing user:', error);
            }
        }
    });

    // Initial display of posts when the page loads
    displayPosts();
    displayFollowing();
    displayUsers();
});

async function displayFollowing(){
    const listOfFollowing = await getFollowing();
    listOfFollowing.forEach(username => console.log(username));
    const followButtonOne = document.getElementById('followOne')
    const followButtonTwo = document.getElementById('followTwo')
    if (listOfFollowing.includes('johndoe')){
        followButtonOne.textContent = 'Unfollow'
    }
    else {
        followButtonOne.textContent = 'Follow'
    }
    if (listOfFollowing.includes('janesmith')){
        followButtonTwo.textContent = 'Unfollow'
    }
    else {
        followButtonTwo.textContent = 'Follow'
    }
}

async function getFollowing() {
    const currentToken = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const url = `/api/v1/users/${username}/following`
    
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${currentToken}`,
                "Content-Type": "application/json"
            }
        });
        const following = await response.json();
        return following
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error; // Rethrow the error for handling in the calling function
    }
}

async function getUsers() {
    const currentToken = localStorage.getItem('token');
    const url = `/api/v1/users/`

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${currentToken}`,
                "Content-Type": "application/json"
            }
        });
        const users = await response.json();
        return users
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error; 
    }
}

async function displayUsers() {
    const users = await getUsers();
    users.forEach(username => console.log(username));
}

async function followUser(userToFollow, userToBeFollowed) {
    const url = `/api/v1/users/${userToFollow}/following/${userToBeFollowed}`;
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 201) {
            console.log('User has successfully been followed.');
        } else if (response.status === 400) {
            console.error('Bad request. User to follow does not exist.');
        } else if (response.status === 401) {
            console.error('Unauthorized. User is not logged in or username in path does not match logged in user.');
        } else {
            console.error('Unexpected error:', response.statusText);
        }
    } catch (error) {
        console.error('Error following user:', error);
    }
}

async function unfollowUser(userToFollow, userToBeFollowed) {
    const url = `/api/v1/users/${userToFollow}/following/${userToBeFollowed}`;
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        throw new Error('Error unfollowing user:', error);
    }
}