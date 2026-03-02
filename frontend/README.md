# Project Architecture

The backend is structured as a standard MVC REST API using Node.js, Express, and Typescript. 

1. **Authentication**: Uses JWT (JSON Web Tokens). The `auth` middleware intercepts requests, validates the 'Authorization: Bearer <token>' header, and attaches the user ID to the request object. It handles standard login/register flows with password hashing via bcrypt.

2. **Database**: Prisma ORM with PostgreSQL is used. The schema includes models for Users, Questions, Votes, Comments, Likes, and Follows. 
   - `Vote` uses a unique composite constraint `[userId, questionId]` to ensure one vote per user per poll.
   - `Like` is polymorphic-ish (nullable keys) but simplified here to have separate relations or nullable fields for questions/comments.
   - `Follow` is a self-referencing many-to-many relationship on the User model.

3. **API Client**: The frontend client files are generated to be drop-in replacements for the mocked logic. `base.ts` handles the global configuration (Authorization headers). Service files (`authService`, `pollService`) encapsulate endpoint logic.

4. **Scalability**: 
   - The feed endpoint (`getFeed`) currently returns a simple list sorted by date. In a production environment, this would need pagination (cursor-based) and potentially a Redis cache layer.
   - Vote counts are aggregated at query time. For high-scale, these should be denormalized (counter columns on the Question table) updated via transactions or triggers.