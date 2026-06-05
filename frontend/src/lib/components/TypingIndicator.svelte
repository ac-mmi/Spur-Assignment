<div class="row" role="status" aria-live="polite" aria-label="Agent is typing">
  <div class="avatar" aria-hidden="true">AI</div>
  <div class="bubble">
    <span class="label">Agent is typing</span>
    <span class="dots" aria-hidden="true">
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    </span>
  </div>
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
    background: var(--color-blue);
    color: #ffffff;
  }

  .bubble {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border-radius: 1rem;
    border-bottom-left-radius: 0.25rem;
    background: #f9f9f9;
    border: 1px solid #e8e8e8;
    color: #666666;
    font-size: 0.875rem;
  }

  .label::after {
    content: "...";
  }

  .dots {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
  }

  .dot {
    width: 0.375rem;
    height: 0.375rem;
    border-radius: 50%;
    background: var(--color-blue);
    animation: bounce 1.4s infinite ease-in-out both;
  }

  .dot:nth-child(1) {
    animation-delay: -0.32s;
  }

  .dot:nth-child(2) {
    animation-delay: -0.16s;
  }

  @keyframes bounce {
    0%,
    80%,
    100% {
      transform: scale(0.6);
      opacity: 0.4;
    }

    40% {
      transform: scale(1);
      opacity: 1;
    }
  }
</style>
