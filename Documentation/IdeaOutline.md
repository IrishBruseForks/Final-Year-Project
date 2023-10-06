## React instant messaging inspired by Discord/WhatsApp

We discussed making a chat application based on WhatsApp and Discord. It would be capable of running commands by a bot. This would give it a lot more functionality (eg. gif embedding, weather, news, AI, games, Pokemon Api and more).

Below is a Tiered description of the application that will in basic terms walk you through the application from the Users perspective/User interactions to how it will be designed and implemented.

### Tier 1 -- Presentation Layer

- **User Interface (UI):** This includes the React components responsible for rendering the messaging interface, including message bubbles, chat rooms, user profiles, and any embedded content from external APIs.
- **User Input Handling:** Implement components for typing and sending messages, as well as handling various types of content such as text, links, images, and gifs. Provide features like message commands, autocomplete for commands, and error handling for user input.
- **UI Style Guide:** Material UI (MUI) will be used for the Design and Presentation of the Application. It is backed by Google (Recognised in Industry as a standard). We will be using it to standardise the style of our application.

### Tier 2 -- Model/Application Layer

- **Business Logic:** This layer handles the core functionality of the messaging application. It includes logic for sending and receiving messages, managing user sessions, storing messages when users are offline, and processing user commands. You'll need to create functions and classes for message handling, user authentication, and interaction with external APIs for additional features.
- **State Management:** Implement state management using Reacts state or state management libraries. Manage user sessions, chat history, and real-time updates to the chat interface.
- **Authentication and Security:** Implement user authentication and ensure secure communication between clients and the server. Protect user data, such as passwords and personal information, and handle authorization for various actions within the chat application.

### Tier 3 -- Data Access Layer

- **Database Interaction:** Golang backend server to manage user accounts, store chat history, and handle authentication.
- **Distributed Bot Management:** Micro service architecture for the bots, each bot would run in it's own container in the cloud.
- **Database Storage Technologies:**
  - **DynamoDB:** (NoSQL) DynamoDB is being discussed to be used as it is an industry standard and a new technology.
  - **MySQL:** MySQL is also being discussed to be used as it is also vastly used and recognised in industry.
  - **MongoDB:** Document based database good choice for large amounts of text based data


### User Interactions and functionality

Below are descriptions and bulletpoints that we hope an end user will be able to run/execute in the application upon completion/deployment of our project.

- **User Account:**
  - Create an account.
  - Login/Logout.
  - Customize profile: Username, change password, profile picture.
  - Delete account.

- **User Interactions:**
  - Can add and remove friends via username.
  - Can send images and gifs.
  - Read receipts.
  - Can private messages friends or create a group chat.
  - Can run commands in group chats.


### Application Framework - Frontend and Backend Design

Below is discussed the Frameworks, external storage devices and API's that will be used in the development of our project.

- **Frontend:**
  - **React:** Used as it is a new framework (compared to having used Ionic in the past) and is used by many companies in industry.
  - **M.U.I:** (Googles Material UI library and style guide). A cutting-edge library with a sleek and highly professional aesthetic, elevating the application's style without compromising user-friendliness.

- **Backend:**
  - **MongoDB Database:** For storing messages and read receipts as well as any links and data from bots.
  - **Bots:** Bot are ways of extending the application with extra functionality.
  - **API:** Bots can have access to external apis such as:
    -  Weather Api
    -  News Api
    -  Memes/Gif Api
    -  Pokémon Api


***Scope and design of project as discussed above may and will most likely change in the design phase as the Scope of the project becomes more apparent***
