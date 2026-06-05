<script lang="ts">
  import type { ConversationSummary } from "$lib/types/chat";

  interface Props {
    conversation: ConversationSummary;
    active: boolean;
    onSelect: () => void;
  }

  let { conversation, active, onSelect }: Props = $props();
</script>

<button
  type="button"
  class="conversation-item"
  class:active
  onclick={onSelect}
  title={conversation.title}
>
  <span class="title">{conversation.title}</span>
</button>

<style>
  .conversation-item {
    display: block;
    width: 100%;
    padding: 0.625rem 0.75rem;
    border: none;
    border-radius: 0.5rem;
    background: transparent;
    color: #ececec;
    font-size: 0.875rem;
    text-align: left;
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .conversation-item:hover {
    background: #2f2f2f;
  }

  .conversation-item.active {
    background: #343434;
  }

  .title {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
