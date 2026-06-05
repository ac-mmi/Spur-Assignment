<script lang="ts">
  interface Props {
    disabled?: boolean;
    onSend: (message: string) => void | Promise<void>;
  }

  let { disabled = false, onSend }: Props = $props();

  let value = $state("");
  let textareaEl: HTMLTextAreaElement | undefined = $state();

  async function submit(): Promise<void> {
    const trimmed = value.trim();
    if (!trimmed || disabled) {
      return;
    }

    value = "";
    resetTextareaHeight();
    await onSend(trimmed);
  }

  function handleKeydown(event: KeyboardEvent): void {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void submit();
    }
  }

  function handleInput(): void {
    if (!textareaEl) {
      return;
    }

    textareaEl.style.height = "auto";
    textareaEl.style.height = `${Math.min(textareaEl.scrollHeight, 120)}px`;
  }

  function resetTextareaHeight(): void {
    if (!textareaEl) {
      return;
    }

    textareaEl.style.height = "auto";
  }
</script>

<form
  class="input-form"
  onsubmit={(event) => {
    event.preventDefault();
    void submit();
  }}
>
  <div class="input-wrapper">
    <textarea
      bind:this={textareaEl}
      bind:value
      class="textarea"
      placeholder="Type your prompt here"
      rows="1"
      maxlength="2000"
      {disabled}
      onkeydown={handleKeydown}
      oninput={handleInput}
      aria-label="Message input"
    ></textarea>

    <button
      type="submit"
      class="send-button"
      disabled={disabled || !value.trim()}
      aria-label="Send message"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        width="18"
        height="18"
        aria-hidden="true"
      >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    </button>
  </div>
</form>

<style>
  .input-form {
    width: 100%;
    max-width: 52rem;
    margin: 0 auto;
    padding: 0;
  }

  .input-wrapper {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.5rem 0.5rem 0.5rem 1rem;
    background: #f3f4f6;
    border: 1px solid #e5e7eb;
    border-radius: 9999px;
    box-shadow:
      0 4px 20px rgba(0, 0, 0, 0.08),
      0 1px 4px rgba(0, 0, 0, 0.04);
  }

  .textarea {
    flex: 1;
    resize: none;
    border: none;
    outline: none;
    background: transparent;
    color: #1a1a1a;
    font: inherit;
    font-size: 0.9375rem;
    line-height: 1.5;
    min-height: 1.5rem;
    max-height: 120px;
    padding: 0.375rem 0;
  }

  .textarea::placeholder {
    color: #9ca3af;
  }

  .textarea:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .send-button {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border: none;
    border-radius: 50%;
    background: #dff0ff;
    color: var(--color-blue);
    cursor: pointer;
    transition: background 0.15s ease, transform 0.15s ease, opacity 0.15s ease;
  }

  .send-button:hover:not(:disabled) {
    background: #cce8ff;
    transform: scale(1.04);
  }

  .send-button:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
</style>
