# SACAI - Smart AI Career Advisor & SpeakSpace GD/Interview Builder

An AI-powered web platform designed to guide users in their career journey and enhance their communication skills through simulated interview and group discussion sessions.

---

## Project Modules

### 1. SpeakSpace – GD & Interview Skill Builder
A real-time collaborative environment for students & job seekers to practice:
- Group Discussions (GD)
- Interview Skills
- Role-based Login System:
  - Moderator
  - Participant
  - Evaluator
- Live Chat & Video Conferencing using Jitsi
- Post-session Feedback & Ratings
- Analytics Dashboard for Performance Tracking

---


### 2. Intelligent Virtual Career Advisor
AI-driven career guidance platform that:
- Analyzes User Skills
- Recommends Personalized Career Paths
- Provides Resume & Interview Tips
- Performs Market & Job Trend Analysis
- Suggests Networking Opportunities

---


## Tech Stack

| Technology    | Purpose                          |
|---------------|----------------------------------|
| React.js      | Frontend Development             |
| TypeScript    | Type Safety & Code Structure     |
| Node.js       | Backend API                     |
| MongoDB Atlas | Cloud Database                  |
| Jitsi Meet    | Real-time Video Conferencing    |
| Tailwind CSS  | Styling Framework               |
| Vite          | Frontend Build Tool             |

---


---

## Setup Instructions

### Prerequisites
- Node.js v16+
- MongoDB Atlas Account
- Jitsi API (Free Plan Available)

---

### Installation

1. Clone the Repository:
```bash
git clone https://github.com/your-username/SACAI.git
cd SACAI

2. Install Dependencies:
npm install

3. Configure Environment Variables: Create .env file in root:

VITE_MONGODB_URI=your-mongodb-atlas-uri
VITE_JITSI_DOMAIN=meet.jit.si
VITE_API_URL=your-backend-url


Run the Project:
npm run dev
```
## Note:
 
 This project uses MongoDB Atlas with IP Whitelisting enabled.

 If you're trying to run this project locally, you will need to:
 
 1. Add your current IP address to the MongoDB Atlas Network Access whitelist.
 2. Alternatively, you can allow access from all IPs temporarily (Not recommended for production):
 
 In MongoDB Atlas Dashboard:

 Network Access -> Add IP Address -> 0.0.0.0/0

 
 3. Update the `VITE_MONGODB_URI` in `.env` file with your MongoDB Connection String.
