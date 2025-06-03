# Fetch Frontend Take-Home Exercise - Dog Matcher

This project is a solution for the Fetch Frontend Take-Home Exercise. It allows users to log in, search for shelter dogs, filter by breed, sort results, favorite dogs, and find a potential match for adoption.

## Features Implemented

* **User Authentication:** Login via name/email, session persistence using HttpOnly cookies, and Logout functionality.
* **Dog Search & Browsing:** Displays a paginated list of dogs fetched from the API.
* **Filtering:** Allows users to filter the dog list by one or more breeds.
* **Sorting:** Allows users to sort the dog list by breed (alphabetically, ascending/descending).
* **Dog Details:** Presents all required dog information (Image, Name, Age, Zip Code, Breed) on cards.
* **Favorites:** Users can mark/unmark dogs as favorites.
* **Match Generation:** Users can request a match based on their selected favorites, and the matched dog is displayed.
* **Responsive Design:** Basic responsiveness for usability on different screen sizes.
* **Theming:** Custom Material UI theme inspired by Fetch branding.

## Tech Stack

* **Framework:** React 18
* **Language:** TypeScript
* **Build Tool:** Vite
* **UI Library:** Material UI (MUI) v5
* **Routing:** React Router DOM v6
* **API Calls:** Native Fetch API
* **State Management:** React Hooks (useState, useCallback, useEffect, useRef)

## Getting Started

### Prerequisites

* Node.js (v18 or later recommended)
* npm (usually comes with Node.js)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/pvTriesToCode/fetch-dog-matcher.git](https://github.com/pvTriesToCode/fetch-dog-matcher.git)
    cd fetch-dog-matcher
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running Locally

1.  **Start the development server:**
    ```bash
    npm run dev
    ```

2.  Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite in your terminal). The application should load on the login page.

## Deployment

This application is deployed using Vercel and is publicly accessible at:

[**https://fetch-dog-matcher-nu.vercel.app**](https://fetch-dog-matcher-nu.vercel.app)

## Design Notes (Optional)

* Used Material UI for rapid component development and theming capabilities.
* Implemented browser-native lazy loading for dog images to improve initial load performance.
* Pagination relies on the API's `total` count and calculates the `from` offset based on the current page number and results per page.

