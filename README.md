# Glee-O-Meter

[Glee-o-meter](https://glee-o-meter.appspot.com){:target="_blank"} is a simple Angular 7 application focused on the interaction with a Spring REST server.

The data-centric application offers a basic user-management section, with the possibility to sign-in new users.
Each user can manage a list of glee-levels, each one associated to a date, time and a comment.
There are three different roles:
* Admin: has full permissions on the whole data
* User manager: has permissions on user data
* User: has full permissions on owned glee data.

The application has the following features:
* data access with pagination, sorting, ordering and filtering;
* CRUD operations on whole data;
* sign-in to permit the registration of new users;
* authentication based on oauth2 JWT, with token refresh;
* consumes REST resources `/api/glee`, `/api/users` and `/api/signin`

The server side is implemented with Spring boot, slightly customized to run on [Google App Engine](https://cloud.google.com/appengine/){:target="_blank"}.
Server implementation features the following:
* oauth2 JWT authentication with spring-boot, using grant types `password` and `refresh token`;
* publish 2 authenticated REST resources `/api/glee`, `/api/users` and one public `/api/signin` for user registration;
* method-level authorization based on `@PreAuthorize` and `@PostAuthorize`;
* data access based on logged user's permissions;
* Spring based JSR-349 data validation;
* CORS configuration for running separated local server and client development environments;


A [running version](https://glee-o-meter.appspot.com){:target="_blank"} is deployed on Google App-Engine cloud.

Available users are:

|User email|Password|Role|
|----------|--------|----|
|admin@admin.com|pwd|Admin|
|userman@userman.com|pwd|User manager|
|user1@user1.com|pwd|User|
|user2@user2.com|pwd|User|
|...|


This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.0.6.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
