# AngularFirebaseApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.7.

It is a port of the [Angular 6 and Firebase](https://www.udemy.com/angular-firebase-application) Udemy course to Angular 6, RxJS 6.0 and AngularFire2 5.0. I have little experience with either library and do not claim that this is the best way to port the code.

## Angular notes

There is only one thing in this project specific to Angular 6. The services are now provided in the @Injectable annotation rather than in app.module. This is the recommended approach and the way the Angular CLI generates services. If you are using an older version of Angular this is easily fixed.

Also, HttpModule is deprecated so I have used the HttpClientModule instead.

## RxJS notes

This uses the RxJS 6.0 API without rxjs-compat. There are differences in the imports and API (particularly chaining of transforms) and this code will not work with older version of RxJS. Note that none of the subscriptions are ever cleaned up in the code. Since Firebase is a real-time database, the subscriptions are persistent and do not complete with the receipt of the first value. In a real application, all subscriptions should be saved as instance variables and unsubscribed in ngOnDestroy().

## AngularFire notes

This uses AngularFire2 5.0. There are very significant differences in the API compared to previous versions. Query parameters are handled differently and, most significantly, list() and object() do not return objects with their keys. Instead you must use valueChanges() to get the values and snapshotChanges() to get the values with their keys, but snapshotChanges() does not return a recognizable object. I have created a ServiceUtils class to isolate the repetitive code that transforms AngularFire results to the form expected in the lectures.

## Environment

I installed everything on June 2, 2018. I am running CentOS Linux release 7.5.1804 in a VM on a Mac, although that should make no difference. I am running node LTS v8.11.2 and npm 6.1.0. I am not running yarn as recommended by the instructor. You can look at the package.json file for other details.

## Installation

This is really meant as a reference as you go through the course. However you should be able to run it easily enough.

1. Install compatible versions of node and npm
2. Install compatible version of angular cli globally as explained in the course (sudo npm install -g @angular/cli) 
3. In the project directory, run "npm install"
4. Set up src/environments/firebase.config.ts with your Firebase configuration as explained in the course
5. Run "npm run populate-db" to populate your database if you have not already done so. In my setup, once the database has been populated I have to hit Ctrl-C to exit the program for some reason.
6. Run "ng serve" and the project should be running with Angular 6, RxJS 6. and AngularFire2 5.
 
