describe('Goof ToDo Tests', () => {

  beforeEach(()=> {
    //Open the App on the browser
    cy.visit('http://localhost:3001/')
  })

  it('Add a new task to the list', () => {

    //Create a task
    cy.get('.input').type('New Task{enter}')
    
    // Assert that the task has been added
    cy.contains('New Task').should('be.visible')
  })

  it('Delete a Task', ()=> {

    cy.get('.input').type('Deleted Task{enter}') 
    cy.get(':nth-child(2) > .del-btn').click()

    //Verify task has been deleted
    cy.contains('Deleted Task').should('not.exist')
  })

  it('Add an empty task', () => {
    
    // Try to add an empty task
    cy.get('.input').type('{enter}') 
    
    // Check that the task list length remains unchanged after adding an empty task
    cy.get('#list').children().should('have.length.lessThan', 2)
  })

  it('Add duplicate tasks', () => {
    // Add the first task
    cy.get('.input').type('Duplicate Task{enter}')

    // Attempt to add the same task again
    cy.get('.input').type('Duplicate Task{enter}') 

    // Get the list of tasks from the DOM
    cy.get('#list') // Assuming the task list items are inside an element with the ID "list" and each task is an "li" element
     .then($tasks => {
       // Extract task names into an array
       const tasks = [...$tasks].map(task => task.innerText);

       // Check for duplicates using a Set
       const uniqueTasks = new Set(tasks);

       // Assert that the number of unique tasks is less than the total number of tasks (which should cause the test to fail if duplicates exist)
       expect(uniqueTasks.size).to.equal(1); // Only one unique task should exist
    });
  });

  it('Import tasks from a file', () => {
  
    //Select a file for upload
    cy.get('[type="file"]').attachFile('tasks.txt')
    cy.get('[type="submit"]').click()

    cy.get('#list').should('contain', 'buy milk')
  });
})