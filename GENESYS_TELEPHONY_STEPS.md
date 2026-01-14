# Step-by-Step: Configure Telephony in Genesys Cloud

## Based on Your Current Screen

You're currently on the **Activity** page. Here's exactly what to click:

### Step 1: Navigate to Digital and Telephony
1. Look at the **left sidebar** (dark blue)
2. Find **"Digital and Telephony"** (has a computer monitor + phone icon)
3. **Click on "Digital and Telephony"**

### Step 2: Access Phone Configuration
Once you're in Digital and Telephony, you should see options like:
- **Phones** - Click this to configure phones
- **Trunks** - For SIP trunking (if needed)
- **Phone Numbers** - To assign/get phone numbers

### Alternative: Admin Panel Method

If you don't see "Digital and Telephony" or it's not working:

1. **Click the gear icon** (⚙️) in the top right corner - this opens **Admin**
2. In the Admin panel, look for:
   - **Telephony** section in the left menu
   - Or search for "Phones" in the search bar at the top

### Step 3: Assign a Phone to Your User

1. In Admin → **People** → **Users**
2. Find your user account (your name)
3. Click on it
4. Look for **"Phones"** or **"Station"** section
5. Click **"Assign Phone"** or **"Add Phone"**

### Step 4: Create/Configure Phone

1. Go to **Admin** → **Telephony** → **Phones**
2. Click **"Add Phone"** or **"+"** button
3. Fill in:
   - **Name**: e.g., "My Demo Phone"
   - **Phone Base**: Select a type (SIP, WebRTC, etc.)
4. Save

### Step 5: Get a Phone Number

1. Go to **Admin** → **Telephony** → **Phone Numbers**
2. If you see **"Purchase Numbers"** or **"Add Number"**, click it
3. Select your region (US, etc.)
4. Choose a number
5. Assign it to your phone

## Quick Check: What Do You See?

Please tell me:
1. When you click **"Digital and Telephony"** in the left sidebar, what options appear?
2. Do you see a **gear icon (⚙️)** in the top right? If yes, what happens when you click it?
3. What menu items are visible in the left sidebar when you're in Admin?

## Alternative: Use WebRTC Phone (Easiest)

If phone configuration is complex, you can use **WebRTC** which works in the browser:

1. In Genesys Cloud, look for **"Phone"** icon in the top right
2. Click it
3. Select **"WebRTC"** as your phone type
4. This allows you to make calls directly from the browser

## For Demo: You Don't Need Real Phone!

**Important**: For the FAB Agents demo, you **don't need a real phone configured**. You can:

1. **Use "Simulate Call"** button in the FAB Agents app
2. **Use "Live Voice"** mode - speak into your browser microphone
3. Both create conversations that appear in "Genesys Live Queue"

The real phone setup is only needed if you want to make actual phone calls from Genesys Cloud itself.

---

**Next Step**: Click "Digital and Telephony" in your left sidebar and tell me what you see!
