<script lang="ts">
  import type { ConversationSummary } from "$lib/types/chat";
  import ConversationItem from "./ConversationItem.svelte";

  interface Props {
    conversations: ConversationSummary[];
    activeSessionId: string | null;
    onSelect: (sessionId: string) => void;
  }

  let { conversations, activeSessionId, onSelect }: Props = $props();
</script>

<div class="conversation-list">
  {#if conversations.length === 0}
    <p class="empty">No conversations yet</p>
  {:else}
    {#each conversations as conversation (conversation.id)}
      <ConversationItem
        {conversation}
        active={conversation.id === activeSessionId}
        onSelect={() => onSelect(conversation.id)}
      />
    {/each}
  {/if}
</div>

<style>
  .conversation-list {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    overflow-y: auto;
    flex: 1;
    padding: 0.5rem;
  }

  .empty {
    margin: 1rem 0.75rem;
    font-size: 0.8125rem;
    color: #8e8e8e;
    text-align: center;
  }
</style>
