# Genesys Cloud Telephony Configuration Guide

## Overview
This guide will help you configure telephony in Genesys Cloud so you can make real calls and demo the FAB Agents workflow with live conversations.

## Prerequisites
- ✅ Genesys Cloud account with Admin permissions
- ✅ OAuth credentials already configured (Client ID/Secret)
- ✅ Access to Admin panel in Genesys Cloud

## Step-by-Step Configuration

### Step 1: Access Telephony Settings
1. Log into Genesys Cloud (https://apps.mypurecloud.com)
2. Click on **Admin** (gear icon) in the top right
3. Navigate to **Telephony** → **Phones** in the left sidebar

### Step 2: Create/Assign a Phone
1. In the **Phones** section, click **"Add Phone"** or select an existing phone
2. Configure the phone:
   - **Name**: Give it a descriptive name (e.g., "Demo Phone - VKV")
   - **Phone Base Settings**: Select your phone type (SIP, WebRTC, etc.)
   - **Capabilities**: Enable "Make Calls" and "Receive Calls"

### Step 3: Assign Phone to Your User
1. Go to **Admin** → **People** → **Users**
2. Find and click on your user account
3. Scroll to **"Phones"** section
4. Click **"Assign Phone"**
5. Select the phone you created in Step 2
6. Set it as your **Primary Phone**

### Step 4: Configure a Line (SIP Trunk)
1. Go to **Admin** → **Telephony** → **Trunks**
2. You have two options:

   **Option A: Use Genesys Cloud Phone (Easiest for Demo)**
   - Genesys provides built-in phone numbers
   - No external trunk configuration needed
   - Perfect for testing and demos

   **Option B: Configure External SIP Trunk**
   - Click **"Add Trunk"**
   - Select **"SIP Trunk"**
   - Configure:
     - **Trunk Name**: e.g., "Demo SIP Trunk"
     - **Trunk Base**: Select your provider
     - **SIP Settings**: Enter your SIP provider details
     - **Phone Numbers**: Assign phone numbers to the trunk

### Step 5: Assign Phone Number
1. Go to **Admin** → **Telephony** → **Phone Numbers**
2. If you have available numbers, assign one to your phone
3. If you need a new number:
   - Click **"Purchase Numbers"** or **"Add Number"**
   - Select your region (e.g., US)
   - Choose a number
   - Assign it to your phone/trunk

### Step 6: Configure Queue (Optional but Recommended)
1. Go to **Admin** → **Contact Center** → **Queues**
2. Create a new queue or use existing:
   - **Name**: e.g., "Demo Support Queue"
   - **Media Types**: Enable "Voice"
   - **Routing**: Configure routing rules

### Step 7: Set Up Call Routing (Optional)
1. Go to **Admin** → **Architect** → **Flows**
2. Create or edit an inbound call flow
3. Configure:
   - **Entry Point**: Your phone number
   - **Flow Logic**: Route to queue or agent
   - **Actions**: Add any IVR or call handling logic

### Step 8: Test Your Configuration
1. In Genesys Cloud, go to **Phone** (top right)
2. Select your configured phone
3. Make a test call:
   - Click the **phone icon** with three lines (as shown in your screenshot)
   - Dial a test number
   - Verify the call connects

## Integration with FAB Agents Demo

### How Calls Will Flow:
1. **Incoming Call** → Genesys Cloud receives the call
2. **Genesys API** → FAB Agents polls for new conversations
3. **Conversation Created** → Appears in "Genesys Live Queue" panel
4. **Auto-Process** → If enabled, FAB Agents workflow starts automatically
5. **Workflow Execution** → AI agents process the call transcript
6. **Real-time Updates** → Console shows workflow stages

### Current Demo Features:
- ✅ **Simulate Call Button**: Creates test conversations (works without real phone)
- ✅ **Live Voice Mode**: Uses browser microphone to create conversations
- ✅ **Real Conversations**: When configured, real calls will appear in the queue

## Quick Demo Setup (Without Real Phone)

If you want to demo immediately without configuring a real phone:

1. **Use "Simulate Call" Button**:
   - In the "Genesys Live Queue" panel
   - Click **"Simulate Call"** button
   - This creates a test conversation with realistic HP printer/laptop scenarios

2. **Use Live Voice Mode**:
   - In the "AI Interaction Hub" section
   - Click **"Start Speaking"**
   - Speak your issue (e.g., "My HP printer is offline")
   - This creates a Genesys conversation automatically

3. **Auto-Process Toggle**:
   - Enable "Auto-process" in Genesys panel
   - New conversations will automatically trigger FAB Agents workflow

## Troubleshooting

### Phone Not Showing Up
- Check user permissions (need "Telephony" admin role)
- Verify phone is assigned to your user account
- Refresh the Genesys Cloud page

### Cannot Make Calls
- Verify phone number is assigned
- Check trunk configuration (if using external trunk)
- Ensure phone is set as "Primary" in user settings

### Calls Not Appearing in FAB Agents
- Verify OAuth credentials are correct
- Check API endpoint matches your region (usw2, use1, etc.)
- Ensure backend server is running
- Check browser console for API errors

## Next Steps

Once telephony is configured:

1. **Make a Real Call**: Call your Genesys phone number from your mobile
2. **Watch Live Queue**: See the call appear in "Genesys Live Queue" panel
3. **Auto-Process**: If enabled, FAB Agents will automatically start processing
4. **Monitor Workflow**: Watch the AI agents analyze and resolve the issue

## Support Resources

- **Genesys Cloud Help**: https://help.mypurecloud.com
- **API Documentation**: https://developer.mypurecloud.com/api/rest/v2/
- **Telephony Guide**: https://help.mypurecloud.com/articles/configure-a-phone/

---

**Note**: For the fastest demo setup, use the "Simulate Call" feature which works immediately without phone configuration. Real telephony setup is recommended for production demos.
