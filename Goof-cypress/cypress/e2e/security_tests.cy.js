describe('Security tests', () => {
    it('NoSQL Injection Test', () => {
      // Create a payload with NoSQL injection
      const payload = {
        username: "admin@snyk.io",
        password: { "$gt": "" } // NoSQL injection attempt
      }
  
      // Send a POST request to login with the malicious payload
      cy.request({
        method: 'POST',
        url: 'http://localhost:3001/login',
        headers: {
          'Content-Type': 'application/json' // Set the content type to JSON
        },
        body: payload,
        failOnStatusCode: false // Allow test to continue on failure
      }).then((response) => {
        // Assert that the response status should not be 200, ensuring that login fails
        expect(response.status).to.not.equal(200)
      })
    })

    it('Open Redirect Test', () => {
        
        cy.request({
          method: 'POST', 
          url: 'http://localhost:3001/login', 
          form: true, 
          body: {
            username: 'admin@snyk.io', 
            password: 'SuperSecretPassword', 
            redirectPage: 'https://google.com' // The redirect attempt
          },
          followRedirect: false // Prevent following the redirect
        }).then((response) => {
          // Assert that the app does not redirect to Google
          expect(response.redirectedToUrl).to.not.include('https://google.com') // Ensure redirection is not to google.com
        })
    })
    
    it('XSS Vulnerability Test', () => {
        // Listen for any alerts triggered by the page
        let alertTriggered = false
        cy.on('window:alert', (str) => {
          alertTriggered = true // Set a flag if the alert is triggered
        })
    
        // Visit the page with the XSS payload in the redirectPage parameter
        cy.visit('http://localhost:3001/login?redirectPage="><script>alert(1)</script>')
    
        // Assert that no alert was triggered
        cy.then(() => {
          expect(alertTriggered).to.be.false // Fail the test if the alert was triggered
        })
    })
    
    it('HTTPS Enforcement Test', () => {
        // Make a request to the HTTP version of the site
        cy.request({
          url: 'http://localhost:3001', // Start with HTTP
          followRedirect: false // Prevent Cypress from automatically following the redirect
        }).then((response) => {
          // Check that the server responds with a redirect (status 301 or 302)
          expect(response.status).to.be.oneOf([301, 302])   
        })
    })
  })
  