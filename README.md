# Flight Search App (Hermes)

Hermes is a flight search app designed to make finding the best travel options simple and intuitive. Users can search flights, view pricing, and filter results with a mobile-friendly design. With a goal in mind to have price analytics so the user knows theyre getting the best deal possible.

## Features

- Flight search with real-time filtering
- Mobile-first responsive design
- Reusable components with Tailwind CSS
- Integration with Amadeus API for flight data
- Context-based state management for search results and selections

## Goals

This project was built to:

- Improve my knowledge of Next.js.
- Implement external API integrations using TypeScript (Amadeus API).
- Focus on building responsive, accessible UI components.
- Experiment with Tailwind CSS for custom theming and layout control.

## Challenges

1. **Third Party API Limitations**:
   Amadeus API provides all of the data for this application, and Hermes is currently using the Free TEST tier until I get approved to move to the Free Production api. Until then there is extreme limitation to the location data Amadeus offers, and the price analysis data is too inconsistent to experiment with.

2. **Responsive Design**:
   Designing a layout that worked seamlessly on both modern smartphones and small older devices took multiple iterations with Tailwind CSS.

3. **Dynamic State Management**:
   Implementing complex state logic to handle dynamic flight offers and form state management with React Context API.

## Tech Stack

- **Frontend**: Next.js 13 (App Router), React, Tailwind CSS
- **State Management**: React Context API
- **Backend API Integration**: Amadeus API
- **Design**: Shadcn/UI components
- **Deployment**: Vercel

## Future Updates:

- If Hermes gets approved to move from Amadeus Test to Amadeus Production, I will release price analysis features for each flight offer and ideally add price watching cron jobs for users including alerts for price drops!
