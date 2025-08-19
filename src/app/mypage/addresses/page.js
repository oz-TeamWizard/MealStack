'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { useAuthStore } from '@/stores/authStore';

// 배송지 관리 페이지
export default function AddressesPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [addresses, setAddresses] = useState([]);
  
  // 배송지 폼 상태
  const [addressForm, setAddressForm] = useState({
    label: '',
    recipientName: '',
    phoneNumber: '',
    zipCode: '',
    address: '',
    detailAddress: '',
    isDefault: false
  });
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    // 목 데이터 로드
    loadMockAddresses();
  }, [isAuthenticated, router]);
  
  const loadMockAddresses = () => {
    // TODO: API 연동 시 실제 데이터로 교체
    const mockAddresses = [
      {
        id: 1,
        label: '집',
        recipientName: '김밀스택',
        phoneNumber: '010-1234-5678',
        zipCode: '06293',
        address: '서울특별시 강남구 테헤란로 123',
        detailAddress: '101호',
        isDefault: true
      },
      {
        id: 2,
        label: '회사',
        recipientName: '김밀스택',
        phoneNumber: '010-1234-5678',
        zipCode: '07327',
        address: '서울특별시 영등포구 여의대로 24',
        detailAddress: '5층',
        isDefault: false
      }
    ];
    setAddresses(mockAddresses);
  };
  
  const handleAddressChange = (field, value) => {
    setAddressForm(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!addressForm.label || !addressForm.recipientName || 
        !addressForm.phoneNumber || !addressForm.address) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }
    
    if (editingId) {
      // 수정
      setAddresses(prev => prev.map(addr => 
        addr.id === editingId ? { ...addressForm, id: editingId } : addr
      ));
    } else {
      // 추가
      const newAddress = {
        ...addressForm,
        id: Date.now()
      };
      setAddresses(prev => [...prev, newAddress]);
    }
    
    // 기본 배송지로 설정 시 다른 배송지들의 기본 설정 해제
    if (addressForm.isDefault) {
      setAddresses(prev => prev.map(addr => ({
        ...addr,
        isDefault: addr.id === editingId || addr.id === addressForm.id ? true : false
      })));
    }
    
    resetForm();
    setShowModal(false);
  };
  
  const handleEdit = (address) => {
    setAddressForm(address);
    setEditingId(address.id);
    setShowModal(true);
  };
  
  const handleDelete = (id) => {
    if (confirm('정말로 삭제하시겠습니까?')) {
      setAddresses(prev => prev.filter(addr => addr.id !== id));
    }
  };
  
  const handleSetDefault = (id) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };
  
  const resetForm = () => {
    setAddressForm({
      label: '',
      recipientName: '',
      phoneNumber: '',
      zipCode: '',
      address: '',
      detailAddress: '',
      isDefault: false
    });
    setEditingId(null);
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
      <Header title="배송지 관리" showBackButton />
      
      <main className="px-4 py-6">
        {/* 추가 버튼 */}
        <div className="mb-6">
          <Button
            onClick={() => setShowModal(true)}
            className="w-full"
          >
            새 배송지 추가
          </Button>
        </div>
        
        {/* 배송지 목록 */}
        {addresses.length > 0 ? (
          <div className="space-y-4">
            {addresses.map((address) => (
              <Card key={address.id} variant="default">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-text-white">{address.label}</h3>
                    {address.isDefault && (
                      <span className="px-2 py-1 bg-primary-red text-white text-xs rounded">
                        기본배송지
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(address)}
                      className="text-text-gray hover:text-text-white text-sm"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="text-red-500 hover:text-red-400 text-sm"
                    >
                      삭제
                    </button>
                  </div>
                </div>
                
                <div className="text-text-gray text-sm space-y-1">
                  <p className="text-text-white font-medium">{address.recipientName}</p>
                  <p>{address.phoneNumber}</p>
                  <p>({address.zipCode}) {address.address}</p>
                  {address.detailAddress && <p>{address.detailAddress}</p>}
                </div>
                
                {!address.isDefault && (
                  <div className="mt-3 pt-3 border-t border-border-gray">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(address.id)}
                    >
                      기본배송지로 설정
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <Card variant="default">
            <div className="text-center py-8">
              <p className="text-text-gray mb-4">등록된 배송지가 없습니다</p>
              <Button
                onClick={() => setShowModal(true)}
                size="sm"
              >
                배송지 추가하기
              </Button>
            </div>
          </Card>
        )}
      </main>
      
      {/* 배송지 추가/수정 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="w-full max-w-md bg-background-dark rounded-t-xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-text-white">
                {editingId ? '배송지 수정' : '새 배송지 추가'}
              </h2>
              <button
                onClick={handleModalClose}
                className="text-text-gray hover:text-text-white"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-text-white text-sm font-medium mb-2">
                  배송지 이름 *
                </label>
                <Input
                  type="text"
                  value={addressForm.label}
                  onChange={(e) => handleAddressChange('label', e.target.value)}
                  placeholder="예: 집, 회사"
                  required
                />
              </div>
              
              <div>
                <label className="block text-text-white text-sm font-medium mb-2">
                  받는 분 *
                </label>
                <Input
                  type="text"
                  value={addressForm.recipientName}
                  onChange={(e) => handleAddressChange('recipientName', e.target.value)}
                  placeholder="받는 분 이름"
                  required
                />
              </div>
              
              <div>
                <label className="block text-text-white text-sm font-medium mb-2">
                  연락처 *
                </label>
                <Input
                  type="tel"
                  value={addressForm.phoneNumber}
                  onChange={(e) => handleAddressChange('phoneNumber', e.target.value)}
                  placeholder="010-0000-0000"
                  required
                />
              </div>
              
              <div>
                <label className="block text-text-white text-sm font-medium mb-2">
                  우편번호
                </label>
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    value={addressForm.zipCode}
                    onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                    placeholder="우편번호"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => alert('우편번호 검색 기능은 준비중입니다.')}
                  >
                    검색
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="block text-text-white text-sm font-medium mb-2">
                  주소 *
                </label>
                <Input
                  type="text"
                  value={addressForm.address}
                  onChange={(e) => handleAddressChange('address', e.target.value)}
                  placeholder="기본 주소"
                  required
                />
              </div>
              
              <div>
                <label className="block text-text-white text-sm font-medium mb-2">
                  상세 주소
                </label>
                <Input
                  type="text"
                  value={addressForm.detailAddress}
                  onChange={(e) => handleAddressChange('detailAddress', e.target.value)}
                  placeholder="상세 주소 (동, 호수 등)"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={addressForm.isDefault}
                  onChange={(e) => handleAddressChange('isDefault', e.target.checked)}
                  className="w-4 h-4 accent-primary-red"
                />
                <label htmlFor="isDefault" className="text-text-gray text-sm">
                  기본 배송지로 설정
                </label>
              </div>
              
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
                  {editingId ? '수정' : '추가'}
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