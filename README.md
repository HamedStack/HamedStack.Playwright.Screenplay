![playwright](https://user-images.githubusercontent.com/8418700/220898294-ec067d4d-c65c-43ab-96d7-8fdf52d0a6a7.png)

[![Open Source Love](https://badges.frapsoft.com/os/mit/mit.svg?v=102)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/screen.play.write.svg)](https://badge.fury.io/js/screen.play.write)
[![Downloads](https://img.shields.io/npm/dm/screen.play.write.svg)](https://www.npmjs.com/package/screen.play.write)

## What is Screenplay Pattern?

The Screenplay Pattern is a user-centric approach to writing workflow-level automated acceptance tests. This helps automation testers to write test cases in terms of Business language.

## The Design

![the-screenplay-pattern](https://user-images.githubusercontent.com/8418700/221844273-163cbfa5-f964-413b-9055-08771e248200.png)

The Screenplay Pattern can be summarized in one line: 

```
Actors use Abilities to perform Interactions.
```

* Actors initiate Interactions.
* Abilities enable Actors to initiate Interactions.
* Interactions are procedures that exercise the behaviors under test.
    * Tasks execute procedures on the features under test.
    * Questions return state about the features under test.
    * Interactions may use Locators, Requests, and other Models.


**Actors:** Actors are the main entities in the Screenplay Pattern. They represent the different types of users who
interact with the system. Each actor is responsible for performing specific tasks and interacting with the
system in a specific way. For example, an actor could represent a regular user, an administrator, or a
customer support representative.

**Interactions:** Interactions are the actions that an actor performs on the system. They represent the different
ways that an actor can interact with the system, such as clicking a button, entering data into a form, or
navigating to a specific page.

**Questions:** Questions are used to retrieve information from the system. They represent the different types of
information that an actor might need to retrieve during the course of their interactions with the system. For
example, a question could be used to retrieve the text of an error message or the value of a specific field in a
form.

**Tasks:** Tasks are the main building blocks of the Screenplay Pattern. They represent the different activities that
an actor performs in order to achieve a specific goal. A task can consist of one or more interactions and
questions, and can be used to model complex workflows and user journeys.

**Abilities:** Abilities represent the different capabilities that an actor has. They include things like the ability to
interact with the system using a specific user interface, the ability to read and write data to a database, and
the ability to send and receive messages over a network.

| Concepts       | Differences       |
|----------------|----------------|
| Tasks vs. Interactions | The primary difference between tasks and interactions is their granularity. Tasks represent high-level actions that an actor performs, while interactions represent the individual steps or actions that make up a task. For example, a task might be "Login to the system", while the interactions that make up that task might include entering a username, entering a password, and clicking the "Login" button. |
| Abilities vs. Interactions | While both abilities and interactions represent actions that an actor can perform, they serve different purposes. Abilities represent the skills or capabilities that an actor possesses, while interactions represent the specific actions that an actor performs in order to complete a task. Abilities are typically called inside interactions, as they represent a specific skill or capability that an actor possesses. Interactions are actions that the actor performs using their abilities. |
| Tasks vs. Questions | Tasks and questions are closely related, but they serve different purposes. Tasks represent the actions that an actor performs, while questions represent the verifications that the actor performs after completing those actions. In other words, tasks are about doing, while questions are about verifying. |
| Actors vs. Abilites | Actors and abilities are also closely related, but they serve different purposes. Actors represent the users or personas who interact with the system being tested, while abilities represent the skills or capabilities that those actors possess. In other words, actors are the "who" of the system being tested, while abilities are the "what". |

## The Principles

The Screenplay Pattern adheres to **SOLID** design principles:

| SOLID Principle                 | Explanation    |
|---------------------------------|----------------|
| Single-Responsibility Principle | Actors, Abilities, and Interactions are treated as separate concerns. |
| Open-Closed Principle           | Each new Interaction must be a new class, rather than a modification of an existing class. |
| Liskov Substitution Principle   | Actors can call all Abilities and Interactions the same way. |
| Interface Segregation Principle | Actors, Abilities, and Interactions each have distinct, separate interfaces. |
| Dependency Inversion Principle  | Interactions use Abilities via dependency injection from the Actor. |


## Example

Here's an example scenario for adding a new item to a todo list:

![image](https://user-images.githubusercontent.com/8418700/221852171-59d0f5f3-6d9e-4af4-86d1-017a17de69cf.png)

* A user navigates to the to-do list page. (An interaction like VisitPage)
* A user sees the "Add Item" button (+) and clicks it. (An interaction like ClickOnAddButton)
* A user enters the title (My todo) of the new item into the input field and presses enter from the keyboard. (An interaction like AddTodoItem)
* A user sees the last item on the to-do list which is the newly added one. (A question like GetLastTodoItem)

```typescript
// Ability
// Abilities to work with Playwright: UsePlaywrightPage, UsePlaywrightBrowser, or UsePlaywrightBrowserContext.
// Defined inside library but you can define what you want.

/*
// For example:
export class UseSqlDatabase extends Ability<DbConnection> {
    constructor(private connectionString: string) {
        super();
    }
    can(): DbConnection {
        return new SqlDatabase(connectionString);
    }
}
*/

// Interactions
export class VisitPage extends Interaction {
  async attemptAs(actor: Actor): Promise<void> {
    let page = await actor.useAbility(UsePlaywrightPage); // Use an abilitiy to interact with what you want.
    await page.goto("http://...");
  }
}
export class ClickOnAddButton extends Interaction {
  async attemptAs(actor: Actor): Promise<void> {
    let page = await actor.useAbility(UsePlaywrightPage);
    await page.locator("i.fa-plus").click();
  }
}

export class AddTodoItem extends Interaction {
  async attemptAs(actor: Actor) {
    let page = await actor.useAbility(UsePlaywrightPage);
    await page.getByTestId('value').type('My first todo');
    await page.keyboard.press('Enter');
  }
}

// Task
// Executing all interactions in order. (less control)
export class AddTodoTask extends Task {
  constructor() {
    super([new VisitPage(), new ClickOnAddButton(), new AddTodoItem()]);
  }
  public async performAs(actor: Actor): Promise<void> {
    await this.attemptInteractionsAs(actor);
  }
}

// Executing all interactions based on QA/Developer idea. (more control)
export class AddTodo extends Task {
  constructor() {
    super([new VisitPage(), new ClickOnAddButton(), new AddTodoItem()]);
  }    
  public async performAs(actor: Actor): Promise<void> {
    await this.attemptInteractionAs(actor, VisitPage); // You can get a return value and assert on it if you want.
    await this.attemptInteractionAs(actor, ClickOnAddButton);
    await this.attemptInteractionAs(actor, AddTodoItem);
  }
}

// Question
export class GetLastTodoItem extends Question {
  // Always returns a value to write assertions based on it.
  async askAs(actor: Actor): Promise<string> {
    let page = await actor.useAbility(UsePlaywrightPage);
    return await page.getByTestId('todo').last().innerText();
  }
}

// Test
test('add a new item to todo list', async ({ page }) => {
  const pw = new UsePlaywrightPage(page);
  // const sqlDb = new UseSqlDatabase("...");

  // Pass abilities to the ctor
  let user = new Actor([pw /*, sqlDb*/]); // Our user

  await user.performs(new AddTodoTask()); // Executes a task, an interaction, an interactions, or a tasks.
  // await user.performs(new AddTodo());

  // Question & Assertion separately.
  let theAnswer = await user.asksAbout(new GetLastTodoItem()) as string; // What is the value of last todo item? (system state)
  expect(theAnswer).toBe("My first todo"); // Making sure about the answer/state.
  
  // Question & Assertion together.
  await user.asserts(new GetLastTodoItem(), (answer: string) => {
    expect(answer).toBe("My first todo");
  });
});
```

## [NPM](https://www.npmjs.com/package/screen.play.write)

You install it via:

```
npm i screen.play.write
```

## References

1. https://serenity-js.org/handbook/design/screenplay-pattern.html
2. https://q2ebanking.github.io/boa-constrictor/getting-started/screenplay/

