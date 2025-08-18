// API 호출 유틸리티 함수들

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

class ApiClient {
  constructor() {
    this.baseURL = BASE_URL;
  }
  
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };
    
    // 토큰이 있으면 Authorization 헤더 추가
    const token = localStorage.getItem('mealstack_token');
    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }
    
    const config = {
      headers: defaultHeaders,
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };
    
    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
  
  get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, {
      method: 'GET',
    });
  }
  
  post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  
  put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
  
  delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

const apiClient = new ApiClient();

// Auth API
export const authApi = {
  sendSMS: (phoneNumber) => apiClient.post('/auth/send-sms', { phoneNumber }),
  verifySMS: (phoneNumber, code) => apiClient.post('/auth/verify-sms', { phoneNumber, code }),
  refreshToken: () => apiClient.post('/auth/refresh'),
  logout: () => apiClient.post('/auth/logout'),
};

// User API
export const userApi = {
  getProfile: () => apiClient.get('/user/profile'),
  updateProfile: (data) => apiClient.put('/user/profile', data),
  getOrders: (params) => apiClient.get('/user/orders', params),
  getSubscription: () => apiClient.get('/user/subscription'),
  updateSubscription: (data) => apiClient.put('/user/subscription', data),
  getAddresses: () => apiClient.get('/user/addresses'),
  addAddress: (data) => apiClient.post('/user/addresses', data),
  updateAddress: (id, data) => apiClient.put(`/user/addresses/${id}`, data),
  deleteAddress: (id) => apiClient.delete(`/user/addresses/${id}`),
};

// Product API
export const productApi = {
  getProducts: (params) => apiClient.get('/products', params),
  getProduct: (id) => apiClient.get(`/products/${id}`),
  getSubscriptionPlans: () => apiClient.get('/products/subscriptions'),
};

// Order API
export const orderApi = {
  createOrder: (data) => apiClient.post('/orders', data),
  getOrder: (id) => apiClient.get(`/orders/${id}`),
  cancelOrder: (id) => apiClient.put(`/orders/${id}/cancel`),
  trackOrder: (id) => apiClient.get(`/orders/${id}/tracking`),
};

// Payment API
export const paymentApi = {
  createPayment: (data) => apiClient.post('/payments', data),
  getPaymentMethods: () => apiClient.get('/payments/methods'),
  addPaymentMethod: (data) => apiClient.post('/payments/methods', data),
  deletePaymentMethod: (id) => apiClient.delete(`/payments/methods/${id}`),
};

export default apiClient;