<script lang="ts">
  import type { ConversationSummary } from "$lib/types/chat";
  import ConversationList from "./ConversationList.svelte";

  interface Props {
    conversations: ConversationSummary[];
    activeSessionId: string | null;
    onNewChat: () => void;
    onSelectConversation: (sessionId: string) => void;
  }

  let {
    conversations,
    activeSessionId,
    onNewChat,
    onSelectConversation,
  }: Props = $props();
</script>

<aside class="sidebar">
  <div class="sidebar-header">
    <h1 class="brand">SpurMart</h1>
    <button type="button" class="new-chat-button" onclick={onNewChat}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        width="16"
        height="16"
        aria-hidden="true"
      >
        <path
          d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875A1.875 1.875 0 0 1 12.75 7.125V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z"
        />
        <path
          d="M12.971 1.816A5.25 5.25 0 0 1 18 7.097v4.432a.75.75 0 0 1-1.28.53l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 .53-.22Z"
        />
      </svg>
      New chat
    </button>
  </div>

  <ConversationList
    {conversations}
    {activeSessionId}
    onSelect={onSelectConversation}
  />
</aside>

<style>
  .sidebar {
    display: flex;
    flex-direction: column;
    width: 260px;
    flex-shrink: 0;
    height: 100%;
    background: #212121;
    border-right: 1px solid #2f2f2f;
  }

  .sidebar-header {
    padding: 1rem;
    border-bottom: 1px solid #2f2f2f;
  }

  .brand {
    margin: 0 0 0.75rem;
    font-size: 1rem;
    font-weight: 600;
    color: #ececec;
  }

  .new-chat-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.625rem 0.75rem;
    border: 1px solid #424242;
    border-radius: 0.5rem;
    background: linear-gradient(to top,#0099FF,#0086D9) !important;
    color: #ececec;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .new-chat-button:hover {
    background: #2f2f2f;
  }
</style>
