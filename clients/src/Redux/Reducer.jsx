import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

import axiosInstance from "../Helpers/axios.jsx"

const initialState = {
    isLoggedIn: localStorage.getItem("isLoggedIn")||false,
    // isLoggedIn:false,
    avatar:localStorage.getItem('avatar') || null,
    role: localStorage.getItem('role') || "",
    data: localStorage.getItem('data')=== undefined ? JSON.parse(localStorage.getItem('data')) : {},
    admindata:localStorage.getItem('admindata')=== undefined ? JSON.parse(localStorage.getItem('admindata')) : [],
    revenue:0,
    filteruser:localStorage.getItem('filterdata')=== undefined ? JSON.parse(localStorage.getItem('filterdata')) : []
};
export const addquestion = createAsyncThunk('question/update', async (data) => {
    try {
      const res = axiosInstance.post(`user/addquestion/${data}`)
      return (await res).data;    
      }
      catch (error) { 
          console.error(error);
          throw error;
      }
  });
export const admindatas=createAsyncThunk('auth/admindata',async(data)=>{
    try {
        const res = await axiosInstance.get('user/alldata', data);
        return res.data;
    } catch (error) {
        console.error(error);
        return error.response.data;
    }
})


export const createAccount = createAsyncThunk("/auth/signup", async (data) => {
    try {
        const res = axiosInstance.post("user/register", data);
        toast.promise(res, {
            loading: "Wait! creating your account",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to create account,Check all details carefully"
        });
        return (await res).data;
    } catch(error) {
        toast.error(error?.response?.data?.message);
    }
})
export const loginAccount=createAsyncThunk('auth/login',async(data)=>{
    try {
        const res=axiosInstance.post('user/login',data);
        toast.promise(
            res,{
                loading:"Wait! login to your account",
                success:(data)=>{
                    return data?.data?.message;
                },
                error:"Failed to login"
            }
        );
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        
    }
})
export const getUserData=createAsyncThunk('auth/getUserData',async(data)=>{
    try {
        const res = await axiosInstance.post('user/me', data);
        return res.data;
    } catch (error) {
        console.error(error);
        return error.response.data;
    }
})
export const logout=createAsyncThunk('auth/logout',async(data)=>{
 try {
       const res=axiosInstance.post('user/logout',data);
       toast.promise(
           res,
           {
               loading:"Wait! for logout",
               success:(data)=>{
                   return data?.data?.message
               },
               error:"Failed to logout"
           }
       );
       return (await res).data;
   }
  catch (error) {
    toast.error(error?.response?.data?.message);
    }
})
export const saveChanges=createAsyncThunk('auth/saveChanges',async(data)=>{
    try {
        const res=axiosInstance.post('user/change-details',data);
        toast.promise(
            res,{
                loading:"Wait! for saving your data",
                success:(data)=>{
                    return data?.data?.message;
                },
                error:"Failed to save your data"
            }
        );
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
});
export const ChangePassword=createAsyncThunk('auth/changePassword',async(data)=>{
    try {
        const response=axiosInstance.post('user/change-password',data);
        toast.promise(
            response,{
                loading:"Wait! for changing your password",
                success:(data)=>{
                    return data?.data?.message;
                },
                error:"Failed to change your password"
            }
        );
        console.log("response",response);
        return (await response).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    
        
    }
})

// Slice definition
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Add any additional reducers if needed
  },
  extraReducers:(builder)=>{
    builder.addCase(loginAccount.fulfilled,(state,action)=>{
        // om successful account creation
        state.isLoggedIn = true; // Set isLoggedIn to true upon successful creation
        state.data = action.payload.data;
        console.log(action?.payload?.data);
        state.role=action?.payload?.data?.role;
        state.avatar=action?.payload?.data?.avatar; 
        localStorage.setItem("avatar",action?.payload?.data?.avatar)// Update data with the payload returned from the API
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("data",JSON.stringify(action?.payload?.data))
        console.log(action?.payload?.data?.role);
        localStorage.setItem("role",action?.payload?.data?.role);

    })
    builder.addCase(logout.fulfilled,(state)=>{
        localStorage.clear();
        state.isLoggedIn=false;
        state.data={};
        state.role="";
    })
    builder.addCase(getUserData.fulfilled,(state,action)=>{
        // console.log(action.payload.data);
        state.data=action.payload.data;
        state.avatar=action.payload?.data?.avatar;
        state.role=action.payload?.data?.role;
        localStorage.setItem("data",JSON.stringify(action?.payload.data));
        localStorage.setItem("avatar",action?.payload?.data?.avatar);
        localStorage.setItem("role",action?.payload?.data?.role);
    })
    builder.addCase(addquestion.fulfilled, (state, action) => {
        console.log("action",action.payload);
        state.data=action.payload.data;
        localStorage.setItem("data",JSON.stringify(action?.payload.data));
         // Assuming action.payload is the new blog item
      }),
    builder.addCase(saveChanges.fulfilled,(state,action)=>{
        state.data=action.payload.data;
        // state.avatar=action.payload?.data?.avatar;
        localStorage.setItem("data",JSON.stringify(action?.payload.data));
        // localStorage.setItem("avatar",action?.payload?.data?.avatar);
    })
 
    builder.addCase(admindatas.fulfilled,(state,action)=>{
        state.admindata=action.payload.data;
        console.log("action hi",action.payload);
        localStorage.setItem("admindata",JSON.stringify(action?.payload.data));
    })
    
    
    
  
  }
    
    // Handle the createAccount.fulfilled action
    
//     // Handle the createAccount.rejected action
//     builder.addCase(createAccount.rejected, (state, action) => {
//       // Handle errors or state updates upon rejection (optional)
//       console.error("Create account failed:", action.error);
//     });
//   },
});

export default authSlice.reducer;
