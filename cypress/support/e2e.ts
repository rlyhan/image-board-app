import './commands';

declare global {
    namespace Cypress {
        interface Chainable {
            loginAsTestUser(): Chainable<void>;
        }
    }
}
