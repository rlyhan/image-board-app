describe('Checkout Journey', () => {
    const TEST_ORDER_ID = '507f1f77bcf86cd799439011';

    beforeEach(() => {
        // Stub the order API to avoid real DB writes and have a predictable order ID
        cy.intercept('POST', '/api/order', {
            statusCode: 200,
            body: { success: true, orderId: TEST_ORDER_ID },
        }).as('createOrder');
    });

    it('completes the full checkout flow from gallery to success page', () => {
        // 1. Visit homepage and add the first image to cart
        cy.visit('/');
        // The add-to-cart button is hidden until hover; force: true bypasses visibility
        cy.get('.group').first().find('button').first().click({ force: true });

        // 2. Click the nav cart icon to go to /cart
        cy.get('a[href="/cart"]').click();
        cy.url().should('include', '/cart');

        // 3. Click 'Checkout' to go to /checkout
        cy.contains('a', 'Checkout').click();
        cy.url().should('include', '/checkout');

        // 4. Fill in the customer details form
        cy.get('#firstName').type('Jane');
        cy.get('#lastName').type('Smith');
        cy.get('#email').type('jane@example.com');
        cy.get('#addressLine1').type('123 Test Street');
        cy.get('#city').type('London');
        cy.get('#postcode').type('SW1A 1AA');
        cy.contains('button', 'Continue to payment').click();
        cy.url().should('include', '/checkout/payment');

        // 5. Fill in the payment form
        cy.get('#cardholderName').type('Jane Smith');
        cy.get('#cardNumber').type('4242424242424242');
        cy.get('#expiryDate').type('1228');
        cy.get('#securityCode').type('123');
        cy.contains('button', 'Pay Now').click();

        // 6. Assert redirect to success page and order ID is visible
        cy.wait('@createOrder');
        cy.url().should('include', '/checkout/success');
        cy.contains(TEST_ORDER_ID).should('be.visible');
    });
});
