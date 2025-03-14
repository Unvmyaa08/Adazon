# Adazon
**Adazon AI**  

### Challenge Statement
Optimize Amazon advertising through AI-driven automation, reducing costs while enhancing efficiency and sustainability.

### Project Description
Adazon AI transforms Amazon advertising by leveraging real-time AI automation to **optimize ad targeting, dynamically adjust bids, and maximize ROI**. Unlike traditional platforms, our solution minimizes wasted ad spend while boosting engagement. Additionally, Adazon integrates a **user reward system**, allowing Amazon users to earn points through ad interactions. We also prioritize **sustainability**, utilizing **energy-efficient AI processing and carbon-conscious ad-serving** to reduce environmental impact.

### Project Value 
Adazon AI addresses rising advertising costs and inefficiencies by providing businesses with a **smarter, cost-effective solution**. AI-driven ad placements and optimized bids help brands achieve **higher returns on investment** with reduced spending. Our user reward system **boosts engagement** by incentivizing interactions, creating a win-win ecosystem for businesses and consumers. Our commitment to **eco-conscious advertising** ensures lower energy usage, making digital ads more sustainable.

### Tech Overview
- **Docker** – Containerized deployment
- **Expo Go (React)** – Cross-platform user interface
- **FastAPI (Python)** – Backend processing and API integration
- **Claude Sonnet API (Anthropic)** – Advanced chain-of-thought AI capabilities
- **AWS Lambda** – Scalable cloud infrastructure *(planned)*
- **Amazon Ads API** integration *(planned, future stage)*

---

## App Setup

This mini-guide will help you run the Expo frontend and FastAPI backend seamlessly using Docker. Docker ensures consistent application performance across environments without dependency issues.

### Setup Instructions

#### Running the Expo App with Docker

Use these commands to quickly set up and run your application:

```bash
# Build the Docker image
docker build -t fmu-botb-hackathon .

# Run the Docker container, forwarding the necessary ports
docker run -it --rm \
  -p 19000:19000 \  # Expo app runs here (access your app through browser or Expo client)
  -p 19001:19001 \  # Expo DevTools (interface to manage your Expo app development)
  -p 19002:19002 \  # Expo debug tools and QR code generator for easy app access
  -p 8080:8000 \    # FastAPI Backend (API server for app data and logic)
  fmu-botb-hackathon
```

After running these commands, you can access:

- **Frontend (Expo)** at [http://localhost:19000](http://localhost:19000)  
- **Backend API** at [http://localhost:8080](http://localhost:8080)

---
### **Link to Video Pitch 📹**  
...point us to the short clip that tells us about your solution 😄  

### **Link to Demo Presentation 📽**  
...point us to your PPT or Canva slides 😍  

### **Team Checklist ✅**  
✅ Team photo  
✅ Team Slack channel  
✅ Communication established with mentor  
✅ Repo creation from this template  
✅ Hangar registration  

### **Project Checklist 🏁**  
✅ Presentation complete and linked  
✅ Code merged to main branch  

### **School Name 🏫**  
Florida Memorial University   

### **Team Name 🏷**  
LionsBytes  

### **✨ Contributors ✨**  
...tell the world who you and your team are 🙂  

Jamya Foster 
Jubalani Mzee
Antonio Thomas 
Amuari Stratford
Tyla Bartlett


