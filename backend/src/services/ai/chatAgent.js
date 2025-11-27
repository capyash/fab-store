/**
 * Backend Chat Agent using LangChain
 * 
 * Provides AI chat functionality for Cogniclaim with context awareness.
 * Uses GPT-4 via LangChain for natural language conversations about claims.
 * This is the server-side version that streams responses via SSE.
 */

import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import { getSOPByScenario, SCENARIO_SOPS } from "../data/sops.js";
import dotenv from "dotenv";

dotenv.config();

// ==================== Configuration ====================
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MODEL_NAME = process.env.OPENAI_MODEL || "gpt-4o-mini";
const TEMPERATURE = 0.7; // Higher temperature for more conversational responses

// Initialize OpenAI model
const createChatModel = (temperature = TEMPERATURE) => {
  if (!OPENAI_API_KEY) {
    console.warn("OpenAI API key not found. Using mock mode.");
    return null;
  }
  
  return new ChatOpenAI({
    model: MODEL_NAME,
    temperature,
    streaming: true,
    openAIApiKey: OPENAI_API_KEY,
  });
};

// ==================== Chat Agent ====================

/**
 * Send a chat message to the AI assistant
 * @param {string} message - User's message
 * @param {Object} context - { claim, claimId, reasoningSteps, conversationHistory }
 * @param {Function} onToken - Callback for streaming tokens
 * @returns {Promise<Object>} Chat response with text, sopRefs, suggestions
 */
export const sendChatMessage = async (message, context = {}, onToken = null) => {
  const model = createChatModel();
  
  try {
    if (!message || !message.trim()) {
      throw new Error("Message is required");
    }

    // Extract context
    const claim = context.claim || null;
    const claimId = context.claimId || null;
    const reasoningSteps = context.reasoningSteps || [];
    const conversationHistory = context.conversationHistory || [];

    // Build system prompt with context
    let systemPrompt = `You are an expert healthcare claims assistant for Cogniclaim, an AI-powered claims intelligence platform. Your role is to help users understand claims, SOPs (Standard Operating Procedures), and provide actionable insights.

Key capabilities:
- Explain claim details and status
- Reference relevant SOPs and procedures
- Interpret AI reasoning steps and recommendations
- Answer questions about claims processing
- Provide guidance on next steps

Always be helpful, accurate, and reference SOPs when relevant.`;

    // Add claim context if available
    if (claim) {
      const scenario = claim.scenario || 
        (claim.buildDays !== null && claim.authorizedDays !== null ? "build-days" : null) ||
        (claim.ssn || claim.cob?.hasSecondary || claim.cob?.hasTertiary ? "cob" : null) ||
        (claim.admissionType === 1 || claim.revenueCodes?.length > 0 || claim.surgeryType ? "precertification" : null);
      
      const scenarioSOP = scenario ? getSOPByScenario(scenario) : null;
      
      systemPrompt += `\n\nCurrent Claim Context:
- Claim ID: ${claim.id || claimId || "N/A"}
- Member: ${claim.member || "N/A"}
- Provider: ${claim.provider || "N/A"}
- Status: ${claim.status || "N/A"}
- Amount: $${claim.amount || 0}
${scenario ? `- Scenario: ${scenario}` : ""}
${scenarioSOP ? `- Relevant SOP: ${scenarioSOP.title} (${scenarioSOP.page})` : ""}`;

      // Add key claim details
      if (claim.cptCode) systemPrompt += `\n- CPT Code: ${claim.cptCode}`;
      if (claim.icd10Code) systemPrompt += `\n- ICD-10 Code: ${claim.icd10Code}`;
      if (claim.state) systemPrompt += `\n- State: ${claim.state}`;
    }

    // Add reasoning steps context if available
    if (reasoningSteps && reasoningSteps.length > 0) {
      systemPrompt += `\n\nAI Reasoning Summary:`;
      reasoningSteps.forEach((step, idx) => {
        if (step.role === "ai-step") {
          systemPrompt += `\n${idx + 1}. ${step.text} (${step.agent || "AI"})`;
          if (step.details) {
            systemPrompt += `\n   Details: ${step.details.substring(0, 200)}...`;
          }
        } else if (step.role === "ai-reco") {
          systemPrompt += `\n\nRecommendation: ${step.text}`;
          if (step.reasoning) {
            systemPrompt += `\nReasoning: ${step.reasoning.substring(0, 300)}...`;
          }
        }
      });
    }

    // Build conversation history
    const messages = [new SystemMessage(systemPrompt)];
    
    // Add conversation history
    conversationHistory.forEach((msg) => {
      if (msg.role === "user") {
        messages.push(new HumanMessage(msg.content));
      } else if (msg.role === "assistant") {
        messages.push(new AIMessage(msg.content));
      }
    });

    // Add current user message
    messages.push(new HumanMessage(message));

    // If no model (no API key), return mock response
    if (!model) {
      const mockResponse = `I understand you're asking about "${message}". In demo mode, I can provide general guidance about claims processing. For specific claim analysis, please ensure your OpenAI API key is configured.`;
      
      // Extract SOP references from message
      const sopMatches = message.match(/(?:SOP\s*)?(\d+(?:\.\d+){0,2})/gi) || [];
      const sopRefs = sopMatches.map(m => {
        const match = m.match(/(\d+(?:\.\d+){0,2})/);
        return match ? match[1] : null;
      }).filter(Boolean);

      if (onToken) {
        // Simulate streaming
        for (let i = 0; i < mockResponse.length; i++) {
          onToken(mockResponse[i]);
          await new Promise(resolve => setTimeout(resolve, 10));
        }
      }

      return {
        text: mockResponse,
        sopRefs: sopRefs.length > 0 ? sopRefs : [],
        suggestions: [
          "What SOPs apply to this claim?",
          "Explain the recommendation",
          "What are the next steps?",
        ],
      };
    }

    // Call GPT-4 with streaming
    let fullResponse = "";
    const stream = await model.stream(messages);

    for await (const chunk of stream) {
      const content = chunk.content;
      if (content) {
        fullResponse += content;
        if (onToken) {
          onToken(content);
        }
      }
    }

    // Extract SOP references from response
    const sopMatches = fullResponse.match(/(?:SOP\s*)?(\d+(?:\.\d+){0,2})/gi) || [];
    const sopRefs = sopMatches.map(m => {
      const match = m.match(/(\d+(?:\.\d+){0,2})/);
      return match ? match[1] : null;
    }).filter(Boolean);

    // Generate follow-up suggestions
    const suggestions = [
      "What SOPs apply to this claim?",
      "Explain the recommendation in more detail",
      "What are the next steps?",
    ];

    return {
      text: fullResponse,
      sopRefs: sopRefs.length > 0 ? sopRefs : [],
      suggestions,
    };
  } catch (error) {
    console.error("Chat agent error:", error);
    
    // Return error response
    const errorMessage = `I apologize, but I encountered an error: ${error.message}. Please try again or check your API configuration.`;
    
    if (onToken) {
      // Simulate streaming for error message
      for (let i = 0; i < errorMessage.length; i++) {
        onToken(errorMessage[i]);
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    }

    return {
      text: errorMessage,
      sopRefs: [],
      suggestions: ["Try asking again", "Check API configuration"],
    };
  }
};

export default {
  sendChatMessage,
};
