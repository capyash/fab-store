/**
 * Genesys Webhook Handler Service
 * Handles real-time webhook events from Genesys Cloud
 * Author: Vinod Kumar V (VKV)
 */

import { getConversationDetails, getConversationMessages } from './genesysService';

/**
 * Process Genesys webhook event
 * @param {Object} event - Webhook event from Genesys
 * @param {Function} onConversationCreated - Callback when conversation is created
 * @param {Function} onMessageReceived - Callback when message is received
 * @param {Function} onConversationEnded - Callback when conversation ends
 * @returns {Promise<Object>} Processing result
 */
export async function processWebhookEvent(event, callbacks = {}) {
  const { onConversationCreated, onMessageReceived, onConversationEnded } = callbacks;

  try {
    const topic = event.topic || event.eventBody?.topic;
    const eventBody = event.eventBody || event;

    switch (topic) {
      case 'v2.conversations.callbacks.conversations':
      case 'conversation.created':
        return await handleConversationCreated(eventBody, onConversationCreated);

      case 'v2.conversations.callbacks.messages':
      case 'conversation.message':
        return await handleMessageReceived(eventBody, onMessageReceived);

      case 'v2.conversations.callbacks.conversations.ended':
      case 'conversation.ended':
        return await handleConversationEnded(eventBody, onConversationEnded);

      default:
        console.log('Unknown webhook topic:', topic);
        return { processed: false, topic };
    }
  } catch (error) {
    console.error('Error processing webhook event:', error);
    return { processed: false, error: error.message };
  }
}

/**
 * Handle conversation created event
 * @param {Object} eventBody - Event body
 * @param {Function} callback - Callback function
 * @returns {Promise<Object>} Processing result
 */
async function handleConversationCreated(eventBody, callback) {
  try {
    const conversationId = eventBody.conversationId || eventBody.id;
    
    if (!conversationId) {
      throw new Error('Conversation ID not found in event');
    }

    // Fetch full conversation details
    const conversation = await getConversationDetails(conversationId);
    
    // Trigger callback if provided
    if (callback && typeof callback === 'function') {
      await callback(conversation);
    }

    return {
      processed: true,
      event: 'conversation.created',
      conversationId,
      conversation,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Error handling conversation created:', error);
    return {
      processed: false,
      event: 'conversation.created',
      error: error.message,
      timestamp: new Date(),
    };
  }
}

/**
 * Handle message received event
 * @param {Object} eventBody - Event body
 * @param {Function} callback - Callback function
 * @returns {Promise<Object>} Processing result
 */
async function handleMessageReceived(eventBody, callback) {
  try {
    const conversationId = eventBody.conversationId || eventBody.conversation?.id;
    const messageId = eventBody.messageId || eventBody.id;
    
    if (!conversationId) {
      throw new Error('Conversation ID not found in event');
    }

    // Fetch conversation messages
    const messages = await getConversationMessages(conversationId);
    const newMessage = messages.entities?.find(m => m.id === messageId) || eventBody;

    // Trigger callback if provided
    if (callback && typeof callback === 'function') {
      await callback({
        conversationId,
        message: newMessage,
        messages,
      });
    }

    return {
      processed: true,
      event: 'conversation.message',
      conversationId,
      messageId,
      message: newMessage,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Error handling message received:', error);
    return {
      processed: false,
      event: 'conversation.message',
      error: error.message,
      timestamp: new Date(),
    };
  }
}

/**
 * Handle conversation ended event
 * @param {Object} eventBody - Event body
 * @param {Function} callback - Callback function
 * @returns {Promise<Object>} Processing result
 */
async function handleConversationEnded(eventBody, callback) {
  try {
    const conversationId = eventBody.conversationId || eventBody.id;
    
    if (!conversationId) {
      throw new Error('Conversation ID not found in event');
    }

    // Fetch final conversation details
    const conversation = await getConversationDetails(conversationId);

    // Trigger callback if provided
    if (callback && typeof callback === 'function') {
      await callback(conversation);
    }

    return {
      processed: true,
      event: 'conversation.ended',
      conversationId,
      conversation,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Error handling conversation ended:', error);
    return {
      processed: false,
      event: 'conversation.ended',
      error: error.message,
      timestamp: new Date(),
    };
  }
}

/**
 * Simulate webhook event (for testing/demo)
 * @param {string} eventType - Event type (conversation.created, conversation.message, conversation.ended)
 * @param {Object} eventData - Event data
 * @param {Function} callbacks - Callback functions
 * @returns {Promise<Object>} Processing result
 */
export async function simulateWebhookEvent(eventType, eventData, callbacks = {}) {
  const mockEvent = {
    topic: eventType,
    eventBody: {
      ...eventData,
      conversationId: eventData.conversationId || eventData.id,
    },
  };

  return await processWebhookEvent(mockEvent, callbacks);
}

/**
 * Auto-process new Genesys conversations
 * This function can be called when a new conversation is created to automatically route it to FAB Agents
 * @param {Object} conversation - Conversation object from Genesys
 * @returns {Promise<Object>} Processing result
 */
export async function autoProcessConversation(conversation) {
  try {
    // Extract conversation data
    const conversationId = conversation.id;
    const mediaType = conversation.mediaType || 'chat';
    const participants = conversation.participants || [];
    const participant = participants[0];

    // Determine channel type
    const channel = mediaType === 'call' ? 'voice' : mediaType === 'email' ? 'email' : 'chat';

    // Get messages if available
    let interactionText = '';
    try {
      const messages = await getConversationMessages(conversationId);
      if (messages.entities && messages.entities.length > 0) {
        interactionText = messages.entities
          .filter(m => m.direction === 'inbound')
          .map(m => m.textBody || m.body || '')
          .join(' ');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }

    // Return data ready for FAB Agents processing
    return {
      success: true,
      conversationId,
      channel,
      text: interactionText || `New ${mediaType} conversation from Genesys`,
      from: participant?.address || participant?.name || 'Genesys Customer',
      customerName: participant?.name || 'Genesys Customer',
      genesysConversationId: conversationId,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Error auto-processing conversation:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date(),
    };
  }
}
