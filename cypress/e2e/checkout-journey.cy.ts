describe('Checkout Journey', () => {
    const TEST_ORDER_ID = '507f1f77bcf86cd799439011';

    beforeEach(() => {
        cy.loginAsTestUser();

        // Block client-side load-more so the intersection observer can't pull
        // real Pexels photos in mid-test. Initial gallery is still SSR'd from real Pexels.
        cy.intercept('GET', '/api/pexels*', { statusCode: 200, body: { photos: [] } });

        cy.intercept('POST', '/api/order', {
            statusCode: 200,
            body: { success: true, orderId: TEST_ORDER_ID },
        }).as('createOrder');
    });

    it('completes the full checkout flow from gallery to success page', () => {
        cy.visit('/');
        // Wait for CartProvider's hydration effect; implies React has hydrated
        // and the add-to-cart handler is attached. Long timeout for cold-compile dev.
        cy.get('header[data-cart-hydrated="true"]', { timeout: 30000 }).should('exist');

        // force: true bypasses opacity-0 — the button is only visible on parent
        // :hover, which Cypress can't trigger reliably via synthetic events.
        cy.get('.gallery-card').first().find('button').first().click({ force: true });
        // Surface a lost click here rather than failing three steps later in /cart.
        cy.get('header').contains('1').should('be.visible');

        cy.get('a[href="/cart"]').click();
        cy.url().should('include', '/cart');

        cy.contains('a', 'Proceed to checkout').click();
        cy.url().should('include', '/checkout');

        cy.get('#firstName').type('Jane');
        cy.get('#lastName').type('Smith');
        cy.get('#email').type('jane@example.com');
        cy.get('#addressLine1').type('123 Test Street');
        cy.get('#city').type('London');
        cy.get('#postcode').type('SW1A 1AA');
        cy.contains('button', 'Continue to payment').click();
        cy.url().should('include', '/checkout/payment');

        // Card number and expiry auto-format client-side (spaces / MM/YY slash).
        cy.get('#cardholderName').type('Jane Smith');
        cy.get('#cardNumber').type('4242424242424242');
        cy.get('#expiryDate').type('1228');
        cy.get('#securityCode').type('123');
        cy.contains('button', 'Pay Now').click();

        cy.wait('@createOrder');
        cy.url().should('include', '/checkout/success');
        cy.contains(TEST_ORDER_ID).should('be.visible');
    });
});
