# TMS App proof of concept

This is a proof of concept for a TMS (Transaction Management System) application. The application allows users to create, read, update and delete transactions. Users can also view the transactions net total and the total number of transactions of the day.

## Tech stack

The application is built using the following technologies:

- Next.js
- Supabase
- TypeScript
- Tailwind CSS
- PrimeReact

## Authentication

The application uses Supabase for authentication. Users have to be invited to the application by the admin. Authentication is done using email and password.

## Data ownership

The application uses Supabase for data storage. The data is owned by the user who created it. The user can only see and edit their own data.
