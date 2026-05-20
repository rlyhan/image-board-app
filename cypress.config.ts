/* eslint-disable @typescript-eslint/no-require-imports */

import { defineConfig } from 'cypress';

require('dotenv').config({
    path: '.env.local',
});

export default defineConfig({
    e2e: {
        baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:3000',
        chromeWebSecurity: false,
        setupNodeEvents(on, config) {
            // Load .env.local so AUTH0_SECRET is available when Cypress runs outside Next.js.
            // Uses config.projectRoot (safe in all Cypress compilation modes) instead of __dirname.
            try {
                const fs = require('fs');
                const path = require('path');
                const envPath = path.join(config.projectRoot, '.env.local');
                if (fs.existsSync(envPath)) {
                    for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
                        const match = line.match(/^([^#=]+)=(.*)$/);
                        if (match) process.env[match[1].trim()] ??= match[2].trim();
                    }
                }
            } catch { }

            on('task', {
                async createAuth0Session() {
                    const { generateSessionCookie } = require('@auth0/nextjs-auth0/testing');

                    const secret = process.env.AUTH0_SECRET;
                    if (!secret) throw new Error('AUTH0_SECRET is not set');

                    return generateSessionCookie(
                        {
                            user: {
                                sub: `auth0|e2e-${Date.now()}`,
                                email: 'cypress@test.local',
                                email_verified: true,
                                name: 'Cypress Test',
                                nickname: 'cypress-test',
                                picture: '',
                            },
                        },
                        { secret }
                    );
                },
            });
        },
    },
});
