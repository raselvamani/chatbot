import React, {useState} from 'react';
import {Box, Card, CardContent, TextField, IconButton, Typography, Avatar, List, ListItem, ListItemAvatar, ListItemText} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import axios from 'axios';

interface Message {
    sender: "user" | "agent";
    text: any;
}

interface UserQuery {
    prompt: string;
}

const ChatbotUI: React.FC = () => {

    const [messages, setMessages] = useState<Message[]>([
        {sender: "agent", text: "Hello! How may i assist you today?"},
    ]);

    const [input, setInput] = useState<string>("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSend = async () => {
        if (input.trim() === "") {
            return;
        }

        const userMessage: Message = {sender: "user", text: input};

        setMessages((prev) => [...prev, userMessage]);

        setInput("");

        setLoading(true);
        setError(null);

        const payload: UserQuery = {
            prompt: input
        }

        try {
            const result = await axios.post("http://127.0.0.1:8000/rag/url", payload);
            // const result = await axios.post("http://127.0.0.1:8000/rag/pdf", payload);
            console.log('result with data: ', result.data);
            const response = result.data;
            const agentMessage: Message = {
                sender: "agent",
                text: response,
            };
            console.log("agentMessage: ", agentMessage);
            setMessages((prev)=> [...prev, agentMessage]);

        } catch(err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            bgcolor="#f5f5f5"
        >
            <Card sx={{width: "100%", maxWidth: 480, boxShadow: 3, borderRadius: 2}}>
                <CardContent>
                    <Typography variant='h6' gutterBottom>
                        Chat with Support Agent
                    </Typography>
                    <List sx={{height: 400, overflowY: "auto", bgcolor: "#f0f0f0", p: 2, borderRadius: 2}}>
                        {messages.map((message, index) => (
                            <ListItem 
                                key={index}
                                sx={{justifyContent: message.sender === 'user' ? "flex-end": "flex-start"}}
                            >
                                {
                                    message.sender === 'agent' && (
                                        <ListItemAvatar>
                                            <Avatar>
                                                <SupportAgentIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                    )
                                }
                                <ListItemText
                                    primary = {JSON.stringify(message.text)}
                                    sx = {{
                                        bgcolor: message.sender === "user" ? "#1976d2": "#e0e0e0",
                                        color: message.sender === "user" ? "#fff" : "#000",
                                        p: 1,
                                        borderRadius: 2,
                                        maxWidth: "75%"
                                    }}
                                />
                                {message.sender === "user" && (
                                    <ListItemAvatar>
                                        <Avatar>
                                            <PersonIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    )
                                }
                            </ListItem>
                        ))}
                    </List>
                    <Box display="flex" mt={2}>
                        <TextField
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            variant="outlined"
                            fullWidth
                            sx={{mr: 1}}
                        />
                        <IconButton
                            color="primary"
                            onClick={handleSend}
                            disabled={!input.trim() || loading}
                        >
                            <SendIcon />
                        </IconButton>
                        {error && (
                            <div>Error:{error}</div>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default ChatbotUI;

