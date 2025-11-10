## Initial Setup

Sign up to Pexels https://www.pexels.com/api/, click 'Get Started' and create a new account. Generate an API key.

Create a .env.local file with the following:

```bash
NEXT_PUBLIC_PEXELS_API_URL=https://api.pexels.com/v1
PEXELS_API_KEY=your-api-key
```

## Run project

```bash
# Install dependencies
npm install
# Run project
npm run dev
```

Visit http://localhost:3000 to view the frontend.