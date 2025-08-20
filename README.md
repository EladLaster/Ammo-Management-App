# Military Ammunition Management System

*A military ammunition management app that allows army units and field commanders to track inventory, place orders, update usage, and manage logistics in real time.*

## 🎯 Target Users

- **Field Commanders** (Guest)
- **Army Units** (First Guest)
- **Ammo Supplier** (Main Admin)

## 🔧 Use Cases

### Guest Users
- View own ammunition inventory
- Update ammunition usage in real time
- Place requests for new ammunition orders

### Admin Users
Has all Guest use cases plus:
- Monitor ammunition inventory for all units in the field
- Approve or reject ammunition requests
- Access reports and usage history
- Receive real-time alerts on shortages or logistical issues

## 🗺️ Navigation Flow

**Flow:** Login → Home (general inventory) → Requests (status) → New Request Form

### Admin Navigation
- **Login/Signup** - Admin access
- **Home Page Admin**: 
  1. Navbar - list of all units with their ammo inventory
  2. General depot inventory overview
- **Requests Page**: Table - all requests from all units, with approve/reject buttons
- **Reports Page**: Historical usage, alerts, and inventory trends

### Guest Navigation
- **Login/Signup** - Guest access
- **Home Page User**: General own inventory view
- **Requests Page**: Table - list of own requests with status updates
- **Form Page**: Form to submit new ammunition requests

## 🗄️ Database Schema

### Users
- `id` - Primary key
- `name` - User name
- `role` - Admin / User
- `unit_id` - Foreign key to Units
- `location` - User location

### Units
- `id` - Primary key
- `name` - Unit name
- `location` - Unit location

### Items
- `id` - Primary key
- `item_name` - Item name
- `category` - Item category

### Inventory
- `item_id` - Foreign key to Items
- `quantity` - Available quantity
- `unit_id` - Foreign key to Units
- `user_id` - Foreign key to Users
- `last_updated` - Timestamp

### Requests
- `id` - Primary key
- `users_id` - Foreign key to Users
- `item_id` - Foreign key to Items
- `unit_id` - Foreign key to Units
- `quantity` - Requested quantity
- `status` - pending/approved/rejected
- `created_at` - Creation timestamp
- `last_updated` - Last update timestamp

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/inventory` | Fetch inventory data |
| `POST` | `/requests` | Create new request |
| `GET` | `/requests` | List requests for current user |
| `PATCH` | `/requests/:id` | Approve/reject request |

## 🚀 Future Extensions

1. **Alerts for low inventory** - Automated notifications when stock runs low
2. **Simple usage reports** - Basic analytics and reporting features
3. **Email notifications** - Real email alerts for important events
4. **Admin inventory management** - Page for admins to set inventory quantities
5. **General inventory support** - Expand beyond ammunition to general military supplies

## 👥 Development Team

**React Hackathon Project**
- Elad
- Lior  
- Guy

---

*This project was developed as part of a React hackathon focusing on military logistics and inventory management.*