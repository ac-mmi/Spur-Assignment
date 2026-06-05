import { a4 as attr, e as escape_html, a5 as attr_class, a3 as derived, a6 as ensure_array_like, a7 as head } from "../../chunks/index.js";
import "clsx";
function ChatInput($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { disabled = false } = $$props;
    let value = "";
    $$renderer2.push(`<form class="input-form svelte-5wsbgm"><div class="input-wrapper svelte-5wsbgm"><textarea class="textarea svelte-5wsbgm" placeholder="Message support..." rows="1" maxlength="2000"${attr("disabled", disabled, true)} aria-label="Message input">`);
    const $$body = escape_html(value);
    if ($$body) {
      $$renderer2.push(`${$$body}`);
    }
    $$renderer2.push(`</textarea> <button type="submit" class="send-button svelte-5wsbgm"${attr("disabled", disabled || !value.trim(), true)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true"><path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.651 60.651 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.651 60.651 0 0 0 3.478 2.404Z"></path></svg> <span class="sr-only svelte-5wsbgm">Send message</span></button></div> <p class="hint svelte-5wsbgm">Press Enter to send, Shift+Enter for a new line</p></form>`);
  });
}
function MessageBubble($$renderer, $$props) {
  let { text, sender } = $$props;
  const isUser = derived(() => sender === "user");
  $$renderer.push(`<div${attr_class("row svelte-1e5n1dp", void 0, { "user": isUser(), "ai": !isUser() })}>`);
  if (!isUser()) {
    $$renderer.push("<!--[0-->");
    $$renderer.push(`<div class="avatar svelte-1e5n1dp" aria-hidden="true">AI</div>`);
  } else {
    $$renderer.push("<!--[-1-->");
  }
  $$renderer.push(`<!--]--> <div${attr_class("bubble svelte-1e5n1dp", void 0, { "user": isUser(), "ai": !isUser() })}><p class="svelte-1e5n1dp">${escape_html(text)}</p></div> `);
  if (isUser()) {
    $$renderer.push("<!--[0-->");
    $$renderer.push(`<div class="avatar user-avatar svelte-1e5n1dp" aria-hidden="true">You</div>`);
  } else {
    $$renderer.push("<!--[-1-->");
  }
  $$renderer.push(`<!--]--></div>`);
}
function ChatWindow($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let messages = [];
    let isLoading = false;
    let isSending = false;
    $$renderer2.push(`<div class="chat-window svelte-1jlre7m"><header class="header svelte-1jlre7m"><div class="header-content svelte-1jlre7m"><h1 class="svelte-1jlre7m">Customer Support</h1> <p class="subtitle svelte-1jlre7m">Ask anything — we're here to help</p></div></header> <div class="messages svelte-1jlre7m" aria-live="polite"${attr("aria-busy", isSending)}>`);
    if (messages.length === 0) {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<div class="empty-state svelte-1jlre7m"><div class="empty-icon svelte-1jlre7m" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="32" height="32"><path fill-rule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.402.75.75 0 0 0-.197 1.477 49.957 49.957 0 0 0 4.103.6c3.051 0 5.462-2.194 5.962-5.062a9.012 9.012 0 0 0 1.032-3.95V6.75c0-3.042-2.502-5.824-6.363-6.162A50.733 50.733 0 0 0 12 1.5c-2.653 0-5.216.376-7.586 1.084A6.5 6.5 0 0 0 4.848 2.771ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 3.75a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z" clip-rule="evenodd"></path><path d="M2.25 12c0-3.042 2.502-5.824 6.363-6.162A48.733 48.733 0 0 1 12 4.5c2.653 0 5.216.376 7.586 1.084.75.208 1.305.76 1.305 1.547v6.02c0 .787-.555 1.34-1.305 1.547A48.733 48.733 0 0 1 12 19.5c-2.653 0-5.216-.376-7.586-1.084-.75-.208-1.305-.76-1.305-1.547V12Z"></path></svg></div> <h2 class="svelte-1jlre7m">How can we help you today?</h2> <p class="svelte-1jlre7m">Start a conversation with our support agent.</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(messages);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let message = each_array[$$index];
        MessageBubble($$renderer2, { text: message.text, sender: message.sender });
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="scroll-anchor svelte-1jlre7m"></div></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <footer class="footer svelte-1jlre7m">`);
    ChatInput($$renderer2, { disabled: isLoading });
    $$renderer2.push(`<!----></footer></div>`);
  });
}
function ConversationItem($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { conversation, active } = $$props;
    $$renderer2.push(`<button type="button"${attr_class("conversation-item svelte-mf8ba8", void 0, { "active": active })}${attr("title", conversation.title)}><span class="title svelte-mf8ba8">${escape_html(conversation.title)}</span></button>`);
  });
}
function ConversationList($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { conversations, activeSessionId } = $$props;
    $$renderer2.push(`<div class="conversation-list svelte-10jhjw1">`);
    if (conversations.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="empty svelte-10jhjw1">No conversations yet</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(conversations);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let conversation = each_array[$$index];
        ConversationItem($$renderer2, {
          conversation,
          active: conversation.id === activeSessionId
        });
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function Sidebar($$renderer, $$props) {
  let {
    conversations,
    activeSessionId
  } = $$props;
  $$renderer.push(`<aside class="sidebar svelte-129hoe0"><div class="sidebar-header svelte-129hoe0"><h1 class="brand svelte-129hoe0">SpurMart</h1> <button type="button" class="new-chat-button svelte-129hoe0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true"><path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875A1.875 1.875 0 0 1 12.75 7.125V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z"></path><path d="M12.971 1.816A5.25 5.25 0 0 1 18 7.097v4.432a.75.75 0 0 1-1.28.53l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 .53-.22Z"></path></svg> New chat</button></div> `);
  ConversationList($$renderer, {
    conversations,
    activeSessionId
  });
  $$renderer.push(`<!----></aside>`);
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let conversations = [];
    let activeSessionId = null;
    head("1uha8ag", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Customer Support Chat</title>`);
      });
    });
    $$renderer2.push(`<main class="page svelte-1uha8ag">`);
    Sidebar($$renderer2, {
      conversations,
      activeSessionId
    });
    $$renderer2.push(`<!----> `);
    ChatWindow($$renderer2);
    $$renderer2.push(`<!----></main>`);
  });
}
export {
  _page as default
};
