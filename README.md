# Albaly Frontend Developer Coding Challenge

A responsive two-page dashboard application built with **Next.js**, **TypeScript**, and **Tailwind CSS**.  
The project was developed as part of the Albaly Frontend Developer coding assessment.

---

## Project Description
This project is a responsive, two-page business insights dashboard developed with a reusable layout.  
The application utilizes mocked data provided through local API endpoints under `/api/`.

---

## Pages

### Layout
- Sidebar navigation including **Overview** and **Insights**, with a static **Logout** button  
- Navbar navigation featuring the application title star button and user avatar 
- A lightweight loading component displayed while fetching data from API endpoints. It features a subtle, accessible animation to indicate progress and enhance perceived responsiveness. 
- Fully responsive across mobile, tablet, and desktop devices  

### Overview
- KPI summary cards: **Total Sales**, **Active Customers**, and **Inventory Status**  
- Recent activity feed (3 items: status, description, and timestamp)  
- Monthly performance section displaying revenue with percentage change  

### Insights
- Comparison of top-selling products with visual bar indicators  
- Customer drop-off analysis with a 4-week breakdown  
- Regional performance metrics (North America, Europe, APAC)  
- Conversion funnel illustrating the flow: **Visitors → Product Views → Add to Cart → Purchase**

---

## Setup Instructions
- npm install 
- npm run dev
 
### Clone Repository & Demo 
- git clone : https://github.com/Ayopee01/Albaly_Frontend.git 
- Demo : https://albaly-frontend.vercel.app/overview
