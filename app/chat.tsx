
import { useState, useEffect } from "react"
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { sendMessage } from "@/lib/geminiChat"
import Colors from "@/constants/Colors"

interface Message {
  id: number
  text: string
  sender: "user" | "dispatcher"
  timestamp: Date
}

export default function EmergencyChat() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [context, setContext] = useState("")

  useEffect(() => {
    // Add initial message from the dispatcher
    setMessages([
      {
        id: 1,
        text: "This is 911. Please state your emergency.",
        sender: "dispatcher",
        timestamp: new Date(),
      },
    ])
  }, [])

  const handleSend = async () => {
    if (input.trim() === "") return

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prevMessages) => [...prevMessages, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await sendMessage(input, context)

      const dispatcherMessage: Message = {
        id: messages.length + 2,
        text: response.response,
        sender: "dispatcher",
        timestamp: new Date(response.timestamp),
      }

      setMessages((prevMessages) => [...prevMessages, dispatcherMessage])

      // Update context with the new message exchange
      setContext((prevContext) => prevContext + `\nUser: ${input}\nDispatcher: ${response.response}`)
    } catch (error) {
      console.error("Error sending message to Gemini:", error)
      // Handle error (e.g., show an error message to the user)
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.statusBanner}>
          <Text style={styles.statusText}>ACTIVE EMERGENCY - DISPATCHER CONNECTED</Text>
        </View>

        <View style={styles.dispatcherInfo}>
          <View style={styles.dispatcherIcon}>
            <Ionicons name="call" size={24} color="#e11d48" />
          </View>
          <View>
            <Text style={styles.dispatcherName}>911 Dispatcher</Text>
            <Text style={styles.dispatcherStatus}>Online - Emergency Line</Text>
          </View>
        </View>

        <ScrollView style={styles.chatContainer} contentContainerStyle={styles.chatContentContainer}>
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageWrapper,
                message.sender === "user" ? styles.userMessageWrapper : styles.dispatcherMessageWrapper,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  message.sender === "user" ? styles.userMessageBubble : styles.dispatcherMessageBubble,
                ]}
              >
                <Text style={message.sender === "user" ? styles.userMessageText : styles.dispatcherMessageText}>
                  {message.text}
                </Text>
              </View>
              <Text style={styles.messageTime}>{formatTime(message.timestamp)}</Text>
            </View>
          ))}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#e11d48" />
              <Text style={styles.loadingText}>Dispatcher is typing...</Text>
            </View>
          )}
        </ScrollView>

        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={input}
              onChangeText={setInput}
              placeholder="Type your message..."
              multiline
            />
            <TouchableOpacity onPress={handleSend} style={[styles.sendButton, {backgroundColor : input.trim() === "" ? Colors.grey : "#e11d48"}]} disabled={input.trim() !==  "" && isLoading}>
              <Ionicons name="send" size={18} color="white" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

       
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  statusBanner: {
    backgroundColor: "#e11d48",
    padding: 8,
  },
  statusText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  dispatcherInfo: {
    backgroundColor: "white",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  dispatcherIcon: {
    width: 48,
    height: 48,
    backgroundColor: "#ffebee",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  dispatcherName: {
    fontWeight: "bold",
    fontSize: 18,
  },
  dispatcherStatus: {
    color: "#4caf50",
    fontSize: 14,
  },
  chatContainer: {
    flex: 1,
    padding: 16,
  },
  chatContentContainer: {
    paddingBottom: 20,
  },
  messageWrapper: {
    marginBottom: 16,
    maxWidth: "80%",
  },
  userMessageWrapper: {
    alignSelf: "flex-end",
    marginLeft: "auto",
  },
  dispatcherMessageWrapper: {
    alignSelf: "flex-start",
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
  },
  userMessageBubble: {
    backgroundColor: "#e11d48",
    borderTopRightRadius: 0,
  },
  dispatcherMessageBubble: {
    backgroundColor: "#e0e0e0",
    borderTopLeftRadius: 0,
  },
  userMessageText: {
    color: "white",
  },
  dispatcherMessageText: {
    color: "#333333",
  },
  messageTime: {
    fontSize: 12,
    color: "#9e9e9e",
    marginTop: 4,
  },
  inputContainer: {
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    // backgroundColor: "#e11d48",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  loadingText: {
    marginLeft: 8,
    color: "#666",
  },
})

