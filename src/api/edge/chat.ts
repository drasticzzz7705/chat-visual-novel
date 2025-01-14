import {
  CHAT_COMPLETION_CONFIG,
  CHAT_COMPLETION_URL,
} from "@/configs/constants";
import { ResponseGetChats, ResponseSend } from "@/pages/api/chatgpt/chat";
import { WebStorage } from "@/storage/webstorage";
import {
  ChatCompletionRequestMessage,
  ChatCompletionResponseMessage,
  CreateChatCompletionResponse,
} from "openai";
import { getApiKey } from "./user";

export function getChatsByConversationId(conversationId: number) {
  const _chatRepo = new WebStorage<ResponseGetChats>("o:c");
  const _chats = _chatRepo.get<ResponseGetChats>() ?? [];
  return _chats.filter((e) => e.conversation_id == conversationId);
}

export function saveChat(
  conversationId: number,
  message: ChatCompletionResponseMessage
) {
  const _chatRepo = new WebStorage<ResponseGetChats>("o:c");
  const _chats = _chatRepo.get<ResponseGetChats>() ?? [];
  let nextIndex = 1;
  for (const _index in _chats) {
    if ((_chats[_index].id ?? 0) >= nextIndex)
      nextIndex = (_chats[_index].id ?? 0) + 1;
  }
  const _chat = {
    id: nextIndex,
    conversation_id: conversationId,
    role: message.role as string,
    content: message.content,
    name: undefined,
    created_at: new Date().toISOString(),
  };
  _chats.push(_chat);
  _chatRepo.set(_chats);
  return _chat;
}

export async function sendMessage(
  conversationId: number,
  message: string,
  name?: string
) {
  const messages = getChatsByConversationId(conversationId).map((it) => ({
    role: it.role,
    content: it.content,
    name: it.name,
  })) as ChatCompletionRequestMessage[];
  const _message: ChatCompletionRequestMessage = {
    role: "user",
    content: message,
    name: name ?? undefined,
  };
  messages.push(_message);
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API key not set.");
  try {
    const response = await fetch(CHAT_COMPLETION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        ...CHAT_COMPLETION_CONFIG,
        messages: messages,
      }),
    });
    const json = await response.json();
    if (!response.ok) {
      throw new Error(json);
    }
    const { choices } = json as CreateChatCompletionResponse;
    if (choices.length === 0 || !choices[0].message) {
      throw new Error("No response from OpenAI");
    }
    saveChat(conversationId, _message);
    return [saveChat(conversationId, choices[0].message)] as ResponseSend;
  } catch (e) {
    console.error(e);
  }
}

export function deleteChatsByConversationId(conversationId: number) {
  const _chatRepo = new WebStorage<ResponseGetChats>("o:c");
  const _chats = _chatRepo.get<ResponseGetChats>() ?? [];
  const _filtered = _chats.filter((e) => e.conversation_id != conversationId);
  _chatRepo.set(_filtered);
}

export function deleteAllChats() {
  const _chatRepo = new WebStorage<ResponseGetChats>("o:c");
  _chatRepo.set([]);
}
