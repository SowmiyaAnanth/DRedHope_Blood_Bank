import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Fab,
  Slide,
  CircularProgress
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SmartToyIcon from '@mui/icons-material/SmartToy';

const AIChatBox = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      content: 'Hello! I\'m your blood donation assistant. How can I help you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setLoading(true);

    try {
      // Simulate AI response (replace with actual AI API call)
      const aiResponse = await simulateAIResponse(userMessage);
      setMessages(prev => [...prev, { type: 'ai', content: aiResponse }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        type: 'ai', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const simulateAIResponse = async (message) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get current hour to determine time of day
    const currentHour = new Date().getHours();
    const timeOfDay = 
      currentHour >= 5 && currentHour < 12 ? "morning" :
      currentHour >= 12 && currentHour < 17 ? "afternoon" :
      currentHour >= 17 && currentHour < 22 ? "evening" :
      "night";

    // Handle greetings
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('good morning') || 
        lowerMessage.includes('morning') || 
        lowerMessage.includes('good afternoon') || 
        lowerMessage.includes('good evening') || 
        lowerMessage.includes('evening') || 
        lowerMessage.includes('good night') || 
        lowerMessage.includes('hi') || 
        lowerMessage.includes('hello')) {
      
      return `Good ${timeOfDay}! How may I assist you with blood donation today?`;
    }
    // Simple response logic for blood donation queries
    else if (lowerMessage.includes('eligibility') || lowerMessage.includes('eligible')) {
      return 'To be eligible for blood donation, you must be at least 18 years old, weigh more than 50kg, and be in good health. You should not have any disqualifying diseases like diabetes, tuberculosis, HIV, AIDS, heart disease, or cancer.';
    } else if (lowerMessage.includes('waiting period') || lowerMessage.includes('next donation')) {
      return 'After donating blood, you need to wait for 6 months before you can donate again. This waiting period is important for your health and to ensure the quality of donated blood.';
    } else if (lowerMessage.includes('benefits') || lowerMessage.includes('why donate')) {
      return 'Donating blood has many benefits: it helps save lives, reduces the risk of heart disease, burns calories, and can help detect certain health conditions. It\'s also a way to give back to your community.';
    } else if (lowerMessage.includes('process') || lowerMessage.includes('how to donate')) {
      return 'The blood donation process is simple: 1) Register and complete a health questionnaire, 2) Get a quick physical check-up, 3) Donate blood (takes about 10 minutes), 4) Rest and have refreshments. The entire process takes about an hour.';
    } else if (lowerMessage.includes('thank')) {
      return "You're welcome! Your interest in blood donation is truly appreciated. Is there anything else you'd like to know?";
    } else if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
      return "Goodbye! Thank you for your interest in blood donation. Have a great day!";
    } else {
      return 'I\'m here to help with any questions about blood donation. You can ask me about eligibility criteria, the donation process, waiting periods, or any other blood donation related topics.';
    }
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="chat"
        onClick={() => setOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          bgcolor: '#d32f2f',
          '&:hover': {
            bgcolor: '#b71c1c',
          },
        }}
      >
        <ChatIcon />
      </Fab>

      <Slide direction="up" in={open} mountOnEnter unmountOnExit>
        <Paper
          elevation={3}
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            width: 350,
            height: 500,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          {/* Chat Header */}
          <Box
            sx={{
              bgcolor: '#d32f2f',
              color: 'white',
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SmartToyIcon />
              <Typography variant="h6">Blood Donation Assistant</Typography>
            </Box>
            <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Chat Messages */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              bgcolor: '#f5f5f5',
            }}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                  gap: 1,
                }}
              >
                {message.type === 'ai' && (
                  <Avatar sx={{ bgcolor: '#d32f2f' }}>
                    <SmartToyIcon />
                  </Avatar>
                )}
                <Paper
                  sx={{
                    p: 1.5,
                    maxWidth: '80%',
                    bgcolor: message.type === 'user' ? '#d32f2f' : 'white',
                    color: message.type === 'user' ? 'white' : 'inherit',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body1">{message.content}</Typography>
                </Paper>
                {message.type === 'user' && (
                  <Avatar sx={{ bgcolor: '#1976d2' }}>
                    <ChatIcon />
                  </Avatar>
                )}
              </Box>
            ))}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 1 }}>
                <Avatar sx={{ bgcolor: '#d32f2f' }}>
                  <SmartToyIcon />
                </Avatar>
                <Paper sx={{ p: 1.5, borderRadius: 2 }}>
                  <CircularProgress size={20} />
                </Paper>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Chat Input */}
          <Box sx={{ p: 2, bgcolor: 'white', borderTop: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSend();
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <IconButton
                color="primary"
                onClick={handleSend}
                disabled={!input.trim() || loading}
                sx={{
                  bgcolor: '#d32f2f',
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#b71c1c',
                  },
                  '&.Mui-disabled': {
                    bgcolor: '#ffcdd2',
                    color: 'white',
                  },
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Slide>
    </>
  );
};

export default AIChatBox; 