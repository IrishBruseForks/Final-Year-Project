<p align="center">
  <img height="350px" src="https://github.com/The-Mad-Ryanosaurus/Final-Year-Project/blob/main/src/Frontend/public/Logo.png?raw=true" />

  <h1 align="center">
    Chatalyst
  </h1>
  <lr>
</p>

<p align="center">
  <a href="https://github.com/IrishBruse">Ethan Conneely (G00393941)</a>  
  <br>
  <a href="https://github.com/The-Mad-Ryanosaurus">Ryan Harte (G00338424)</a>
  <br>
</p>

# Introduction

This is a final year project for ATU Galway where we undertook creating a AI powered chat service.
This service is usable on both desktop and mobile by going to https://chatalyst.ethanconneely.com/
and signing up with a google account.

### Requirements

To run this application you will need:
- Node 20+
- Npm
- GoLang 1.21+
- VSCode
- Air for golang hotreloading (Optional)
- Local install of a LLM / an openai key for using chatgpt

# Setup Instructions

Open project in vscode tasks will run automatically that will setup everything.

You will need node for it to `npm i`

and you will need air which will hot reload the backend server for development

or manual way

## Frontend

```shell
cd src/Frontend
npm install
npm run dev
```

## Backend

```shell
cd src/Backend

go run .
# or
air # optional hot reload for development
```

## LLM

Either a openai api key to utilize chatgpt or a local install of https://github.com/oobabooga/text-generation-webui
can be use below is the install guide for the local LLM a signup for openai can be found here https://platform.openai.com/signup

To run the LLM for intelligent smart replies you will need to install https://github.com/oobabooga/text-generation-webui  
The instructions are in the repo.

The model we are using for development is this one
https://huggingface.co/TheBloke/open-llama-3b-v2-wizard-evol-instuct-v2-196k-GGUF
but any open llama model would work fine the larger the better the resulting replies this one was chosen as it is able to run on my gpu which gives much faster results.

## Documentation/Research

- [Brainstorming](./Documentation/Brainstorming.md)
- [Project Proposal](./Documentation/Proposal/)
- [Wireframe](./Documentation/Wireframe.md)
