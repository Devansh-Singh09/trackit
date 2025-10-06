# 📦 TrackIt – Shipment Tracker App  

TrackIt is a full-stack shipment tracking system that allows users to create and track shipment requests while giving admin users the ability to manage and update shipment statuses.  

---

## 🚀 Features  

### 🧑‍💻 Authentication  
- Secure login and signup using JWT authentication  
- For accessing Admin functionality : 
  - userId :admin@gmail.com
  - password : admin1234
- All subsequent users are assigned the **User** role  

### 📬 Shipment Management (CRUD)  
- **User** can create shipment requests by entering **source** and **destination** instead of manually providing distance  
- The **distance** is automatically calculated using Google Maps DISTANCE MATRIX API  
- **Admin** can view and manage all shipments  
- **User** can view only their own shipments  
- **Admin** can update shipment status:  
  - Pending → In Transit → Delivered  
- Only **Admin** can delete shipments  

### 🔍 Listing & Data Management  
- Pagination (3 shipments per page)  
- Filters for shipment status or user-specific data  
- Sorting and search capabilities  

---

## ⚙️ Tech Stack  

| Layer | Technology |
|--------|-------------|
| **Frontend** | React / Next.js |
| **Backend** | Node.js + Express |
| **Database** | MongoDB + Mongoose |
| **Authentication** | JWT (JSON Web Token) |
| **Deployment** | Frontend & Backend both deployed on Render |
| **API Testing** | Postman (with generated collection) |

---
## 🧭 API Endpoints  

| Method | Endpoint | Description | Access |
|--------|-----------|-------------|--------|
| POST | `/api/users/signup` | Register new user | Public |
| POST | `/api/users/login` | Login user and get JWT | Public |
| GET | `/api/shipments` | Get shipments (with pagination, filters) | Auth (Admin/User) |
| POST | `/api/shipments` | Create new shipment | User |
| PUT | `/api/shipments/:id/status` | Update shipment status | Admin |
| DELETE | `/api/shipments/:id` | Delete shipment | Admin |

---
## 👨‍💻 Author  

**Devansh Singh**  
B.Tech Computer Science, DTU  

