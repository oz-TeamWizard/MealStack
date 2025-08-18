// 공통 유틸리티 함수들

// 숫자를 한국어 통화 형식으로 포맷
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount);
};

// 숫자에 천 단위 구분자 추가
export const formatNumber = (num) => {
  return new Intl.NumberFormat('ko-KR').format(num);
};

// 전화번호 형식 검증
export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^010-\d{4}-\d{4}$/;
  return phoneRegex.test(phone);
};

// 전화번호 자동 포맷팅
export const formatPhoneNumber = (value) => {
  const numbers = value.replace(/[^0-9]/g, '');
  
  if (numbers.length <= 3) {
    return numbers;
  } else if (numbers.length <= 7) {
    return numbers.slice(0, 3) + '-' + numbers.slice(3);
  } else if (numbers.length <= 11) {
    return numbers.slice(0, 3) + '-' + numbers.slice(3, 7) + '-' + numbers.slice(7);
  }
  
  return numbers.slice(0, 3) + '-' + numbers.slice(3, 7) + '-' + numbers.slice(7, 11);
};

// 이메일 형식 검증
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 날짜를 한국어 형식으로 포맷
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...options
  };
  
  return new Intl.DateTimeFormat('ko-KR', defaultOptions).format(new Date(date));
};

// 상대 시간 표시 (예: 2시간 전, 3일 전)
export const formatRelativeTime = (date) => {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInMs = now - targetDate;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  
  if (diffInMinutes < 1) {
    return '방금 전';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  } else if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  } else if (diffInDays < 7) {
    return `${diffInDays}일 전`;
  } else {
    return formatDate(date);
  }
};

// 타이머 포맷 (MM:SS)
export const formatTimer = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// 디바운스 함수
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// 스로틀 함수
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// 로컬 스토리지 안전한 접근
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error getting localStorage key "${key}":`, error);
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};

// CSS 클래스 조건부 적용
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

// 객체 깊은 복사
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const copy = {};
    Object.keys(obj).forEach(key => {
      copy[key] = deepClone(obj[key]);
    });
    return copy;
  }
};

// 배열에서 중복 제거
export const removeDuplicates = (array, key = null) => {
  if (key) {
    const seen = new Set();
    return array.filter(item => {
      const keyValue = item[key];
      if (seen.has(keyValue)) {
        return false;
      }
      seen.add(keyValue);
      return true;
    });
  }
  return [...new Set(array)];
};

// 랜덤 ID 생성
export const generateId = (prefix = '') => {
  return prefix + Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// 주문 상태별 한글명 매핑
export const getOrderStatusText = (status) => {
  const statusMap = {
    pending: '주문접수',
    confirmed: '주문확인',
    preparing: '배송준비',
    shipping: '배송중',
    delivered: '배송완료',
    cancelled: '주문취소'
  };
  return statusMap[status] || status;
};

// 구독 상태별 한글명 매핑
export const getSubscriptionStatusText = (status) => {
  const statusMap = {
    active: '활성',
    paused: '일시정지',
    cancelled: '해지됨',
    expired: '만료됨'
  };
  return statusMap[status] || status;
};