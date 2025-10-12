import { createContext, useEffect, useState } from "react";
import React from 'react';
import axios from "axios";
import { toast } from 'react-hot-toast';
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUser, setOnlineUser] = useState([]);
    const [socket, setSocket] = useState(null);

    // Check if user is authenticated on app load, set the user data and connect the socket
    const checkAuth = async () => {
        try {
            const { data } = await axios.get("/api/auth/check");
            if (data.success) {
                setAuthUser(data.user);
                connectSocket(data.user);
            }
        } catch (error) {
            console.log("Auth check failed:", error.response?.data?.message || error.message);
        }
    };

    // Connect socket
    const connectSocket = (userData) => {
        if (!userData || socket?.connected) return;

        const newSocket = io(backendUrl, {
            query: { userId: userData._id, }
        });

        newSocket.connect();
        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (userIds) => {
            setOnlineUser(userIds);
        });
    };

    // Attach token to axios headers
    const setAuthHeader = (token) => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common["Authorization"];
        }
    };



    // Login or Signup
    const login = async (state, credentials) => {
        try {
            const { data } = await axios.post(`/api/auth/${state}`, credentials);

            if (data.success) {
                setAuthUser(data.userData);
                connectSocket(data.userData);
                setAuthHeader(data.token); // ✅ use helper
                setToken(data.token);
                localStorage.setItem("token", data.token);
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };


    // Logout
    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUser([]);
        setAuthHeader(null);
        toast.success("Logged out successfully");
        socket?.disconnect();
        setSocket(null);
    };


    // Update profile function to handle user profile updates
    const updateProfile = async (body) => {
        console.log("update context");
        try {
            const { data } = await axios.put("/api/auth/update-profile", body);
            if (data.success) {
                setAuthUser(data.user);
                toast.success("Profile Updated Successfully");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };



    useEffect(() => {
        if (token) {
            setAuthHeader(token);
            checkAuth();
        }
    }, []);



    const value = {
        axios,
        authUser,
        onlineUser,
        socket,
        login,
        logout,
        updateProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
