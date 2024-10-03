describe('TodoMVC Tasks Test Cases', () => {
  
   it('Add Task', () => {
    // Create a new task using custom command
    cy.createTask('Task 1')

    // Assert that the task has been added
    cy.contains('Task 1').should('be.visible')
  })

  it('Edit a task', () => {
    // Create a task
    cy.createTask('Task to Edit')

    // Double-click to edit the task
    cy.contains('Task to Edit').dblclick()

    // Clear the text and type the updated value
    cy.get('.editing .edit').clear().type('Updated Task{enter}')

    // Assert the task was updated
    cy.contains('Updated Task').should('be.visible')
    cy.contains('Task to Edit').should('not.exist')
  })

  it('Delete a task', () => {
    // Create a task
    cy.createTask('Task to Delete')

    // Delete the task using a custom command
    cy.deleteTask('Task to Delete')

    // Assert the task is removed
    cy.contains('Task to Delete').should('not.exist')
  })

  it('Mark task as completed', () => {
    // Create a task
    cy.createTask('Task to Complete')

    // Mark the task as completed by finding the specific task and toggling it
    cy.contains('Task to Complete').parent().find('[data-testid="todo-item-toggle"]').click()

    // Assert that the task item has the "completed" class (line-through style)
    cy.contains('Task to Complete').parents('li').should('have.class', 'completed')
    
  })

  it('Clear completed tasks', () => {
    // Create multiple tasks
    cy.createTask('Task 1')
    cy.createTask('Task 2')
    cy.createTask('Task 3')

    // Mark tasks as completed
    cy.contains('Task 1').parent().find('[data-testid="todo-item-toggle"]').click()
    cy.contains('Task 3').parent().find('[data-testid="todo-item-toggle"]').click()

    // Clear completed tasks
    cy.contains('Clear completed').click()

    // Assert that completed tasks are removed
    cy.contains('Task 1').should('not.exist')
    cy.contains('Task 3').should('not.exist')
    
    // Assert that incomplete tasks remain
    cy.contains('Task 2').should('be.visible')
  })

  it('Filter by Active tasks', () => {
    // Create tasks
    cy.createTask('Task A')
    cy.createTask('Task B')

    // Mark Task A as completed
    cy.contains('Task A').parent().find('[data-testid="todo-item-toggle"]').click()

    // Filter by active tasks
    cy.contains('Active').click()

    // Assert that only active tasks are shown
    cy.contains('Task A').should('not.exist')
    cy.contains('Task B').should('be.visible')
  })

  it('Filter by Completed tasks', () => {
    // Create tasks
    cy.createTask('Task X')
    cy.createTask('Task Y')

    // Mark Task X as completed
    cy.contains('Task X').parent().find('[data-testid="todo-item-toggle"]').click()

    // Filter by completed tasks
    cy.contains('Completed').click()

    // Assert that only completed tasks are shown
    cy.contains('Task X').should('be.visible')
    cy.contains('Task Y').should('not.exist')
  })
})
