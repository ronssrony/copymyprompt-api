# CopyMyPrompt API Documentation

## Overview
This document provides comprehensive API documentation for the CopyMyPrompt application. The API is built with NestJS and follows RESTful principles with JWT authentication.

## Base URL
```
http://localhost:3000
```

## Authentication
Most endpoints require JWT authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format
All API responses follow this format:
```json
{
  "data": { ... },
  "message": "Success message (optional)"
}
```

Error responses:
```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request"
}
```

---

## API Endpoints

### 1. Authentication

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "data": {
    "user": { ... },
    "access_token": "jwt-token-here"
  }
}
```

#### POST /auth/login
Login to an existing account.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "data": {
    "user": { ... },
    "access_token": "jwt-token-here"
  }
}
```

---

### 2. Posts

#### POST /posts
Create a new post. **[Protected]**

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "string (optional)",
  "prompt": "string (required)",
  "image": "string (required, image URL)",
  "price": 0,
  "model": "string (optional, max 100 chars)",
  "categoryId": 1
}
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "title": "My Prompt",
    "prompt": "Prompt text...",
    "image": "https://...",
    "price": 0,
    "model": "gpt-4",
    "likesCount": 0,
    "sharesCount": 0,
    "copiesCount": 0,
    "ratingsCount": 0,
    "ratingsValue": 0,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "user": {
      "username": "john_doe",
      "image": "https://..."
    },
    "category": {
      "name": "Marketing"
    }
  }
}
```

#### GET /posts
Get all posts (public).

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "...",
      "prompt": "...",
      // ... full post object
    }
  ]
}
```

#### GET /posts/:id
Get a single post by ID.

**Response:**
```json
{
  "data": {
    "id": 1,
    "title": "...",
    // ... full post object
  }
}
```

#### GET /posts/my-posts
Get authenticated user's posts. **[Protected]**

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": [
    { /* post objects */ }
  ]
}
```

#### GET /posts/category/:categoryId
Get posts by category.

**Response:**
```json
{
  "data": [
    { /* post objects */ }
  ]
}
```

#### GET /posts/prompts/:type
Get posts filtered by type: `featured`, `trending`, or `thisWeek`.

**Parameters:**
- `type`: `featured` (sorted by copiesCount), `trending` (sorted by likesCount), or `thisWeek` (last 7 days)

**Response:**
```json
{
  "data": [
    { /* post objects, max 12 items */ }
  ]
}
```

---

### 3. Likes

#### POST /likes
Like a post. **[Protected]**

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "postId": 1
}
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "post": { "id": 1 },
    "user": { "id": 1 },
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Post liked successfully"
}
```

**Error (409 Conflict):**
```json
{
  "statusCode": 409,
  "message": "You have already liked this post"
}
```

#### GET /likes
Get all likes (admin endpoint).

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "post": { /* post object */ },
      "user": { /* user object */ },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### GET /likes/post/:postId
Get all likes for a specific post.

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "user": { "username": "...", "image": "..." },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### GET /likes/my-likes
Get current user's likes. **[Protected]**

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "post": { /* full post with user and category */ },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### GET /likes/check/:postId
Check if current user liked a post. **[Protected]**

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": {
    "isLiked": true,
    "like": { /* like object or null */ }
  }
}
```

#### DELETE /likes/:postId
Unlike a post. **[Protected]**

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Like removed successfully"
}
```

---

### 4. Copies

#### POST /copies
Copy a post. **[Protected]**

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "postId": 1
}
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "post": { "id": 1 },
    "user": { "id": 1 },
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Post copied successfully"
}
```

**Error (409 Conflict):**
```json
{
  "statusCode": 409,
  "message": "You have already copied this post"
}
```

#### GET /copies
Get all copies (admin endpoint).

#### GET /copies/post/:postId
Get all copies for a specific post.

#### GET /copies/my-copies
Get current user's copies. **[Protected]**

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "post": { /* full post with user and category */ },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### GET /copies/check/:postId
Check if current user copied a post. **[Protected]**

**Response:**
```json
{
  "data": {
    "isCopied": true,
    "copy": { /* copy object or null */ }
  }
}
```

#### DELETE /copies/:postId
Remove a copy. **[Protected]**

**Response:**
```json
{
  "message": "Copy removed successfully"
}
```

---

### 5. Shares

#### POST /shares
Share a post. **[Protected]**

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "postId": 1
}
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "post": { "id": 1 },
    "user": { "id": 1 },
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Post shared successfully"
}
```

**Error (409 Conflict):**
```json
{
  "statusCode": 409,
  "message": "You have already shared this post"
}
```

#### GET /shares
Get all shares (admin endpoint).

#### GET /shares/post/:postId
Get all shares for a specific post.

#### GET /shares/my-shares
Get current user's shares. **[Protected]**

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "post": { /* full post with user and category */ },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### GET /shares/check/:postId
Check if current user shared a post. **[Protected]**

**Response:**
```json
{
  "data": {
    "isShared": true,
    "share": { /* share object or null */ }
  }
}
```

#### DELETE /shares/:postId
Remove a share. **[Protected]**

**Response:**
```json
{
  "message": "Share removed successfully"
}
```

---

### 6. Ratings

#### POST /ratings
Rate a post. **[Protected]**

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "postId": 1,
  "value": 5,
  "body": "Great prompt! Very helpful." (optional)
}
```

**Validation:**
- `value`: Must be an integer between 1 and 5
- `body`: Optional string for review text

**Response:**
```json
{
  "data": {
    "id": 1,
    "post": { "id": 1 },
    "user": { "id": 1 },
    "value": 5,
    "body": "Great prompt!",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Post rated successfully"
}
```

**Error (409 Conflict):**
```json
{
  "statusCode": 409,
  "message": "You have already rated this post"
}
```

#### GET /ratings
Get all ratings (admin endpoint).

#### GET /ratings/post/:postId
Get all ratings for a specific post.

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "value": 5,
      "body": "Great prompt!",
      "user": { "username": "...", "image": "..." },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### GET /ratings/my-ratings
Get current user's ratings. **[Protected]**

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "value": 5,
      "body": "Great!",
      "post": { /* full post with user and category */ },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### GET /ratings/check/:postId
Check if current user rated a post. **[Protected]**

**Response:**
```json
{
  "data": {
    "isRated": true,
    "rating": { /* rating object with value and body, or null */ }
  }
}
```

#### PATCH /ratings/:postId
Update a rating. **[Protected]**

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "value": 4,
  "body": "Updated review text" (optional)
}
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "value": 4,
    "body": "Updated review text",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Rating updated successfully"
}
```

#### DELETE /ratings/:postId
Remove a rating. **[Protected]**

**Response:**
```json
{
  "message": "Rating removed successfully"
}
```

---

### 7. Categories

#### GET /categories
Get all categories.

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Marketing",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## Frontend Implementation Guide

### Setting Up Authentication

```javascript
// 1. Store the JWT token after login
const login = async (email, password) => {
  const response = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();

  // Store token in localStorage or state management
  localStorage.setItem('token', data.data.access_token);
  return data.data.user;
};

// 2. Create an API client with auth headers
const apiClient = {
  get: (url) => fetch(`http://localhost:3000${url}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  }).then(res => res.json()),

  post: (url, body) => fetch(`http://localhost:3000${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(body)
  }).then(res => res.json()),

  delete: (url) => fetch(`http://localhost:3000${url}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  }).then(res => res.json())
};
```

### Example: Like/Unlike a Post

```javascript
const LikeButton = ({ postId, initialLiked = false }) => {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [loading, setLoading] = useState(false);

  const toggleLike = async () => {
    setLoading(true);
    try {
      if (isLiked) {
        // Unlike
        await apiClient.delete(`/likes/${postId}`);
        setIsLiked(false);
      } else {
        // Like
        await apiClient.post('/likes', { postId });
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={toggleLike} disabled={loading}>
      {isLiked ? '❤️ Liked' : '🤍 Like'}
    </button>
  );
};
```

### Example: Copy a Prompt

```javascript
const CopyButton = ({ postId, promptText }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      // Record the copy action
      await apiClient.post('/copies', { postId });

      // Copy to clipboard
      await navigator.clipboard.writeText(promptText);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying:', error);
    }
  };

  return (
    <button onClick={handleCopy}>
      {copied ? '✅ Copied!' : '📋 Copy'}
    </button>
  );
};
```

### Example: Rate a Post

```javascript
const RatingComponent = ({ postId }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submitRating = async () => {
    try {
      await apiClient.post('/ratings', {
        postId,
        value: rating,
        body: review
      });
      setSubmitted(true);
    } catch (error) {
      if (error.statusCode === 409) {
        alert('You have already rated this post');
      }
    }
  };

  return (
    <div>
      <div>
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            onClick={() => setRating(star)}
            style={{ color: star <= rating ? 'gold' : 'gray' }}
          >
            ⭐
          </button>
        ))}
      </div>
      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Write your review (optional)"
      />
      <button onClick={submitRating} disabled={rating === 0 || submitted}>
        Submit Rating
      </button>
    </div>
  );
};
```

### Example: Display Post Statistics

```javascript
const PostCard = ({ post }) => {
  const averageRating = post.ratingsCount > 0
    ? (post.ratingsValue / post.ratingsCount).toFixed(1)
    : 0;

  return (
    <div className="post-card">
      <h3>{post.title}</h3>
      <p>{post.prompt}</p>

      <div className="stats">
        <span>❤️ {post.likesCount} likes</span>
        <span>📋 {post.copiesCount} copies</span>
        <span>🔗 {post.sharesCount} shares</span>
        <span>⭐ {averageRating} ({post.ratingsCount} ratings)</span>
      </div>

      <div className="meta">
        <span>By: {post.user.username}</span>
        <span>Category: {post.category.name}</span>
      </div>
    </div>
  );
};
```

### Example: Fetch User's Activity

```javascript
const UserDashboard = () => {
  const [myPosts, setMyPosts] = useState([]);
  const [myLikes, setMyLikes] = useState([]);
  const [myCopies, setMyCopies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [posts, likes, copies] = await Promise.all([
        apiClient.get('/posts/my-posts'),
        apiClient.get('/likes/my-likes'),
        apiClient.get('/copies/my-copies')
      ]);

      setMyPosts(posts.data);
      setMyLikes(likes.data);
      setMyCopies(copies.data);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>My Posts ({myPosts.length})</h2>
      <h2>My Likes ({myLikes.length})</h2>
      <h2>My Copies ({myCopies.length})</h2>
    </div>
  );
};
```

### Example: Check User Interactions

```javascript
const PostInteractionStatus = ({ postId }) => {
  const [status, setStatus] = useState({
    isLiked: false,
    isCopied: false,
    isShared: false,
    rating: null
  });

  useEffect(() => {
    const checkStatus = async () => {
      const [like, copy, share, rating] = await Promise.all([
        apiClient.get(`/likes/check/${postId}`),
        apiClient.get(`/copies/check/${postId}`),
        apiClient.get(`/shares/check/${postId}`),
        apiClient.get(`/ratings/check/${postId}`)
      ]);

      setStatus({
        isLiked: like.data.isLiked,
        isCopied: copy.data.isCopied,
        isShared: share.data.isShared,
        rating: rating.data.rating
      });
    };

    checkStatus();
  }, [postId]);

  return (
    <div>
      <p>Liked: {status.isLiked ? 'Yes' : 'No'}</p>
      <p>Copied: {status.isCopied ? 'Yes' : 'No'}</p>
      <p>Shared: {status.isShared ? 'Yes' : 'No'}</p>
      {status.rating && (
        <p>Your Rating: {status.rating.value} ⭐</p>
      )}
    </div>
  );
};
```

---

## Important Notes

### Counter Synchronization
All interaction endpoints (likes, copies, shares, ratings) automatically update the corresponding counters on the Post entity:
- Creating a like increments `likesCount`
- Deleting a like decrements `likesCount`
- Creating a copy increments `copiesCount`
- Creating a rating increments `ratingsCount` and adds to `ratingsValue`
- Updating a rating adjusts `ratingsValue` by the difference
- Deleting a rating decrements both counters

### Average Rating Calculation
To display the average rating:
```javascript
const averageRating = post.ratingsCount > 0
  ? post.ratingsValue / post.ratingsCount
  : 0;
```

### Error Handling
Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing or invalid token)
- `404` - Not Found
- `409` - Conflict (duplicate action, e.g., already liked)

### Unique Constraints
Users can only perform each action once per post:
- One like per post
- One copy per post
- One share per post
- One rating per post (but can be updated)

---

<!-- API Updates - 2025-10-21 -->

### 8. User Following & Profile (Added: 2025-10-21)

#### POST /users/follow/:userId
Follow a user. **[Protected]**

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "follower": { "id": 1 },
    "following": { "id": 2 },
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "User followed successfully"
}
```

**Error (409 Conflict):**
```json
{
  "statusCode": 409,
  "message": "You are already following this user"
}
```

#### DELETE /users/unfollow/:userId
Unfollow a user. **[Protected]**

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "User unfollowed successfully"
}
```

**Error (404 Not Found):**
```json
{
  "statusCode": 404,
  "message": "You are not following this user"
}
```

#### GET /users/following
Get users the current user is following. **[Protected]**

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": [
    {
      "id": 2,
      "username": "jane_doe",
      "image": "https://...",
      "bio": "AI enthusiast",
      "followersCount": 150,
      "followedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### GET /users/followers
Get current user's followers. **[Protected]**

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": [
    {
      "id": 3,
      "username": "john_smith",
      "image": "https://...",
      "bio": "Prompt creator",
      "followersCount": 200,
      "followedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### GET /users/check-following/:userId
Check if current user is following another user. **[Protected]**

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": {
    "isFollowing": true,
    "follow": { /* follow object or null */ }
  }
}
```

#### GET /users/profile/:userId
Get user profile information.

**Query Parameters (optional):**
- `currentUserId`: If provided, includes whether the current user is following this profile

**Response:**
```json
{
  "data": {
    "id": 1,
    "username": "john_doe",
    "image": "https://...",
    "bio": "AI Content Creator & Digital Artist",
    "followersCount": 243,
    "followingCount": 152,
    "postsCount": 5,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "isFollowing": false
  }
}
```

#### PUT /users/profile
Update current user's profile. **[Protected]** (Added: 2025-10-21)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "username": "string (optional, max 50 chars)",
  "image": "string (optional, max 500 chars)",
  "bio": "string (optional)"
}
```

**Note:** Email cannot be updated through this endpoint.

**Response:**
```json
{
  "data": {
    "id": 1,
    "username": "updated_username",
    "email": "user@example.com",
    "image": "https://new-image-url.com",
    "bio": "Updated bio text",
    "followersCount": 243,
    "followingCount": 152
  },
  "message": "Profile updated successfully"
}
```

**Error (409 Conflict):**
```json
{
  "statusCode": 409,
  "message": "Username already exists"
}
```

#### GET /users/top-creators
Get top creators based on different criteria. (Added: 2025-10-21)

**Query Parameters:**
- `sortBy`: `posts` (default), `followers`, or `copies`

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "username": "top_creator",
      "image": "https://...",
      "bio": "Professional prompt creator",
      "followersCount": 1500,
      "followingCount": 200,
      "postsCount": 125,
      "totalCopies": 3420
    }
  ]
}
```

**Usage Examples:**
- `GET /users/top-creators` - Returns top 10 creators by post count
- `GET /users/top-creators?sortBy=followers` - Returns top 10 creators by followers
- `GET /users/top-creators?sortBy=copies` - Returns top 10 creators by total copies

#### GET /users/:userId/posts
Get user profile with all their posts. (Added: 2025-10-21)

**Headers (optional):**
```
Authorization: Bearer <token>
```

**Notes:**
- If JWT token is provided, the response includes `isFollowing` property
- If no token is provided, the endpoint still works but without `isFollowing`
- This allows both authenticated and unauthenticated users to view profiles

**Response (authenticated):**
```json
{
  "data": {
    "id": 1,
    "username": "john_doe",
    "image": "https://...",
    "bio": "AI Content Creator",
    "followersCount": 243,
    "followingCount": 152,
    "postsCount": 5,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "isFollowing": false,
    "posts": [
      {
        "id": 1,
        "title": "Marketing Prompt",
        "prompt": "Create a compelling...",
        "image": "https://...",
        "price": 0,
        "model": "gpt-4",
        "likesCount": 42,
        "sharesCount": 15,
        "copiesCount": 28,
        "ratingsCount": 10,
        "ratingsValue": 48,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "user": {
          "username": "john_doe",
          "image": "https://..."
        },
        "category": {
          "name": "Marketing"
        }
      }
    ]
  }
}
```

**Response (unauthenticated - no isFollowing):**
```json
{
  "data": {
    "id": 1,
    "username": "john_doe",
    "image": "https://...",
    "bio": "AI Content Creator",
    "followersCount": 243,
    "followingCount": 152,
    "postsCount": 5,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "posts": [
      {
        "id": 1,
        "title": "Marketing Prompt",
        "prompt": "Create a compelling...",
        "image": "https://...",
        "price": 0,
        "model": "gpt-4",
        "likesCount": 42,
        "sharesCount": 15,
        "copiesCount": 28,
        "ratingsCount": 10,
        "ratingsValue": 48,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "user": {
          "username": "john_doe",
          "image": "https://..."
        },
        "category": {
          "name": "Marketing"
        }
      }
    ]
  }
}
```

#### GET /posts/liked-posts
Get posts liked by the current user. **[Protected]** (Added: 2025-10-21)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Amazing Marketing Prompt",
      "prompt": "Create a compelling...",
      "image": "https://...",
      "price": 0,
      "model": "gpt-4",
      "likesCount": 42,
      "sharesCount": 15,
      "copiesCount": 28,
      "ratingsCount": 10,
      "ratingsValue": 48,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "user": {
        "username": "creator_name",
        "image": "https://..."
      },
      "category": {
        "name": "Marketing"
      },
      "likedAt": "2024-01-05T00:00:00.000Z"
    }
  ]
}
```

---

### Frontend Implementation Examples (Updated: 2025-10-21)

#### Example: Follow/Unfollow a User

```javascript
const FollowButton = ({ userId, initialFollowing = false }) => {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  const toggleFollow = async () => {
    setLoading(true);
    try {
      if (isFollowing) {
        // Unfollow
        await apiClient.delete(`/users/unfollow/${userId}`);
        setIsFollowing(false);
      } else {
        // Follow
        await apiClient.post(`/users/follow/${userId}`, {});
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={toggleFollow} disabled={loading}>
      {isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
};
```

#### Example: Display User Profile

```javascript
const UserProfile = ({ userId }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get current user ID from auth state
        const currentUserId = getCurrentUserId(); // Your auth function

        const response = await fetch(
          `http://localhost:3000/users/profile/${userId}?currentUserId=${currentUserId}`
        );
        const data = await response.json();
        setProfile(data.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="profile-card">
      <img src={profile.image} alt={profile.username} />
      <h2>{profile.username}</h2>
      <p>{profile.bio}</p>

      <div className="stats">
        <div>
          <strong>{profile.postsCount}</strong>
          <span>Posts</span>
        </div>
        <div>
          <strong>{profile.followersCount}</strong>
          <span>Followers</span>
        </div>
        <div>
          <strong>{profile.followingCount}</strong>
          <span>Following</span>
        </div>
      </div>

      <FollowButton userId={userId} initialFollowing={profile.isFollowing} />
    </div>
  );
};
```

#### Example: Display Liked Posts

```javascript
const LikedPosts = () => {
  const [likedPosts, setLikedPosts] = useState([]);

  useEffect(() => {
    const fetchLikedPosts = async () => {
      const response = await apiClient.get('/posts/liked-posts');
      setLikedPosts(response.data);
    };

    fetchLikedPosts();
  }, []);

  return (
    <div className="liked-posts">
      <h2>Posts You've Liked</h2>
      {likedPosts.map(post => (
        <PostCard
          key={post.id}
          post={post}
          likedAt={post.likedAt}
        />
      ))}
    </div>
  );
};
```

#### Example: Display Following/Followers Lists

```javascript
const FollowLists = () => {
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [activeTab, setActiveTab] = useState('followers');

  useEffect(() => {
    const fetchFollowData = async () => {
      const [followingRes, followersRes] = await Promise.all([
        apiClient.get('/users/following'),
        apiClient.get('/users/followers')
      ]);

      setFollowing(followingRes.data);
      setFollowers(followersRes.data);
    };

    fetchFollowData();
  }, []);

  return (
    <div>
      <div className="tabs">
        <button onClick={() => setActiveTab('followers')}>
          Followers ({followers.length})
        </button>
        <button onClick={() => setActiveTab('following')}>
          Following ({following.length})
        </button>
      </div>

      <div className="user-list">
        {(activeTab === 'followers' ? followers : following).map(user => (
          <div key={user.id} className="user-item">
            <img src={user.image} alt={user.username} />
            <div>
              <h4>{user.username}</h4>
              <p>{user.bio}</p>
              <small>{user.followersCount} followers</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

#### Example: Update User Profile

```javascript
const ProfileEditForm = () => {
  const [profile, setProfile] = useState({
    username: '',
    bio: '',
    image: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.put('/users/profile', {
        username: profile.username,
        bio: profile.bio,
        image: profile.image
      });

      alert('Profile updated successfully!');
      console.log(response.data);
    } catch (err) {
      if (err.response?.status === 409) {
        setError('Username already exists');
      } else {
        setError('Failed to update profile');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username</label>
        <input
          type="text"
          value={profile.username}
          onChange={(e) => setProfile({ ...profile, username: e.target.value })}
          maxLength={50}
        />
      </div>

      <div>
        <label>Profile Image URL</label>
        <input
          type="text"
          value={profile.image}
          onChange={(e) => setProfile({ ...profile, image: e.target.value })}
          maxLength={500}
        />
      </div>

      <div>
        <label>Bio</label>
        <textarea
          value={profile.bio}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          rows={4}
        />
      </div>

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Updating...' : 'Update Profile'}
      </button>
    </form>
  );
};
```

#### Example: Display Top Creators

```javascript
const TopCreators = () => {
  const [creators, setCreators] = useState([]);
  const [sortBy, setSortBy] = useState('posts');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTopCreators = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3000/users/top-creators?sortBy=${sortBy}`
        );
        const data = await response.json();
        setCreators(data.data);
      } catch (error) {
        console.error('Error fetching top creators:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopCreators();
  }, [sortBy]);

  return (
    <div className="top-creators">
      <h2>Top Creators</h2>

      <div className="sort-buttons">
        <button
          onClick={() => setSortBy('posts')}
          className={sortBy === 'posts' ? 'active' : ''}
        >
          Most Posts
        </button>
        <button
          onClick={() => setSortBy('followers')}
          className={sortBy === 'followers' ? 'active' : ''}
        >
          Most Followers
        </button>
        <button
          onClick={() => setSortBy('copies')}
          className={sortBy === 'copies' ? 'active' : ''}
        >
          Most Copies
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="creators-list">
          {creators.map((creator, index) => (
            <div key={creator.id} className="creator-card">
              <span className="rank">#{index + 1}</span>
              <img src={creator.image} alt={creator.username} />
              <h3>{creator.username}</h3>
              <p>{creator.bio}</p>
              <div className="stats">
                <span>{creator.postsCount} posts</span>
                <span>{creator.followersCount} followers</span>
                <span>{creator.totalCopies} copies</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

#### Example: View User Profile with Posts

```javascript
const UserProfileWithPosts = ({ userId }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileWithPosts = async () => {
      try {
        // The endpoint automatically uses JWT token if available
        const token = localStorage.getItem('token');

        const headers = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(
          `http://localhost:3000/users/${userId}/posts`,
          { headers }
        );
        const data = await response.json();
        setProfileData(data.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileWithPosts();
  }, [userId]);

  if (loading) return <div>Loading...</div>;

  const averageRating = (post) =>
    post.ratingsCount > 0
      ? (post.ratingsValue / post.ratingsCount).toFixed(1)
      : 0;

  return (
    <div className="profile-page">
      {/* Profile Header */}
      <div className="profile-header">
        <img src={profileData.image} alt={profileData.username} />
        <h1>{profileData.username}</h1>
        <p className="bio">{profileData.bio}</p>

        <div className="profile-stats">
          <div>
            <strong>{profileData.postsCount}</strong>
            <span>Posts</span>
          </div>
          <div>
            <strong>{profileData.followersCount}</strong>
            <span>Followers</span>
          </div>
          <div>
            <strong>{profileData.followingCount}</strong>
            <span>Following</span>
          </div>
        </div>

        {profileData.isFollowing !== undefined && (
          <FollowButton
            userId={userId}
            initialFollowing={profileData.isFollowing}
          />
        )}
      </div>

      {/* User's Posts */}
      <div className="user-posts">
        <h2>Posts by {profileData.username}</h2>
        <div className="posts-grid">
          {profileData.posts.map((post) => (
            <div key={post.id} className="post-card">
              <img src={post.image} alt={post.title} />
              <h3>{post.title}</h3>
              <p className="prompt-preview">{post.prompt.substring(0, 100)}...</p>
              <span className="category">{post.category.name}</span>

              <div className="post-stats">
                <span>❤️ {post.likesCount}</span>
                <span>📋 {post.copiesCount}</span>
                <span>⭐ {averageRating(post)}</span>
              </div>

              <small>
                {new Date(post.createdAt).toLocaleDateString()}
              </small>
            </div>
          ))}
        </div>

        {profileData.posts.length === 0 && (
          <p>This user hasn't posted any prompts yet.</p>
        )}
      </div>
    </div>
  );
};
```

---

## Summary of Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| **Posts** |
| POST | /posts | ✅ | Create post |
| GET | /posts | ❌ | Get all posts |
| GET | /posts/:id | ❌ | Get single post |
| GET | /posts/my-posts | ✅ | Get user's posts |
| GET | /posts/liked-posts | ✅ | Get user's liked posts |
| GET | /posts/category/:id | ❌ | Get posts by category |
| GET | /posts/prompts/:type | ❌ | Get featured/trending/thisWeek |
| **Likes** |
| POST | /likes | ✅ | Like a post |
| GET | /likes | ❌ | Get all likes |
| GET | /likes/post/:postId | ❌ | Get post's likes |
| GET | /likes/my-likes | ✅ | Get user's likes |
| GET | /likes/check/:postId | ✅ | Check if liked |
| DELETE | /likes/:postId | ✅ | Unlike post |
| **Copies** |
| POST | /copies | ✅ | Copy a post |
| GET | /copies | ❌ | Get all copies |
| GET | /copies/post/:postId | ❌ | Get post's copies |
| GET | /copies/my-copies | ✅ | Get user's copies |
| GET | /copies/check/:postId | ✅ | Check if copied |
| DELETE | /copies/:postId | ✅ | Remove copy |
| **Shares** |
| POST | /shares | ✅ | Share a post |
| GET | /shares | ❌ | Get all shares |
| GET | /shares/post/:postId | ❌ | Get post's shares |
| GET | /shares/my-shares | ✅ | Get user's shares |
| GET | /shares/check/:postId | ✅ | Check if shared |
| DELETE | /shares/:postId | ✅ | Remove share |
| **Ratings** |
| POST | /ratings | ✅ | Rate a post |
| GET | /ratings | ❌ | Get all ratings |
| GET | /ratings/post/:postId | ❌ | Get post's ratings |
| GET | /ratings/my-ratings | ✅ | Get user's ratings |
| GET | /ratings/check/:postId | ✅ | Check if rated |
| PATCH | /ratings/:postId | ✅ | Update rating |
| DELETE | /ratings/:postId | ✅ | Remove rating |
| **Categories** |
| GET | /categories | ❌ | Get all categories |
| **Users & Following** |
| POST | /users/follow/:userId | ✅ | Follow a user |
| DELETE | /users/unfollow/:userId | ✅ | Unfollow a user |
| GET | /users/following | ✅ | Get users you're following |
| GET | /users/followers | ✅ | Get your followers |
| GET | /users/check-following/:userId | ✅ | Check if following user |
| GET | /users/profile/:userId | ❌ | Get user profile |
| PUT | /users/profile | ✅ | Update current user's profile |
| GET | /users/top-creators | ❌ | Get top creators (by posts/followers/copies) |
| GET | /users/:userId/posts | ❌ | Get user profile with all posts |

---

This documentation should provide everything needed to integrate the frontend with the API. All endpoints have been implemented with proper counter updates and error handling.
