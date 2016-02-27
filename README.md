# cthulhu-generator-application

Application for generating characters for Roleplaying game Call of Cthulhu.

## Running development environment

The application is built with TypeScript and heavily uses ES6 features of JavaScript with the additional typing. Building and compilation is done with Gulp and the application is run on top of Node.js.

### Stack

* Mongo
* Node.js
* Polymer

#### Technologies

* LESS compiled to CSS
* Jade compiled to HTML5
* TypeScript compiled to JavaScript
* TS compiles to ES6 compatible JavaScript
* Babel compiles ES6 JS to ES5 compatible JS
* Docker for running services locally (mongo for example)

### Infra and deployment

Even when it says development, these are required for development. Otto is heavily used to build effective development environment.

* Install https://www.ottoproject.io/docs/concepts/compile.html
* Install https://www.virtualbox.org/wiki/Downloads
* Run `nanobox dev` in project directory
* Start programming like MAD and the changes are automatically synced to environment
* To compile everything I suggest you make your life a lot easier inside the nanobox with `npm i -g gulp`
* Run `gulp` to compile the project

### Docker instructions

You can run the services the application depends on, like Mongo in a container locally if you are not feeling like installing all the stuff on your local system.

TODO: write instructions.

### Suggested editors / plugins

These are something I've found really useful for general development work and I personally enjoy them.

* Install https://atom.io/
* Install TypeScript plugin for Atom: https://atom.io/packages/atom-typescript
* Install LESS plugin for Atom: https://atom.io/packages/atom-less
* Install Jade plugin for Atom: https://atom.io/packages/atom-jade
