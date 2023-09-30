import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types";

export interface AuthState {
   signedIn: boolean;
   user: User | null;
}

const initialState: AuthState = {
   signedIn: false,
   user: null,
};

const isAuthenticated = createSlice({
   name: "auth",
   initialState,
   reducers: {
      signInSuccess: (state, action: PayloadAction<User>) => {
         state.signedIn = true;
         state.user = action.payload;
      },
      signInFailed: (state, action: PayloadAction<string>) => {
         state.signedIn = false;
         state.user = null;
      },
      logOut: (state) => {
         state.signedIn = false;
         state.user = null;
      },
   },
});

export const { signInSuccess, signInFailed, logOut } = isAuthenticated.actions;

export default isAuthenticated.reducer;
