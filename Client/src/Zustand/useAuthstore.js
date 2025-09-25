import { create } from "zustand";
import axios from "axios";
import crypto from "crypto"



let sessionId = Math.random().toString(36).substring(2);

let switchBetween = window.location.href.includes("localhost") ? "http://localhost:3000" : "https://lumo-1-pw6m.onrender.com";

let axiosInstance = axios.create({
  baseURL: switchBetween,
  withCredentials: true,  
});

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/api/checkAuth");

      if (res.data.status === "success") {

        console.log("User is authenticated" , res.data.status);
        set({
          user: res.data.user || null,
          isAuthenticated: !!res.data.user,
        });
      }

      
    } catch (error) {
        set({ user: null, isAuthenticated: false });
      console.log(error);
    }
  },

  logout : async () =>{
    try {
        await axiosInstance.post("/api/logout")

        window.location.href = "/"

        set({user: null , isAuthenticated : false})
    } catch (error) {
        console.log("error" , error)
    }
  },


Agent: async (message) => {
  try {
    const res = await axiosInstance.post("/api/talk", { message , sessionId});
    if (!res.data.success) {
      // Return structured error
      return { success: false, message: res.data.message };
    }
    return res.data.response; // normal response
  } catch (error) {
    console.log("Agent error:", error);
    let msg = "Something went wrong";

    if (error.response?.data?.message) {
      msg = error.response.data.message;
    } else if (error.message) {
      msg = error.message;
    }

    return { success: false, message: msg };
  }
},

}));
