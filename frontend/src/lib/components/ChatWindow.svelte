<script lang="ts">
  import { tick } from "svelte";
  import { fetchHistory, sendMessage } from "$lib/api/chat";
  import type { ChatMessage } from "$lib/types/chat";
  import { storeSessionId } from "$lib/utils/session";
  import ChatInput from "./ChatInput.svelte";
  import MessageBubble from "./MessageBubble.svelte";
  import TypingIndicator from "./TypingIndicator.svelte";

  interface Props {
    sessionId: string | null;
    onSessionChange: (sessionId: string) => void;
    onConversationUpdated: () => void;
  }

  let { sessionId, onSessionChange, onConversationUpdated }: Props = $props();

  let messages = $state<ChatMessage[]>([]);
  let isLoading = $state(false);
  let isSending = $state(false);
  let error = $state<string | null>(null);
  let messagesEndEl: HTMLDivElement | undefined = $state();
  let loadedSessionId = $state<string | null>(null);

  async function scrollToBottom(): Promise<void> {
    await tick();
    messagesEndEl?.scrollIntoView({ behavior: "smooth", block: "end" });
  }

  async function loadHistory(targetSessionId: string): Promise<void> {
    isLoading = true;
    error = null;

    try {
      const history = await fetchHistory(targetSessionId);
      messages = history.messages;
      loadedSessionId = targetSessionId;
      storeSessionId(targetSessionId);
      await scrollToBottom();
    } catch (err) {
      messages = [];
      loadedSessionId = null;
      error =
        err instanceof Error
          ? err.message
          : "Failed to load conversation history.";
    } finally {
      isLoading = false;
    }
  }

  async function handleSend(text: string): Promise<void> {
    isSending = true;
    error = null;

    const optimisticId = crypto.randomUUID();
    const userMessage: ChatMessage = {
      id: optimisticId,
      sender: "user",
      text,
      createdAt: new Date().toISOString(),
    };

    messages = [...messages, userMessage];
    await scrollToBottom();

    const wasNewConversation = sessionId === null;

    try {
      const response = await sendMessage(text, sessionId ?? undefined);

      onSessionChange(response.sessionId);
      storeSessionId(response.sessionId);
      loadedSessionId = response.sessionId;

      const aiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        sender: "ai",
        text: response.reply,
        createdAt: new Date().toISOString(),
      };

      messages = [...messages, aiMessage];
      await scrollToBottom();

      if (wasNewConversation) {
        onConversationUpdated();
      }
    } catch (err) {
      messages = messages.filter((message) => message.id !== optimisticId);
      error =
        err instanceof Error ? err.message : "Failed to send your message.";
    } finally {
      isSending = false;
    }
  }

  $effect(() => {
    if (sessionId === null) {
      messages = [];
      loadedSessionId = null;
      error = null;
      return;
    }

    if (sessionId !== loadedSessionId) {
      void loadHistory(sessionId);
    }
  });

  $effect(() => {
    if (messages.length > 0 || isSending) {
      void scrollToBottom();
    }
  });
</script>

<div class="chat-window">
  <header class="header">
    <div class="header-content">
      <h1>Customer Support</h1>
      <p class="subtitle">Ask anything — we're here to help</p>
    </div>
  </header>

  <div class="messages" aria-live="polite" aria-busy={isLoading || isSending}>
    {#if isLoading}
      <div class="state-message">Loading conversation...</div>
    {:else if messages.length === 0}
      <div class="empty-state">
        <div class="empty-icon" aria-hidden="true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            width="32"
            height="32"
          >
            <path
              fill-rule="evenodd"
              d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.402.75.75 0 0 0-.197 1.477 49.957 49.957 0 0 0 4.103.6c3.051 0 5.462-2.194 5.962-5.062a9.012 9.012 0 0 0 1.032-3.95V6.75c0-3.042-2.502-5.824-6.363-6.162A50.733 50.733 0 0 0 12 1.5c-2.653 0-5.216.376-7.586 1.084A6.5 6.5 0 0 0 4.848 2.771ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 3.75a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z"
              clip-rule="evenodd"
            />
            <path
              d="M2.25 12c0-3.042 2.502-5.824 6.363-6.162A48.733 48.733 0 0 1 12 4.5c2.653 0 5.216.376 7.586 1.084.75.208 1.305.76 1.305 1.547v6.02c0 .787-.555 1.34-1.305 1.547A48.733 48.733 0 0 1 12 19.5c-2.653 0-5.216-.376-7.586-1.084-.75-.208-1.305-.76-1.305-1.547V12Z"
            />
          </svg>
        </div>
        <h2>How can we help you today?</h2>
        <p>Start a conversation with our support agent.</p>
      </div>
    {:else}
      {#each messages as message (message.id)}
        <MessageBubble text={message.text} sender={message.sender} />
      {/each}
    {/if}

    {#if isSending}
      <TypingIndicator />
    {/if}

    <div bind:this={messagesEndEl} class="scroll-anchor"></div>
  </div>

  {#if error}
    <div class="error-banner" role="alert">{error}</div>
  {/if}

  <footer class="floating-footer">
    <ChatInput disabled={isSending || isLoading} onSend={handleSend} />
  </footer>
</div>

<style>
  .chat-window {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    flex: 1;
    min-width: 0;
    overflow: hidden;
    background: #ffffff;
    color: #1a1a1a;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e8e8e8;
    background: #ffffff;
  }

  .header-content h1 {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: #1a1a1a;
  }

  .subtitle {
    margin: 0.25rem 0 0;
    font-size: 0.8125rem;
    color: #666666;
  }

  .messages {
    flex: 1;
    overflow-y: auto;
    padding: 1rem 0 7rem;
    scroll-behavior: smooth;
    background: #ffffff;
  }

  .state-message {
    text-align: center;
    padding: 3rem 1rem;
    color: #666666;
    font-size: 0.9375rem;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 4rem 1.5rem;
    max-width: 24rem;
    margin: 0 auto;
  }

  .empty-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    background: #f0f7ff;
    color: var(--color-blue);
    margin-bottom: 1.25rem;
  }

  .empty-state h2 {
    margin: 0 0 0.5rem;
    font-size: 1.25rem;
    font-weight: 600;
    color: #1a1a1a;
  }

  .empty-state p {
    margin: 0;
    color: #666666;
    font-size: 0.9375rem;
    line-height: 1.5;
  }

  .scroll-anchor {
    height: 1px;
  }

  .error-banner {
    position: absolute;
    bottom: 5.75rem;
    left: 1.5rem;
    right: 1.5rem;
    z-index: 12;
    max-width: 52rem;
    margin: 0 auto;
    padding: 0.75rem 1rem;
    border-radius: 0.75rem;
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
    font-size: 0.875rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .floating-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10;
    padding: 1.5rem 1.5rem 1.25rem;
    background: linear-gradient(
      to top,
      #ffffff 65%,
      rgba(255, 255, 255, 0.95) 80%,
      transparent 100%
    );
    pointer-events: none;
  }

  .floating-footer :global(.input-form) {
    pointer-events: auto;
  }
</style>
