<script lang="ts">
  import type { MessageSender } from "$lib/types/chat";

  interface Props {
    text: string;
    sender: MessageSender;
  }

  let { text, sender }: Props = $props();

  const isUser = $derived(sender === "user");
</script>

<div class="row" class:user={isUser} class:ai={!isUser}>
  {#if !isUser}
    <div class="avatar" aria-hidden="true">AI</div>
  {/if}

  <div class="bubble" class:user={isUser} class:ai={!isUser}>
    <p>{text}</p>
  </div>

  {#if isUser}
    <div class="avatar user-avatar" aria-hidden="true">You</div>
  {/if}
</div>

<style>
  .row {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    max-width: 48rem;
    width: 100%;
    margin: 0 auto;
    padding: 0.5rem 1rem;
  }

  .row.user {
    justify-content: flex-end;
  }

  .row.ai {
    justify-content: flex-start;
  }

  .avatar {
    flex-shrink: 0;
    width: 2rem;
    height: 2rem;
    border-radius: 0.375rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.625rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    background: var(--color-blue);
    color: #ffffff;
  }

  .user-avatar {
    background: var(--color-gold);
    color: #1a1a1a;
  }

  .bubble {
    max-width: min(75%, 36rem);
    padding: 0.75rem 1rem;
    border-radius: 1rem;
    line-height: 1.6;
    font-size: 0.9375rem;
    word-break: break-word;
    white-space: pre-wrap;
  }

  .bubble p {
    margin: 0;
  }

  .bubble.user {
    background: #f5f5f5;
    color: #1a1a1a;
    border: 1px solid #e8e8e8;
    border-bottom-right-radius: 0.25rem;
  }

  .bubble.ai {
    background: #ffffff;
    color: #1a1a1a;
    border: 1px solid #e8e8e8;
    border-bottom-left-radius: 0.25rem;
  }
</style>
