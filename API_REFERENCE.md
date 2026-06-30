# About Me.LOL - Complete API Reference

## BASE URL
```
Production: https://about-me-api.railway.app
Development: http://localhost:3000
```

---

## AUTHENTICATION ENDPOINTS

### 1. Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "john_doe",
  "password": "SecurePass123!"
}

Response (201):
{
  "id": "uuid-here",
  "email": "user@example.com",
  "username": "john_doe",
  "token": "jwt_token_here",
  "refreshToken": "refresh_token_here"
}

Response (400):
{
  "error": "Username already taken"
}
```

### 2. Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response (200):
{
  "id": "uuid-here",
  "email": "user@example.com",
  "username": "john_doe",
  "token": "jwt_token_here",
  "refreshToken": "refresh_token_here"
}

Response (401):
{
  "error": "Invalid email or password"
}
```

### 3. Refresh Token
```
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh_token_here"
}

Response (200):
{
  "token": "new_jwt_token",
  "refreshToken": "new_refresh_token"
}
```

### 4. Logout
```
POST /api/auth/logout
Authorization: Bearer {token}

Response (200):
{
  "message": "Logged out successfully"
}
```

### 5. Verify Email
```
GET /api/auth/verify-email?code=verification_code

Response (200):
{
  "message": "Email verified successfully"
}

Response (400):
{
  "error": "Invalid or expired verification code"
}
```

### 6. Request Password Reset
```
POST /api/auth/reset-password-request
Content-Type: application/json

{
  "email": "user@example.com"
}

Response (200):
{
  "message": "Password reset email sent"
}
```

### 7. Reset Password
```
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_from_email",
  "newPassword": "NewSecurePass123!"
}

Response (200):
{
  "message": "Password reset successfully"
}
```

---

## USER ENDPOINTS

### 8. Get Current User
```
GET /api/users/me
Authorization: Bearer {token}

Response (200):
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "john_doe",
  "createdAt": "2024-01-15T10:00:00Z",
  "emailVerified": true
}
```

### 9. Get User by ID
```
GET /api/users/{userId}
Authorization: Bearer {token} (optional for public info)

Response (200):
{
  "id": "uuid",
  "username": "john_doe",
  "profile": { ... }
}
```

### 10. Update User Settings
```
PUT /api/users/{userId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "email": "newemail@example.com",
  "password": "NewPass123!"
}

Response (200):
{
  "message": "User updated successfully"
}
```

### 11. Delete Account
```
DELETE /api/users/{userId}
Authorization: Bearer {token}

Response (200):
{
  "message": "Account deleted successfully"
}
```

### 12. Check Username Availability
```
GET /api/users/check-username?username=john_doe

Response (200):
{
  "available": true
}

Response (200):
{
  "available": false
}
```

---

## PROFILE ENDPOINTS

### 13. Get Profile
```
GET /api/profiles/{profileId}

Response (200):
{
  "id": "uuid",
  "userId": "uuid",
  "bio": "I'm a creator",
  "avatarUrl": "https://aboutme-media.b-cdn.net/avatars/user123.jpg",
  "backgroundUrl": "https://aboutme-media.b-cdn.net/backgrounds/user123.gif",
  "themeColor": "#b670ff",
  "badgeTextGlow": true,
  "badgeAnimation": false,
  "links": [
    {
      "id": "uuid",
      "title": "Twitter",
      "url": "https://twitter.com/user",
      "iconType": "twitter",
      "position": 0
    }
  ],
  "cosmetics": [
    {
      "id": "uuid",
      "name": "Premium Glow",
      "type": "glow"
    }
  ]
}
```

### 14. Get Public Profile by Username
```
GET /api/profiles/@{username}

Response (200):
{
  "id": "uuid",
  "username": "john_doe",
  "bio": "Creator",
  "avatarUrl": "...",
  "backgroundUrl": "...",
  "links": [...]
}

Response (404):
{
  "error": "Profile not found"
}
```

### 15. Update Profile
```
PUT /api/profiles/{profileId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "bio": "New bio text",
  "themeColor": "#6cf6ff",
  "badgeTextGlow": true
}

Response (200):
{
  "message": "Profile updated successfully",
  "profile": { ... }
}
```

### 16. Upload Avatar
```
POST /api/profiles/{profileId}/avatar
Authorization: Bearer {token}
Content-Type: multipart/form-data

File: avatar.jpg (max 5MB)

Response (200):
{
  "url": "https://aboutme-media.b-cdn.net/avatars/user123.jpg"
}
```

### 17. Upload Background
```
POST /api/profiles/{profileId}/background
Authorization: Bearer {token}
Content-Type: multipart/form-data

File: background.gif (max 20MB)

Response (200):
{
  "url": "https://aboutme-media.b-cdn.net/backgrounds/user123.gif"
}
```

---

## LINK MANAGEMENT ENDPOINTS

### 18. Add Link to Profile
```
POST /api/profiles/{profileId}/links
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "My Twitter",
  "url": "https://twitter.com/user",
  "iconType": "twitter",
  "position": 0
}

Response (201):
{
  "id": "uuid",
  "profileId": "uuid",
  "title": "My Twitter",
  "url": "https://twitter.com/user",
  "iconType": "twitter",
  "position": 0
}
```

### 19. Update Link
```
PUT /api/profiles/{profileId}/links/{linkId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "url": "https://new-url.com",
  "position": 1
}

Response (200):
{
  "message": "Link updated successfully"
}
```

### 20. Delete Link
```
DELETE /api/profiles/{profileId}/links/{linkId}
Authorization: Bearer {token}

Response (200):
{
  "message": "Link deleted successfully"
}
```

### 21. Reorder Links
```
POST /api/profiles/{profileId}/links/reorder
Authorization: Bearer {token}
Content-Type: application/json

{
  "links": [
    { "id": "uuid1", "position": 0 },
    { "id": "uuid2", "position": 1 },
    { "id": "uuid3", "position": 2 }
  ]
}

Response (200):
{
  "message": "Links reordered successfully"
}
```

---

## ANALYTICS ENDPOINTS

### 22. Get Profile Analytics
```
GET /api/analytics/{profileId}?startDate=2024-01-01&endDate=2024-01-31

Response (200):
{
  "profileId": "uuid",
  "totalVisits": 1250,
  "totalClicks": 450,
  "avgVisitTime": 45,
  "topLinks": [
    {
      "linkId": "uuid",
      "title": "Twitter",
      "clicks": 320
    }
  ],
  "visitsPerDay": [
    { "date": "2024-01-01", "visits": 45, "clicks": 20 },
    { "date": "2024-01-02", "visits": 52, "clicks": 18 }
  ]
}
```

### 23. Track Profile Visit
```
POST /api/analytics/track-visit
Content-Type: application/json

{
  "profileId": "uuid",
  "visitorIp": "192.168.1.1"
}

Response (200):
{
  "message": "Visit tracked"
}
```

### 24. Track Link Click
```
POST /api/analytics/track-click
Content-Type: application/json

{
  "linkId": "uuid",
  "profileId": "uuid"
}

Response (200):
{
  "message": "Click tracked"
}
```

---

## COSMETICS ENDPOINTS

### 25. Get Cosmetics Shop
```
GET /api/cosmetics/shop

Response (200):
{
  "cosmetics": [
    {
      "id": "uuid",
      "name": "Premium Glow Badge",
      "type": "badge",
      "price": 2.99,
      "description": "Make your text glow",
      "previewUrl": "https://aboutme-media.b-cdn.net/cosmetics/glow-badge.png"
    },
    {
      "id": "uuid",
      "name": "Rainbow Animation",
      "type": "animation",
      "price": 4.99,
      "description": "Animated profile",
      "previewUrl": "https://..."
    }
  ]
}
```

### 26. Get User's Cosmetics
```
GET /api/cosmetics/user/{userId}
Authorization: Bearer {token}

Response (200):
{
  "cosmetics": [
    {
      "id": "uuid",
      "name": "Premium Glow Badge",
      "type": "badge",
      "purchasedAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### 27. Apply Cosmetic to Profile
```
POST /api/cosmetics/{cosmeticId}/apply
Authorization: Bearer {token}
Content-Type: application/json

{
  "profileId": "uuid"
}

Response (200):
{
  "message": "Cosmetic applied successfully"
}

Response (400):
{
  "error": "You don't own this cosmetic"
}
```

### 28. Remove Cosmetic from Profile
```
DELETE /api/cosmetics/{cosmeticId}/remove
Authorization: Bearer {token}
Content-Type: application/json

{
  "profileId": "uuid"
}

Response (200):
{
  "message": "Cosmetic removed successfully"
}
```

---

## PAYMENT ENDPOINTS

### 29. Create PayPal Order
```
POST /api/payments/create-order
Authorization: Bearer {token}
Content-Type: application/json

{
  "cosmeticId": "uuid"
}

Response (200):
{
  "orderId": "paypal-order-id",
  "approvalUrl": "https://sandbox.paypal.com/checkoutnow?token=EC-..."
}
```

### 30. Capture PayPal Payment
```
POST /api/payments/capture
Authorization: Bearer {token}
Content-Type: application/json

{
  "orderId": "paypal-order-id"
}

Response (200):
{
  "message": "Payment captured successfully",
  "cosmeticId": "uuid",
  "transactionId": "txn-123"
}
```

### 31. PayPal Webhook
```
POST /webhook/paypal
(No auth - PayPal calls this)

Receives: Payment completed event
Action: Grant cosmetic to user

Response (200):
{
  "message": "Webhook processed"
}
```

### 32. Get User Transactions
```
GET /api/payments/transactions/{userId}
Authorization: Bearer {token}

Response (200):
{
  "transactions": [
    {
      "id": "uuid",
      "cosmeticId": "uuid",
      "cosmeticName": "Premium Glow",
      "amount": 2.99,
      "status": "completed",
      "purchasedAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

---

## MEDIA ENDPOINTS

### 33. Delete Media File
```
DELETE /api/media/{mediaId}
Authorization: Bearer {token}

Response (200):
{
  "message": "Media deleted successfully"
}
```

### 34. Get Media Statistics
```
GET /api/media/stats/{mediaId}

Response (200):
{
  "mediaId": "uuid",
  "fileSize": 245600,
  "views": 1240,
  "downloads": 450,
  "bandwidth": "1.2 GB"
}
```

---

## LEADERBOARD ENDPOINTS

### 35. Get Leaderboard
```
GET /api/leaderboard?period=month&limit=100

Query Params:
- period: day, week, month, all
- limit: 1-500 (default 100)

Response (200):
{
  "leaderboard": [
    {
      "rank": 1,
      "username": "top_creator",
      "totalVisits": 50000,
      "totalClicks": 12000
    },
    {
      "rank": 2,
      "username": "creator_2",
      "totalVisits": 45000,
      "totalClicks": 10500
    }
  ]
}
```

---

## ERROR RESPONSES

All errors follow this format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": "Additional information"
}
```

### Common Error Codes
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (no permission)
- `404` - Not Found
- `409` - Conflict (username taken, etc)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

---

## RATE LIMITS

| Endpoint | Limit | Window |
|----------|-------|--------|
| /auth/register | 5 | 1 hour |
| /auth/login | 5 | 1 hour |
| /api/users/check-username | 30 | 1 minute |
| /analytics/track-visit | Unlimited | - |
| /payments/create-order | 10 | 1 hour |
| Other endpoints | 100 | 1 minute |

---

## AUTHENTICATION HEADERS

All endpoints marked with `Authorization: Bearer {token}` require:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

JWT includes:
- User ID
- Email
- Username
- Expiration (1 hour)

---

## EXAMPLE FRONTEND CALLS

### Login
```javascript
const response = await fetch('https://about-me-api.railway.app/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePass123!'
  })
});

const { token } = await response.json();
localStorage.setItem('token', token);
```

### Get Profile
```javascript
const response = await fetch('https://about-me-api.railway.app/api/profiles/@john_doe');
const profile = await response.json();
```

### Update Profile
```javascript
const response = await fetch('https://about-me-api.railway.app/api/profiles/uuid', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  body: JSON.stringify({
    bio: 'New bio',
    themeColor: '#6cf6ff'
  })
});
```

---

## WEBHOOK EVENTS

### PayPal Webhook
Fired when payment is completed:
```json
{
  "event_type": "CHECKOUT.ORDER.COMPLETED",
  "resource": {
    "id": "order-id",
    "status": "COMPLETED"
  }
}
```

### Custom Events (Future)
- user.profile.updated
- cosmetic.purchased
- profile.visited
- link.clicked

