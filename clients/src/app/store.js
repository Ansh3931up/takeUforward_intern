import { configureStore } from "@reduxjs/toolkit";

import { questionSlice } from "../Redux/Blog";
// irt { RazorPaySlice } from "../Redux/RazorPaySlice";
import { authSlice } from "../Redux/Reducer";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer, // Define your slice reducer here
    question:questionSlice.reducer,
    
  },
});
