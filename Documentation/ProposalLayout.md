![](/Documentation/images/atu1.jpg)

# B.Sc. (Honours) in Software Development Applied Project & Minor Dissertation

<h1 style="color: red;">Project Proposal</h1>

<span > <strong style="color: red;">1. Student Name:</strong><span style="border: 1px solid red; padding: 5px; margin-left:10px;">Ethan Conneely (G00393941) and Ryan Harte (G00338424)</span></span>

<span > <strong style="color: red;">2. Supervisor Name:</strong><span style="border: 1px solid red; padding: 5px; margin-left:10px;">Gemma O'Callaghan</span></span>

<span > <strong style="color: red;">3. Project Name:</strong><span style="border: 1px solid red; padding: 5px; margin-left:10px;">AI-Integrated Messenger Application - Chatalyst</span></span>


<h1 style="color: red;">4. Project Context:</h1>
<div style="border: 1px solid red; padding: 10px; margin-bottom: 20px;">

Instant communication and the multitude of applications that provide such a service are used by a vast majority of the world's populace each day. Since the invention of the telephone communication has been evolving and with this continuous evolution in technology, users are always seeking the next best ways in which they can communicate instantly with friends and family.

With Artificial Intelligence (AI) becoming more prominent in our lives, there is a rising demand by users to access smarter, more intuitive, and user-friendly communication platforms. The reason for this is users want an application that can aid in automating, assisting and that enhances their interactions through the use of an AI-powered applications.

As this is a group project, we aim to develop an instant messaging application (for both Desktop and Mobile Devices) that will have a strong focus on AI/Bot integration. The application will allow users to create an account, instant message/communicate, as well as send various multimedia files (images, gifs and many more) and interact and make use of the implemented bots and their various functions.

<h2 style="color: red;">4.1 Project Interests:</h2>
The development of this project is of interest to us as it combines an array of new technologies and frameworks as you will see below. Developing an application that users will admire, and using these widely recognized and employer-valued technologies, we feel is in our best interest as final year students.

<h2 style="color: red;">4.2 Project Description:</h2>
As mentioned previously we hope to develop and create an AI-Integrated messaging application that focuses on the following:

- **Intuitive User Interface:** Our aim is to fuse aesthetic appeal with functionality. By prioritizing UI/UX design, development of an interface that not only looks great but also feels intuitive is a high priority. With added features like theme customization, user profile customization and more it will give users more control over how the app looks and feels to them.

- **Personalized User Profiles:** We recognize individuality. Our platform empowers users to create their unique digital profile, encompassing everything from profile customization to friend interactions.

- **Instant Communication:** Beyond basic messaging, our platform will facilitate multimedia sharing, ensuring greater communication capabilities for all users.

- **AI-Powered Interactions:** We're elevating user experience by introducing AI-driven bots. Whether it's for quick auto-replies, catching up on the latest news, checking the weather, or even diving into the Pokémon universe. We want users to be able to access a vast array of information that is powered by AI that users can access easily.

- **Robust Backend Framework:** With optimized database operations and scalability in focus, we're ensuring a smooth experience for our users.

- **Responsive Feedback Mechanism:** Acknowledging the evolving nature of technology and accepting that problems arise even after development/deployment, we hope to embed a system for users to report bugs and provide feedback on the application. This ensures a continuous loop of improvement and getting user feedback.

- **Data Security:** User trust is the cornerstone of any applications success. The leaking of personal information is the ultimate killer. We're creating data privacy measures, from end-to-end encryption to multifaceted authentication, ensuring user data remains uncompromised.
</div>

<h1 style="color: red;">5. Project Objectives:</h1>

<div style="border: 1px solid red; padding: 10px; margin-bottom: 20px;">


- **Development of a User-Friendly Interface (UI)**
  - **Overview:** Create a UI that is user friendly and aesthetically pleasing.
  - **Components:**
    - UI/UX to design the interface before implementation.
    - Responsiveness so the application responds in real time.
    - Theme customization. Light and Dark mode.

- **User customization capabilities**

  - **Overview:** Users can create, customise their profiles.
  - **Components:**
    - Register an account.
    - Login/Logout.
    - Two Factor Authentication.
    - Profile customization, profile pictures etc...
    - Add/Remove Friends

- **Instant Messaging communication**

  - **Overview:** Users can create and send messages to people they are friends with.
  - **Components:**
    - Send and receive messages.
    - Send and receive multimedia in all forms.

- **Implement AI/Bots**

  - **Overview:** Implementation of AI/Bots to provide various services to users based on their capabilities.
  - **Components:**
    - Smart Reply Bot: Allows users to reply to messages through to use of a bots auto generated selection for quick and seamless replies.
    - News Bot: A bot that will give news to the user relevant to their location and interests.
    - Weather Bot: A bot that will tell users the weather at their location or a location of their choosing along with other relevant details.
    - Pokémon Bot: A funny Pokémon bot that will give a user relevant information on a Pokémon of their choosing. Will be a Pokédex bot essentially.

- **Scalable Backend Infrastructure**

  - **Overview:** To build a robust backend using (enter DB here) that can handle the initial users of the application and those that could join in the future.
  - **Components:**
    - Optimised Database Queries: Essential to have the DB queries correctly implemented to avoid timeouts or deadlock states.
    - Database Selection: Making sure we are using the correct Database for scalability and that suits our applications purpose.

- **Issue/Bug Reports**

  - **Overview:** Build a system that users can use to report issues/bugs in the application via a UI.
  - **Components:**
    - Ticketing System: An efficient system that tracks and prioritizes issues/bugs based on severity.
    - Feedback Interface: A UI interface for reporting issues/bugs.

- **Data Privacy/Security**
  - **Overview:** User details remain private through encryption.
  - **Components:** - End to End Encryption: Ensure user conversations and private details remain encrypted. - Implement 2 factor authentication to keep users' data secure. - Email verification on all account setups.
  </div>

<h1 style="color: red;">6. Technologies/System Architecture</h1>

<div style="border: 1px solid red; padding: 10px; margin-bottom: 20px;">


Our AI-integrated messaging application will be developed using the following technologies and system architecture. system architecture:

**Frontend:**

- **React vs Angular:** For frontend development, React has been chosen over Angular as it is a new technology that provides vast flexibility in development. With its many libraries and components that can be added over angular it means:

  - Users will be able to interact with our application more freely.
  - Development will be more flexible and React components offer far more reusability.
  - It is an Industry standard for the development of many desktop and mobile applications and is used by Facebook Instagram, WhatsApp, Airbnb, and more. As such it is an incredible framework to work with as it as is sought after industry wide.
  - **React:**
    - Promotes a component-based architecture, making it easy to reuse components.
    - More libraries, providing flexibility in choosing additional components and development tools.
    - Offers React Native for mobile app development.
    - Uses JavaScript and HTML syntax. Javascript is used predominantly in frontend development making it an invaluable language to improve knowledge on.
  - **Angular:**
    - Also uses a component-based architecture, but with a more structured and hierarchical approach due to its module system.
    - A comprehensive framework with built-in tools. A lack of libraries and flexibility make it less appealing for our project.
    - Has Ionic and NativeScript as popular options for mobile development, but the development experience differs to that for web development.
    - Uses Typescript which is a strict syntactical superset of JavaScript.

- **MUI (Material-UI):**
  - Material-UI (MUI) is a popular React UI framework that implements Google's Material Design. It provides a suite of components that allow for us to develop a consistent, interactive, and responsive user interface that will be appealing and seamless to use.

**Back-End:**

- **GoLang vs TypeScript:** In industry both languages are very popular for backend servers. The reason we decided to go with GoLang is that it is a language built on concurrency which is very important in a online application that is used by many people you will need to be able to handle hundreds of request in parallel and GoLang facilitates this. Typescript on the other hand is a much more dynamic language and does not have a very good concurrency model as compared to golang which was built on that idea, for this reason we went with GoLang. The main advantage of using GoLang is that the api types could be shared with both the frontend and backend due to using the same language. There are tools for golang that help facilitate this and we will be using one such thing that generates type safe definitions from the golang structs into interfaces for use when requesting the api from the frontend.
- **MongoDB vs MySQL:** MonogDB is a database that is best suited for storing documents/json formatted data it is useful for storing big sets of complexly structured data where as MySql is better at storing simpler relational data where the main use case of the data is performing operations and lookups on the data in a performants and secure way.

**AI – Integration**

- The integration of AI capabilities, powered by leading-edge machine learning algorithms, enhances user experience by offering features such as smart replies, news and weather information and others as mentioned above. This combination of technologies ensures our application is scalable, responsive, and user-friendly, catering to the modern needs of messaging platforms and our target user audience.
- 
</div>

<h1 style="color: red;">7. Schedule of Work</h1>

<div style="border: 1px solid red; padding: 10px; margin-bottom: 20px;">


Our project employs the Agile Methodology 'Scrum'.

We have planned out the work for each sprint we will be undertaking during the project it will be expanded as we work on it and encounter bugs in the application. We will be working in 2 week sprints.
At the end of each sprint we will do a sprint retrospective going over what we felt went well and what issues we encountered.

**JIRA**

- We have created a JIRA to organise our workload into 'sprints' and have created a Gantt Chart and Kanban board to keep our work organised and we can clearly see when project deadlines and goals are to be met this is just the initial layout of work as the requirements become more clear we will add more tasks to it.

![](/Documentation/images/jira1.png)
'_Jira -_ [https://ethanryanfinalyearproject.atlassian.net/jira/software/projects/KAN/boards/1/timeline?timeline=MONTHS](https://ethanryanfinalyearproject.atlassian.net/jira/software/projects/KAN/boards/1/timeline?timeline=MONTHS)
_Our work load Gantt Chart from now to December 2023'_

![](/Documentation/images/jira3.png)

## Sprint 1

In this sprint we will be doing project setup for both the backend and frontend this will give us a good foundation moving into the later sprints that will be more programming and feature implementation heavy. We will also be doing project and feature write ups in Jira.

## Sprint 2

In sprint 2 we will be working on a UI mock-up and the basic authentication with the server for users.
This sprint will outline what the UI style will be and some very basic skeleton layouts of the website.

## Sprint 3

This sprint is about getting the signup/signin UI design finalized with only tweaks and fixes remaining as well as starting on the message user interface and getting the backend messaging system working.

## Sprint 4

Sprint 4 is all about integrating with bots and external facing apis this will allow the messaging app to take advantage of extra information from other sources and can be shared with people in group chats.
This will require adding UI specific to the api endpoints and bot so we will need to modify the User interface to display the information.

## Sprint 5

The last sprint will be all about implementing a LLM AI (Large Language Model) that will be hosted remotely and be used for intelligent responses to reply to messages for you

## Sprint 6

Fix any outstanding bugs, polish the application functionality and finish the UI making sure everything is consistently styled.

</div>

![](/Documentation/images/atu2.png)
