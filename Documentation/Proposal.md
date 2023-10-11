# Project Proposal

B.Sc. (Honours) in Software Development Applied Project & Minor Dissertation

**Student Name:** Ethan Conneely (G00393941) and Ryan Harte (G00338424)

**Supervisor Name:** Gemma O'Callaghan

**Project Name:** AI-Integrated Messenger Application - Chatalyst

# Project Context:

Instant communication and the multitude of applications that provide such a service are used by a vast majority of the world's populace each day. Since the invention of the telephone communication has been evolving and with this continuous evolution in technology, users are always seeking the next best ways in which they can communicate instantly with friends and family.

With Artificial Intelligence (AI) becoming more prominent in our lives, there is a rising demand by users to access smarter, more intuitive, and user-friendly communication platforms. The reason for this is users want an application that can aid in automating, assisting and that enhances their interactions through the use of an AI-powered application.

As this is a group project, we aim to develop an instant messaging application (for both Desktop and Mobile Devices) that will have a strong focus on AI/Bot integration. The application will allow users to create an account, instant message/communicate, as well as send various multimedia files (images, gifs and many more) and interact and make use of the implemented bots and their various functions.

# Project Objectives:

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
    - Send and receive multimedia.
    - 

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
  - **Components:**
    - End to End Encryption: Ensure user conversations and private details remain encrypted.
    - Implement 2 factor authentication to keep users' data secure.
    - Email verification on all account setups.

# Technologies/System Architecture

Our AI-integrated messaging application will be developed using the following technologies and system architecture. system architecture:

**Frontend:**

- **React vs Angular:** For frontend development, React has been chosen over Angular as it is a new technology that provides vast flexibility in development with its many libraries and components that are easy for development reusability.
  - **React:** 
  - Promotes a component-based architecture, making it easy to reuse components.
  -  More libraries, providing flexibility in choosing additional components and development tools.
  -  Offers React Native for mobile app development 
  - **Angular:** 
  - Also uses a component-based architecture, but with a more structured and hierarchical approach due to its module system.

- **MUI (Material-UI):** React components that adhere to Material Design principles, facilitating a consistent and "user friendly" user interface.

**Back-End:**
- **GoLang vs TypeScript:** In industry both languages are very popular for backend servers. The reason we decided to go with GoLang is that it is a language built on concurrency which is very important in a online application that is used by many people you will need to be able to handle hundreds of request in parallel and GoLang facilitates this. Typescript on the other hand is a much more dynamic language and does not have a very good concurrency model as compared to golang  which was built on that idea, for this reason we went with GoLang. The main advantage of using GoLang is that the api types could be shared with both the frontend and backend due to using the same language. There are tools for golang that help facilitate this and we will be using one such thing that generates type safe definitions from the golang structs into interfaces for use when requesting the api from the frontend.
- **MongoDB vs MySQL:** MonogDB is a database that is best suited for storing documents/json formatted data it is useful for storing big sets of complexly structured data where as MySql is better at storing simpler relational data where the main use case of the data is performing operations and lookups on the data in a performants and secure way.

**AI – Integration**

- The integration of AI capabilities, powered by leading-edge machine learning algorithms, enhances user experience by offering features such as smart replies, news and weather information and others as mentioned above. This combination of technologies ensures our application is scalable, responsive, and user-friendly, catering to the modern needs of messaging platforms and our target user audience.

# Schedule of work:

Our project employs the Agile Methodology 'Scrum'.

We have planned out the work for each sprint we will be undertaking during the project it will be expanded as we work on it and encounter bugs in the application. We will be working in 2 week sprints.
At the end of each sprint we will do a sprint retrospective going over what we felt went well and what issues we encountered.

**JIRA**

- We have created a JIRA to organise our workload into 'sprints' and have created a Gantt Chart and Kanban board to keep our work organised and we can clearly see when project deadlines and goals are to be met this is just the initial layout of work as the requirements become more clear we will add more tasks to it.

![](/Documentation/images/jira1.png)
'_Jira -_ [https://ethanryanfinalyearproject.atlassian.net/jira/software/projects/KAN/boards/1/timeline?timeline=MONTHS](https://ethanryanfinalyearproject.atlassian.net/jira/software/projects/KAN/boards/1/timeline?timeline=MONTHS)
 _Our work load Gantt Chart from now to December 2023'_


## Sprint 1

In this sprint we will be doing project setup for both the backend and frontend this will give us a good foundation moving into the later sprints that will be more programming and feature implememtation heavy. We will also be doing project and feature write ups in Jira.

ejorptaef gniod eb osla lliw eW ot deenyleennoC llliw eW .ot desopa sa yevaehg noitantmemelpminemerlopmi erutaef dna gnimmargorpeisucof erom ebebem lliw taht stnntirps retal eht otni gnivniom noitadnuof doog a su a evig su tel lliwiwi siht dne tnorf dna dnekcab eht ehtob eht 

ejorptaef gniod eb osla lliw eW ot deenyleennoC llliw eW .ot desopa sa yevaehg noitantmemelpminemerlopmi erutaef dna gnimmargorpeisucof erom ebebem lliw taht stnntirps retal eht otni gnivniom noitadnuof doog a su a evig su tel lliwiwi siht dne tnorf dna dnekcab eht ehtob eht 

ejorptaef gniod eb osla lliw eW ot deenyleennoC llliw eW .ot desopa sa yevaehg noitantmemelpminemerlopmi erutaef dna gnimmargorpeisucof erom ebebem lliw taht stnntirps retal eht otni gnivniom noitadnuof doog a su a evig su tel lliwiwi siht dne tnorf dna dnekcab eht ehtob eht 

