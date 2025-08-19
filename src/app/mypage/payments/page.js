'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { useAuthStore } from '@/stores/authStore';

// 결제수단 관리 페이지
export default function PaymentsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedType, setSelectedType] = useState('card'); // card, account
  
  // 카드 폼 상태
  const [cardForm, setCardForm] = useState({
    nickname: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    isDefault: false
  });
  
  // 계좌 폼 상태  
  const [accountForm, setAccountForm] = useState({
    nickname: '',
    bankName: '',
    accountNumber: '',
    accountHolder: '',
    isDefault: false
  });
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    // 목 데이터 로드
    loadMockPaymentMethods();
  }, [isAuthenticated, router]);
  
  const loadMockPaymentMethods = () => {
    // TODO: API 연동 시 실제 데이터로 교체
    const mockPayments = [
      {
        id: 1,
        type: 'card',
        nickname: '주 카드',
        cardNumber: '****-****-****-1234',
        cardCompany: '신한카드',
        isDefault: true
      },
      {
        id: 2,
        type: 'account',
        nickname: '급여 통장',
        bankName: '국민은행',
        accountNumber: '***-***-***123',
        accountHolder: '김밀스택',
        isDefault: false
      }
    ];
    setPaymentMethods(mockPayments);
  };
  
  const handleCardChange = (field, value) => {
    setCardForm(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleAccountChange = (field, value) => {
    setAccountForm(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const formatCardNumber = (value) => {
    // 카드번호 포맷팅 (4자리씩 끊어서)
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join('-');
    } else {
      return v;
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (selectedType === 'card') {
      if (!cardForm.nickname || !cardForm.cardNumber || 
          !cardForm.expiryMonth || !cardForm.expiryYear) {
        alert('필수 항목을 모두 입력해주세요.');
        return;
      }
      
      const newCard = {
        id: Date.now(),
        type: 'card',
        nickname: cardForm.nickname,
        cardNumber: cardForm.cardNumber,
        cardCompany: '카드회사', // 실제로는 카드번호로 자동 인식
        isDefault: cardForm.isDefault
      };
      
      setPaymentMethods(prev => [...prev, newCard]);
    } else {
      if (!accountForm.nickname || !accountForm.bankName || 
          !accountForm.accountNumber || !accountForm.accountHolder) {
        alert('필수 항목을 모두 입력해주세요.');
        return;
      }
      
      const newAccount = {
        id: Date.now(),
        type: 'account',
        nickname: accountForm.nickname,
        bankName: accountForm.bankName,
        accountNumber: accountForm.accountNumber,
        accountHolder: accountForm.accountHolder,
        isDefault: accountForm.isDefault
      };
      
      setPaymentMethods(prev => [...prev, newAccount]);
    }
    
    resetForm();
    setShowModal(false);
  };
  
  const handleDelete = (id) => {
    if (confirm('정말로 삭제하시겠습니까?')) {
      setPaymentMethods(prev => prev.filter(method => method.id !== id));
    }
  };
  
  const handleSetDefault = (id) => {
    setPaymentMethods(prev => prev.map(method => ({
      ...method,
      isDefault: method.id === id
    })));
  };
  
  const resetForm = () => {
    setCardForm({
      nickname: '',
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      isDefault: false
    });
    setAccountForm({
      nickname: '',
      bankName: '',
      accountNumber: '',
      accountHolder: '',
      isDefault: false
    });
    setSelectedType('card');
  };
  
  const handleModalClose = () => {
    resetForm();
    setShowModal(false);
  };
  
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 loading-spinner"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background-black pb-20">
      <Header title="결제수단 관리" showBackButton />
      
      <main className="px-4 py-6">
        {/* 추가 버튼 */}
        <div className="mb-6">
          <Button
            onClick={() => setShowModal(true)}
            className="w-full"
          >
            새 결제수단 추가
          </Button>
        </div>
        
        {/* 결제수단 목록 */}
        {paymentMethods.length > 0 ? (
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <Card key={method.id} variant="default">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-text-white">{method.nickname}</h3>
                    {method.isDefault && (
                      <span className="px-2 py-1 bg-primary-red text-white text-xs rounded">
                        기본결제
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDelete(method.id)}
                      className="text-red-500 hover:text-red-400 text-sm"
                    >
                      삭제
                    </button>
                  </div>
                </div>
                
                {method.type === 'card' ? (
                  <div className="text-text-gray text-sm space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-5 bg-gradient-to-r from-primary-red to-red-500 rounded text-white text-xs flex items-center justify-center font-bold">
                        CARD
                      </div>
                      <span className="text-text-white font-medium">{method.cardCompany}</span>
                    </div>
                    <p className="font-mono">{method.cardNumber}</p>
                  </div>
                ) : (
                  <div className="text-text-gray text-sm space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                        BANK
                      </div>
                      <span className="text-text-white font-medium">{method.bankName}</span>
                    </div>
                    <p className="font-mono">{method.accountNumber}</p>
                    <p className="text-text-light-gray">{method.accountHolder}</p>
                  </div>
                )}
                
                {!method.isDefault && (
                  <div className="mt-3 pt-3 border-t border-border-gray">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(method.id)}
                    >
                      기본 결제수단으로 설정
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <Card variant="default">
            <div className="text-center py-8">
              <p className="text-text-gray mb-4">등록된 결제수단이 없습니다</p>
              <Button
                onClick={() => setShowModal(true)}
                size="sm"
              >
                결제수단 추가하기
              </Button>
            </div>
          </Card>
        )}
        
        {/* 안내 문구 */}
        <div className="mt-8 p-4 bg-card-dark-gray rounded-lg">
          <h3 className="text-text-white font-medium mb-2">💳 결제수단 안내</h3>
          <ul className="text-text-gray text-sm space-y-1">
            <li>• 신용카드, 체크카드, 계좌이체를 지원합니다</li>
            <li>• 결제 정보는 안전하게 암호화되어 저장됩니다</li>
            <li>• 기본 결제수단으로 자동 결제됩니다</li>
          </ul>
        </div>
      </main>
      
      {/* 결제수단 추가 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="w-full max-w-md bg-background-dark rounded-t-xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-text-white">
                새 결제수단 추가
              </h2>
              <button
                onClick={handleModalClose}
                className="text-text-gray hover:text-text-white"
              >
                ✕
              </button>
            </div>
            
            {/* 결제수단 타입 선택 */}
            <div className="flex mb-6 bg-card-gray rounded-lg p-1">
              <button
                type="button"
                onClick={() => setSelectedType('card')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  selectedType === 'card' 
                    ? 'bg-primary-red text-white' 
                    : 'text-text-gray hover:text-text-white'
                }`}
              >
                카드
              </button>
              <button
                type="button"
                onClick={() => setSelectedType('account')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  selectedType === 'account' 
                    ? 'bg-primary-red text-white' 
                    : 'text-text-gray hover:text-text-white'
                }`}
              >
                계좌
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {selectedType === 'card' ? (
                <>
                  <div>
                    <label className="block text-text-white text-sm font-medium mb-2">
                      카드 별명 *
                    </label>
                    <Input
                      type="text"
                      value={cardForm.nickname}
                      onChange={(e) => handleCardChange('nickname', e.target.value)}
                      placeholder="예: 주 카드, 생활비 카드"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-text-white text-sm font-medium mb-2">
                      카드 번호 *
                    </label>
                    <Input
                      type="text"
                      value={cardForm.cardNumber}
                      onChange={(e) => handleCardChange('cardNumber', formatCardNumber(e.target.value))}
                      placeholder="0000-0000-0000-0000"
                      maxLength="19"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-text-white text-sm font-medium mb-2">
                        유효기간(월) *
                      </label>
                      <Input
                        type="text"
                        value={cardForm.expiryMonth}
                        onChange={(e) => handleCardChange('expiryMonth', e.target.value)}
                        placeholder="MM"
                        maxLength="2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-text-white text-sm font-medium mb-2">
                        유효기간(년) *
                      </label>
                      <Input
                        type="text"
                        value={cardForm.expiryYear}
                        onChange={(e) => handleCardChange('expiryYear', e.target.value)}
                        placeholder="YY"
                        maxLength="2"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="cardDefault"
                      checked={cardForm.isDefault}
                      onChange={(e) => handleCardChange('isDefault', e.target.checked)}
                      className="w-4 h-4 accent-primary-red"
                    />
                    <label htmlFor="cardDefault" className="text-text-gray text-sm">
                      기본 결제수단으로 설정
                    </label>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-text-white text-sm font-medium mb-2">
                      계좌 별명 *
                    </label>
                    <Input
                      type="text"
                      value={accountForm.nickname}
                      onChange={(e) => handleAccountChange('nickname', e.target.value)}
                      placeholder="예: 주 통장, 급여 통장"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-text-white text-sm font-medium mb-2">
                      은행명 *
                    </label>
                    <select
                      value={accountForm.bankName}
                      onChange={(e) => handleAccountChange('bankName', e.target.value)}
                      className="w-full px-4 py-3 bg-card-gray border border-border-gray rounded-lg text-text-white focus:outline-none focus:border-primary-red"
                      required
                    >
                      <option value="">은행을 선택하세요</option>
                      <option value="국민은행">국민은행</option>
                      <option value="신한은행">신한은행</option>
                      <option value="우리은행">우리은행</option>
                      <option value="하나은행">하나은행</option>
                      <option value="농협은행">농협은행</option>
                      <option value="기업은행">기업은행</option>
                      <option value="카카오뱅크">카카오뱅크</option>
                      <option value="토스뱅크">토스뱅크</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-text-white text-sm font-medium mb-2">
                      계좌번호 *
                    </label>
                    <Input
                      type="text"
                      value={accountForm.accountNumber}
                      onChange={(e) => handleAccountChange('accountNumber', e.target.value)}
                      placeholder="계좌번호 (- 없이 입력)"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-text-white text-sm font-medium mb-2">
                      예금주명 *
                    </label>
                    <Input
                      type="text"
                      value={accountForm.accountHolder}
                      onChange={(e) => handleAccountChange('accountHolder', e.target.value)}
                      placeholder="예금주 이름"
                      required
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="accountDefault"
                      checked={accountForm.isDefault}
                      onChange={(e) => handleAccountChange('isDefault', e.target.checked)}
                      className="w-4 h-4 accent-primary-red"
                    />
                    <label htmlFor="accountDefault" className="text-text-gray text-sm">
                      기본 결제수단으로 설정
                    </label>
                  </div>
                </>
              )}
              
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleModalClose}
                  className="flex-1"
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                >
                  추가
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <BottomNav />
    </div>
  );
}