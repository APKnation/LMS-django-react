import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export interface Order {
  id: number;
  student: number;
  student_name: string;
  course: number;
  course_title: string;
  coupon?: number;
  original_price: string;
  discount_amount: string;
  final_price: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  created_at: string;
  completed_at?: string;
}

export interface Coupon {
  id: number;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: string;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
}

export interface InstructorPayout {
  id: number;
  instructor: number;
  instructor_name: string;
  amount: string;
  period_start: string;
  period_end: string;
  status: 'pending' | 'processed' | 'failed';
  created_at: string;
  processed_at?: string;
}

interface PaymentsState {
  orders: Order[];
  coupons: Coupon[];
  payouts: InstructorPayout[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: PaymentsState = {
  orders: [],
  coupons: [],
  payouts: [],
  currentOrder: null,
  isLoading: false,
  error: null,
};

export const createOrder = createAsyncThunk(
  'payments/createOrder',
  async ({ courseId, couponCode }: { courseId: number; couponCode?: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { token: string | null } };
      const token = state.auth.token;
      
      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await axios.post(
        `${API_BASE_URL}/orders/`,
        { course: courseId, coupon_code: couponCode || '' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to create order');
    }
  }
);

export const checkoutOrder = createAsyncThunk(
  'payments/checkoutOrder',
  async (orderId: number, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { token: string | null } };
      const token = state.auth.token;
      
      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await axios.post(
        `${API_BASE_URL}/orders/${orderId}/checkout/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to checkout');
    }
  }
);

export const confirmPayment = createAsyncThunk(
  'payments/confirmPayment',
  async (paymentIntentId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { token: string | null } };
      const token = state.auth.token;
      
      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await axios.post(
        `${API_BASE_URL}/orders/confirm_payment/`,
        { payment_intent_id: paymentIntentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to confirm payment');
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  'payments/fetchMyOrders',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { token: string | null } };
      const token = state.auth.token;
      
      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await axios.get(`${API_BASE_URL}/orders/my_orders/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch orders');
    }
  }
);

export const validateCoupon = createAsyncThunk(
  'payments/validateCoupon',
  async ({ code, courseId }: { code: string; courseId: number }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/coupons/validate/`, {
        code,
        course_id: courseId
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Invalid coupon');
    }
  }
);

export const fetchMyPayouts = createAsyncThunk(
  'payments/fetchMyPayouts',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { token: string | null } };
      const token = state.auth.token;
      
      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await axios.get(`${API_BASE_URL}/payouts/my_payouts/`, {
        headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch payouts');
    }
  }
);

export const fetchRevenueSummary = createAsyncThunk(
  'payments/fetchRevenueSummary',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { token: string | null } };
      const token = state.auth.token;
      
      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await axios.get(`${API_BASE_URL}/payouts/revenue_summary/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch revenue summary');
    }
  }
);

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Checkout
      .addCase(checkoutOrder.fulfilled, (state, action) => {
        state.currentOrder = action.payload.order;
      })
      // Confirm payment
      .addCase(confirmPayment.fulfilled, (state, action) => {
        if (state.currentOrder) {
          state.currentOrder = action.payload.order;
        }
      })
      // Fetch orders
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      // Validate coupon
      .addCase(validateCoupon.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Fetch payouts
      .addCase(fetchMyPayouts.fulfilled, (state, action) => {
        state.payouts = action.payload;
      })
      // Fetch revenue summary
      .addCase(fetchRevenueSummary.fulfilled, (state, action) => {
        // Store revenue data in a separate property if needed
      });
  },
});

export const { clearError, clearCurrentOrder } = paymentsSlice.actions;
export default paymentsSlice.reducer;
