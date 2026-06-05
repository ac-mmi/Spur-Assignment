<script lang="ts">
  import { onMount } from "svelte";
  import { fetchConversations } from "$lib/api/chat";
  import ChatWindow from "$lib/components/ChatWindow.svelte";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import type { ConversationSummary } from "$lib/types/chat";
  import {
    clearStoredSessionId,
    getStoredSessionId,
    storeSessionId,
  } from "$lib/utils/session";

  let conversations = $state<ConversationSummary[]>([]);
  let activeSessionId = $state<string | null>(null);
  async function loadConversations(): Promise<void> {
    try {
      conversations = await fetchConversations();
    } catch {
      conversations = [];
    }
  }

  function handleNewChat(): void {
    activeSessionId = null;
    clearStoredSessionId();
  }

  function handleSelectConversation(sessionId: string): void {
    activeSessionId = sessionId;
    storeSessionId(sessionId);
  }

  function handleSessionChange(sessionId: string): void {
    activeSessionId = sessionId;
  }

  onMount(() => {
    const storedSessionId = getStoredSessionId();
    if (storedSessionId) {
      activeSessionId = storedSessionId;
    }

    void loadConversations();
  });
</script>

<svelte:head>
  <title>Customer Support Chat</title>
</svelte:head>

<main class="page">
  <Sidebar
    {conversations}
    {activeSessionId}
    onNewChat={handleNewChat}
    onSelectConversation={handleSelectConversation}
  />

  <ChatWindow
    sessionId={activeSessionId}
    onSessionChange={handleSessionChange}
    onConversationUpdated={loadConversations}
  />
</main>

<style>
  .page {
    display: flex;
    height: 100dvh;
    width: 100%;
    overflow: hidden;
    background: #171717;
  }
</style>
