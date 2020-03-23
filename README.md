## colivery.app

This repository contains the implementation for the Progressive Web Application (PWA) Colivery.app.
It is structured in:

 - assets (dynamic assets, as images, stylesheets)
 - static (static assets as the manifest.json, fonts, pre-generated icons)
 - public (the production build)
 - src (the actual source code of the app)

We've decided to choose the PWA architecture for better portability and seamless use.

### Framework choice

This project is based on SpringType, a novel, innovative frontend-framework based on
TypeScript, that is designed as a union of the featureset of React and Angular.
We, Michael and me, developed this framework for the last 2 years as an Open Source 
web framework and continue to push it forward. SpringType allows us to keep the
complexity low, devleop at fast pace and use vanilla JS / CSS - however, 
SpringType has a clean, innovative and high performance lazy VDOM implementation.

Read more: https://www.springtype.org and the SpringType ecosystem: https://github.com/springtype-org

### Architecture

This project follows a clean, component-driven, domain-driven approach with some
functional programming influences. We've decided against state stores like Redux and
reactive programming because this is an MVP (Minimal Viable Product) implementation.

We're already planning for more freatures, a refactoring and necessary adjustments 
to the internal logic; adding more documentation, tests and and co. 

Because this is a living peace of code - not a dead project to be over-taken by
a different community, we were more focused on building a working product to help
the community as soon as possible than focusing on 100% clean code style 
(which we would be absolutely capable of doing so). We believe in constant
improvement in terms of iterations. One small refactoring at a time.

### Data model, networking, scalability, endpoints

Colivery's primary data source is hosted on Firebase, namely Firestore.
Hosting is also set up on Firebase. This allows for horizontal scalability.
Next to Firebase, we're in need of more ACL-driven data access, which led us
to implement the "Colivery Microservice API" (https://gitlab.com/colivery1) by a subteam 
in Kotlin/Java/Spring Boot. A Docker based hosting allows for future scalability.
All requests to Firestore, except the ones for authentication purposes, 
are proxied and managed by this API.

Furthermore, we're using GIS (Geo Information Services) API's for GeoCoding
and POI (Point of Interest) feature detection. Here we're relying on Open Source
projects such as OpenLayers, Open Street Map (OSM) and Overpass API Turbo.

Another Microservice API ("engine") was implemented by another subteam, 
it is also available on GitLab (https://gitlab.com/colivery1) and implements 
the matching alogrithm to match Orders with potential Drivers.

Using Open Source technologies was crucial for our success and so we're 
thrilled to give back. 

### TODO

- General code cleanup and better/more meaningful code documentation
- Initial manual User Testing to make sure the solution does fit to the needs by 100%; this will lead to cooperations with existing organizations who do the same thing manually
- Impl. Unit Tests, Integration Tests, End-2-End-Tests (Jest, TestCafé)
- Apply the beautiful UI design 
- Optimize the networking and algorithms to scale (performance)

As the team grows:
- Switching to a GitFlow process
- Switching to Test Coverage and metrics driven code quality management
- Switching to conventional commits policy
- Adding git hooks etc.

### Favicon generator

https://app-manifest.firebaseapp.com/

### Install and run (development mode)

    yarn
    yarn start

Then open a web browser and navigate to: http://localhost:4444

### Production deploy

    yarn start:prod
    firebase deploy