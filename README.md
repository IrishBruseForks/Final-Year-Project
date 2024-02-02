<p align="center">
  <img height="350px" src="https://github.com/The-Mad-Ryanosaurus/Final-Year-Project/blob/main/src/Frontend/public/Logo.png?raw=true" />

  <h1 align="center">
    Chatalyst
  </h1>
</p>

<p align="center">
  <a href="https://github.com/IrishBruse">Ethan Conneely (G00393941)</a>  
  <br>
  <a href="https://github.com/The-Mad-Ryanosaurus">Ryan Harte (G00338424)</a>
  <br>

# Setup Instructions

Open project in vscode tasks will run automatically that will setup everything.

You will need node for it to `npm i`

and you will need air which will hot reload the backend server for development

or manual way

### Requirements

To run this application you will need:
- Node 20+
- Npm
- GoLang 1.21+
- VSCode
- Air for golang hotreloading (Optional)

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
```

## LLM

To run the llm for inteligent smart replies you will need to install https://github.com/oobabooga/text-generation-webui  
The instructions are in the repo.

The model we are using for development is this one
https://huggingface.co/TheBloke/open-llama-3b-v2-wizard-evol-instuct-v2-196k-GGUF
but any open llama model would work fine this one was chosen as it is able to run on my gpu which gives much faster results.
This means when running the golang backend my cpu is freed up to run that.

## Documentation

### [Brainstorming](./Documentation/Brainstorming.md)

### [Project Proposal](./Documentation/Proposal/)
