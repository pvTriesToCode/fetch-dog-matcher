\# Fetch Frontend Take-Home Exercise \- Dog Matcher

This project is a solution for the Fetch Frontend Take-Home Exercise. It allows users to log in, search for shelter dogs, filter by breed, sort results, favorite dogs, and find a potential match for adoption.

\#\# Features Implemented

\* \*\*User Authentication:\*\* Login via name/email, session persistence using HttpOnly cookies, and Logout functionality.  
\* \*\*Dog Search & Browsing:\*\* Displays a paginated list of dogs fetched from the API.  
\* \*\*Filtering:\*\* Allows users to filter the dog list by one or more breeds.  
\* \*\*Sorting:\*\* Allows users to sort the dog list by breed (alphabetically, ascending/descending).  
\* \*\*Dog Details:\*\* Presents all required dog information (Image, Name, Age, Zip Code, Breed) on cards.  
\* \*\*Favorites:\*\* Users can mark/unmark dogs as favorites.  
\* \*\*Match Generation:\*\* Users can request a match based on their selected favorites, and the matched dog is displayed.  
\* \*\*Responsive Design:\*\* Basic responsiveness for usability on different screen sizes.

\#\# Tech Stack

\* \*\*Framework:\*\* React 18  
\* \*\*Language:\*\* TypeScript  
\* \*\*Build Tool:\*\* Vite  
\* \*\*UI Library:\*\* Material UI (MUI) v5  
\* \*\*Routing:\*\* React Router DOM v6  
\* \*\*API Calls:\*\* Native Fetch API  
\* \*\*State Management:\*\* React Hooks (useState, useCallback, useEffect, useRef)

\#\# Getting Started

\#\#\# Prerequisites

\* Node.js (v18 or later recommended)  
\* npm (usually comes with Node.js) or yarn

\#\#\# Installation

1\.  \*\*Clone the repository:\*\*  
    \`\`\`bash  
    git clone \<your-repository-url\>  
    cd \<repository-directory-name\>  
    \`\`\`  
    \*(Replace \`\<your-repository-url\>\` and \`\<repository-directory-name\>\`)\*

2\.  \*\*Install dependencies:\*\*  
    \`\`\`bash  
    npm install  
    \`\`\`  
    \*(Or \`yarn install\` if you use yarn)\*

\#\#\# Running Locally

1\.  \*\*Start the development server:\*\*  
    \`\`\`bash  
    npm run dev  
    \`\`\`  
    \*(Or \`yarn dev\`)\*

2\.  Open your browser and navigate to \`http://localhost:5173\` (or the port specified by Vite in your terminal). The application should load on the login page.

\#\# Deployment

This application is deployed and publicly accessible at:

\[\*\*\<\<\< Link to your deployed application \>\>\>\*\*\]

\*(Replace the above line with the actual URL provided by your hosting service, e.g., Vercel or Netlify)\*

