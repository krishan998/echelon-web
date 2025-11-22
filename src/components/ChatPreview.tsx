// src/components/ChatPreview.tsx
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Sender = "user" | "bot";

type ChatMessage = {
  id: string;
  sender: Sender;
  text: string;
};

type ConversationSnippet = {
  id: string;
  messages: ChatMessage[];
};

type ChatPreviewProps = {
  snippets?: ConversationSnippet[];
  rotationIntervalMs?: number;
};

const DEFAULT_SNIPPETS: ConversationSnippet[] = [
  {
    id: "integrations",
    messages: [
      {
        id: "m1",
        sender: "user",
        text: "How would this work on my SaaS website?",
      },
      {
        id: "m2",
        sender: "bot",
        text: "Drop in one line of code and I become your AI SDR — answering questions about features, pricing, and integrations in real time.",
      },
    ],
  },
  {
    id: "comparison",
    messages: [
      {
        id: "m3",
        sender: "user",
        text: "What makes you better than a normal chatbot?",
      },
      {
        id: "m4",
        sender: "bot",
        text: "I don’t just match keywords — I understand your product, docs, and pricing to answer like a trained sales rep.",
      },
    ],
  },
  {
    id: "docs",
    messages: [
      {
        id: "m5",
        sender: "user",
        text: "Can I train you on my help center and sales docs?",
      },
      {
        id: "m6",
        sender: "bot",
        text: "Yes. Connect your docs, website, and playbooks — I’ll use them to answer prospects in their own words.",
      },
    ],
  },
];

export const ChatPreview: React.FC<ChatPreviewProps> = ({
  snippets = DEFAULT_SNIPPETS,
  rotationIntervalMs = 3500,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (snippets.length <= 1) return;

    const intervalId = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % snippets.length);
    }, rotationIntervalMs);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [snippets.length, rotationIntervalMs]);

  const activeSnippet = snippets[activeIndex];

  return (
    <div
      aria-label="Sample conversation preview"
      role="region"
      style={styles.wrapper}
    >
      <div style={styles.card}>
        <div style={styles.headerRow}>
          <span style={styles.pill}>Live preview</span>
          <span style={styles.mutedText}>What your visitors will see</span>
        </div>

        <div style={styles.chatWindow}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSnippet.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              style={styles.snippetLayer}
            >
              {activeSnippet.messages.map((message) => (
                <div
                  key={message.id}
                  style={{
                    ...styles.messageBase,
                    ...(message.sender === "user"
                      ? styles.userMessage
                      : styles.botMessage),
                  }}
                >
                  {message.text}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    width: "100%",
    maxWidth: 520,
    margin: "0 auto",
  },
  card: {
    position: "relative",
    borderRadius: 20,
    padding: "16px 18px 18px",
    background:
      "radial-gradient(circle at top left, rgba(80,80,255,0.15), transparent 55%), rgba(12,12,18,0.9)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 18px 45px rgba(0,0,0,0.45)",
    color: "#f9fafb",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
  },
  headerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 8,
  },
  pill: {
    fontSize: 11,
    textTransform: "uppercase" as const,
    letterSpacing: 0.08,
    padding: "4px 8px",
    borderRadius: 999,
    border: "1px solid rgba(148,163,184,0.8)",
    color: "#e5e7eb",
    background: "rgba(15,23,42,0.85)",
    whiteSpace: "nowrap" as const,
  },
  mutedText: {
    fontSize: 11,
    color: "rgba(148,163,184,0.9)",
    textAlign: "right" as const,
    flex: 1,
  },
  chatWindow: {
    position: "relative",
    minHeight: 120,
    paddingTop: 4,
    overflow: "hidden",
  },
  snippetLayer: {
    position: "absolute" as const,
    inset: 0,
    display: "flex",
    flexDirection: "column" as const,
    gap: 8,
  },
  messageBase: {
    maxWidth: "85%",
    borderRadius: 16,
    padding: "8px 10px",
    fontSize: 13,
    lineHeight: 1.4,
  },
  userMessage: {
    alignSelf: "flex-end",
    background:
      "linear-gradient(135deg, rgba(129,140,248,1), rgba(59,130,246,1))",
    color: "#f9fafb",
  },
  botMessage: {
    alignSelf: "flex-start",
    background: "rgba(15,23,42,0.9)",
    border: "1px solid rgba(148,163,184,0.35)",
    color: "#e5e7eb",
  },
};
