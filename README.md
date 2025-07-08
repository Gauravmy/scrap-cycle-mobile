
# ♻️ Epicircle React Native Assignment

A dual-app mobile platform built with **React Native** to simulate scrap pickup operations. This project includes two apps:

- **📱 Customer App:** Users can schedule scrap pickups, view order history, and approve pickups.
- **👷 Partner App:** Eco-warrior partners can manage assigned pickups, update item details, and request customer approvals.

---

## 📦 Features

### ✅ Customer App

- 🔐 Phone Number + OTP Authentication
- 🏠 Dashboard with Pickup Summary
- 🗓️ Schedule Pickup (Date, Time, Address)
- 📜 View Pickup Request History
- 🔑 Approve Pickup Requests & Enter Pickup Code

### 🔧 Partner App

- 🔐 Partner Login (Phone Number + OTP)
- 📋 View Assigned Pickups
- 📦 Accept, Start, and Complete Pickup Flow
- 📝 Add Scrap Item Details
- 📮 Submit for Approval

---

## 🌐 Tech Stack

| Tech/Tool        | Purpose                            |
|------------------|------------------------------------|
| React Native     | Mobile App Development             |
| React Navigation | Screen Navigation                  |
| AsyncStorage     | Local Data Persistence             |
| Axios/Fetch      | API Requests (Mocked)              |
| MockAPI.io / json-server | Mock Backend APIs         |
| Context API / Redux | State Management (optional)     |
| Expo             | Development Environment            |

---

## 🧪 How to Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/epicircle-assignment.git
cd epicircle-assignment
````

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Start the App (Expo)

```bash
npx expo start
```

> Make sure to run the Customer and Partner apps on **separate terminals/devices** if building separately.

---

## 🧪 Mock API Setup (Options)

### Option 1: Use `MockAPI.io`

* Create two resources:

  * `customers`
  * `pickups`
* Replace base URL in your code accordingly.

### Option 2: Use `json-server` locally

```bash
npm install -g json-server

# Create a db.json file
json-server --watch db.json --port 3001
```

### Sample `db.json`

```json
{
  "customers": [],
  "pickups": []
}
```

---

## 🎨 UI/UX Highlights

* ✅ Minimal, eco-friendly theme (greens/blues)
* 📍 Google Map integration with location preview
* 🚦 Real-time pickup status updates
* 🧾 Interactive order history with approval modals
* 📱 Responsive layouts with smooth transitions

---

## 📷 Screenshots

| Customer Dashboard                          | Partner Pickup List                     |
| ------------------------------------------- | --------------------------------------- |
| ![Customer](screens/customer_dashboard.png) | ![Partner](screens/partner_pickups.png) |

---

## 🚀 Project Structure

```
📁 customer-app/
📁 partner-app/
📁 assets/
📄 App.js
📄 README.md
```

---

## 📝 Future Improvements

* 🔔 Push Notifications
* 🧭 Embedded Map Navigation
* 🧠 Smart Pickup Scheduling
* 🛡️ Role-Based Access Control (RBAC)

---

## 👨‍💻 Developed By

* **Your Name**
 Gaurav Dhakad

---

## 📬 Questions?

Feel free to raise an issue or ping me directly if you have questions during the review.

---

