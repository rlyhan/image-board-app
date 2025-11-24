## Initial Setup

Sign up to Pexels https://www.pexels.com/api/, click 'Get Started' and create a new account. Generate an API key.

Sign up to Auth0, create a new application. Add the following under Settings:
- Allowed callback URLs: http://localhost:3000/auth/callback
- Allowed logout URLs: http://localhost:3000/
- Allowed web origins: http://localhost:3000

Create a .env.local file with the following:

```bash
PEXELS_API_KEY=your-api-key
APP_BASE_URL=http://localhost:3000
AUTH0_BASE_URL=http://localhost:3000
AUTH0_DOMAIN=https://your-tenant.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_SECRET=your-client-secret
MONGODB_URI=mongodb+srv://<adminuser>:<adminpassword>@imageboardapp.nonohtz.mongodb.net/?appName=ImageBoardApp
```

## Run project

```bash
# Install dependencies
npm install
# Run project
npm run dev
```

Visit http://localhost:3000 to view the frontend.