Cypress.Commands.add('loginAsTestUser', () => {
    cy.session(
        'auth0-synthetic-session',
        () => {
            cy.task('createAuth0Session').then((jwe) => {
                cy.setCookie('__session', jwe as string, {
                    domain: 'localhost',
                    path: '/',
                    httpOnly: true,
                    secure: false,
                    sameSite: 'lax',
                });
            });
        },
        { cacheAcrossSpecs: true }
    );
});
