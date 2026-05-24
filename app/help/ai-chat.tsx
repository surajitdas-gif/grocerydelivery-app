import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';

import { router } from 'expo-router';

type Message = {
  id: string;
  from: 'user' | 'bot';
  text: string;
  time: string;
};

const BOT_NAME = 'Pepper';

const QUICK_REPLIES = [
  'Track my order',
  'Cancel an order',
  'Payment issue',
  'Change delivery address',
  'Talk to a human',
];

const now = () => {
  const d = new Date();

  return `${d.getHours()}:${String(
    d.getMinutes()
  ).padStart(2, '0')}`;
};

const WELCOME_MESSAGE: Message = {
  id: '0',
  from: 'bot',
  text:
    `Hi! I'm ${BOT_NAME} 🌿\n\n` +
    `I am your AI support assistant.\n` +
    `How can I help you today?`,
  time: now(),
};

export default function ContactChatScreen() {

  const [messages, setMessages] = useState<Message[]>([
    WELCOME_MESSAGE,
  ]);

  const [input, setInput] = useState('');

  const [isTyping, setIsTyping] = useState(false);

  const [showQuickReplies, setShowQuickReplies] =
    useState(true);

  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({
      animated: true,
    });
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {

    const trimmed = text.trim();

    if (!trimmed) return;

    setShowQuickReplies(false);

    setInput('');

    const userMsg: Message = {
      id: Date.now().toString(),
      from: 'user',
      text: trimmed,
      time: now(),
    };

    setMessages(prev => [...prev, userMsg]);

    setIsTyping(true);

    try {

      const response = await fetch(
        'https://grocerydelivery-backend.onrender.com/chat',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            message: trimmed,
          }),
        }
      );

      const data = await response.json();

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        from: 'bot',
        text:
          data.reply ||
          'No response from AI',
        time: now(),
      };

      setMessages(prev => [
        ...prev,
        botMsg,
      ]);

    } catch (error) {

      console.log(error);

      const errorMsg: Message = {
        id: (Date.now() + 2).toString(),
        from: 'bot',
        text:
          'Unable to connect to AI server.',
        time: now(),
      };

      setMessages(prev => [
        ...prev,
        errorMsg,
      ]);

    } finally {

      setIsTyping(false);

    }
  };

  return (
    <SafeAreaView style={styles.safe}>

      {/* Header */}

      <View style={styles.header}>

        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
        >
          <Text style={styles.backArrow}>
            ‹
          </Text>
        </TouchableOpacity>

        <View style={styles.botInfo}>

          <View style={styles.botAvatar}>
            <Text style={styles.botAvatarText}>
              🤖
            </Text>
          </View>

          <View>

            <Text style={styles.botName}>
              {BOT_NAME}
            </Text>

            <View style={styles.onlineRow}>

              <View style={styles.onlineDot} />

              <Text style={styles.onlineText}>
                Online · AI Assistant
              </Text>

            </View>

          </View>

        </View>

      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >

        {/* Messages */}

        <ScrollView
          ref={scrollRef}
          style={styles.messages}
          contentContainerStyle={
            styles.messagesContent
          }
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({
              animated: true,
            })
          }
        >

          {messages.map(msg => (

            <View
              key={msg.id}
              style={[
                styles.msgRow,
                msg.from === 'user'
                  ? styles.msgRowUser
                  : styles.msgRowBot,
              ]}
            >

              {msg.from === 'bot' && (
                <View
                  style={
                    styles.msgAvatarSmall
                  }
                >
                  <Text
                    style={{ fontSize: 13 }}
                  >
                    🤖
                  </Text>
                </View>
              )}

              <View
                style={[
                  styles.bubble,
                  msg.from === 'user'
                    ? styles.bubbleUser
                    : styles.bubbleBot,
                ]}
              >

                <Text
                  style={
                    msg.from === 'user'
                      ? styles.bubbleUserText
                      : styles.bubbleBotText
                  }
                >
                  {msg.text}
                </Text>

                <Text
                  style={[
                    styles.timeText,
                    {
                      textAlign:
                        msg.from === 'user'
                          ? 'right'
                          : 'left',
                    },
                  ]}
                >
                  {msg.time}
                </Text>

              </View>

            </View>

          ))}

          {isTyping && (

            <View
              style={[
                styles.msgRow,
                styles.msgRowBot,
              ]}
            >

              <View
                style={
                  styles.msgAvatarSmall
                }
              >
                <Text style={{ fontSize: 13 }}>
                  🤖
                </Text>
              </View>

              <View
                style={[
                  styles.bubble,
                  styles.bubbleBot,
                  styles.typingBubble,
                ]}
              >

                <ActivityIndicator
                  size="small"
                  color="#2d7a4f"
                />

                <Text
                  style={styles.typingText}
                >
                  Pepper is typing…
                </Text>

              </View>

            </View>

          )}

          {/* Quick Replies */}

          {showQuickReplies && (

            <View style={styles.quickSection}>

              <Text style={styles.quickLabel}>
                Common questions
              </Text>

              <View style={styles.quickWrap}>

                {QUICK_REPLIES.map(q => (

                  <TouchableOpacity
                    key={q}
                    style={styles.quickChip}
                    onPress={() =>
                      sendMessage(q)
                    }
                    activeOpacity={0.75}
                  >

                    <Text
                      style={
                        styles.quickChipText
                      }
                    >
                      {q}
                    </Text>

                  </TouchableOpacity>

                ))}

              </View>

            </View>

          )}

        </ScrollView>

        {/* Input */}

        <View style={styles.inputBar}>

          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type a message..."
            placeholderTextColor="#9ca3af"
            returnKeyType="send"
            onSubmitEditing={() =>
              sendMessage(input)
            }
            multiline
          />

          <TouchableOpacity
            style={[
              styles.sendBtn,
              !input.trim() &&
                styles.sendBtnDisabled,
            ]}
            onPress={() =>
              sendMessage(input)
            }
            activeOpacity={0.8}
            disabled={!input.trim()}
          >

            <Text style={styles.sendIcon}>
              ↑
            </Text>

          </TouchableOpacity>

        </View>

      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  safe: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },

  header: {
    backgroundColor: '#0f2d1f',
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  backBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backArrow: {
    color: '#fff',
    fontSize: 30,
    lineHeight: 32,
    fontWeight: '300',
  },

  botInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },

  botAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2d7a4f',
    justifyContent: 'center',
    alignItems: 'center',
  },

  botAvatarText: {
    fontSize: 20,
  },

  botName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },

  onlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },

  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#4ade80',
  },

  onlineText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 11,
  },

  messages: {
    flex: 1,
  },

  messagesContent: {
    padding: 16,
    paddingBottom: 8,
    gap: 8,
  },

  msgRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 6,
  },

  msgRowUser: {
    justifyContent: 'flex-end',
  },

  msgRowBot: {
    justifyContent: 'flex-start',
  },

  msgAvatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#d1fae5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  bubble: {
    maxWidth: '78%',
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },

  bubbleBot: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 4,
  },

  bubbleUser: {
    backgroundColor: '#0f2d1f',
    borderBottomRightRadius: 4,
  },

  bubbleBotText: {
    color: '#111827',
    fontSize: 14,
    lineHeight: 20,
  },

  bubbleUserText: {
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 20,
  },

  timeText: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 4,
  },

  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  typingText: {
    fontSize: 12,
    color: '#9ca3af',
  },

  quickSection: {
    marginTop: 12,
  },

  quickLabel: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 8,
  },

  quickWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  quickChip: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#d1fae5',
  },

  quickChipText: {
    color: '#0f2d1f',
    fontSize: 13,
    fontWeight: '600',
  },

  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    padding: 12,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
  },

  input: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    borderRadius: 22,
    paddingVertical: 11,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#111827',
    maxHeight: 100,
  },

  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#0f2d1f',
    justifyContent: 'center',
    alignItems: 'center',
  },

  sendBtnDisabled: {
    backgroundColor: '#d1d5db',
  },

  sendIcon: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },

});