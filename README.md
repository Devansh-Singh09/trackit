📦 TrackIt – Shipment Tracker App

TrackIt is a full-stack shipment tracking system that allows users to create and track shipment requests while giving admin users the ability to manage and update shipment statuses.

🚀 Features
🧑‍💻 Authentication

Secure login and signup using JWT authentication

First registered user automatically becomes Admin

All subsequent users are assigned the User role

📬 Shipment Management (CRUD)

User can create shipment requests by entering source and destination instead of manually providing distance

The distance field is automatically calculated using a location API

Admin can view and manage all shipments

User can view only their own shipments

Admin can update shipment status:

Pending → In Transit → Delivered

Only Admin can delete shipments

🔍 Listing & Data Management

Pagination (5–10 shipments per page)

Filters for shipment status or user-specific data

Sorting and search capabilities

⚙️ Tech Stack
Layer	Technology
Frontend	React / Next.js
Backend	Node.js + Express
Database	MongoDB + Mongoose
Authentication	JWT (JSON Web Token)
Deployment	Frontend on Vercel, Backend on Render
API Testing	Postman (with generated collection)
