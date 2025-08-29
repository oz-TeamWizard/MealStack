'use client';

import { useState } from 'react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';

export default function MenuCustomizationModal({ 
  isOpen, 
  onClose, 
  currentPreferences, 
  onUpdatePreferences 
}) {
  const [allergies, setAllergies] = useState(currentPreferences?.allergies || []);
  const [dislikes, setDislikes] = useState(currentPreferences?.dislikes || []);
  const [preferences, setPreferences] = useState(currentPreferences?.preferences || []);

  const allergyOptions = [
    '견과류', '갑각류', '우유', '달걀', '대두', '밀', '생선', '조개류'
  ];

  const dislikeOptions = [
    '매운맛', '단맛', '짠맛', '신맛', '기름진 음식', '생선', '해산물', 
    '나물류', '버섯류', '콩류', '치즈', '양념치킨'
  ];

  const preferenceOptions = [
    '단백질 위주', '저탄수화물', '저염식', '채식 위주', '다이어트식', 
    '근력 증가', '체중 증가', '균형 잡힌 식단', '한식 위주', '양식 위주'
  ];

  const toggleSelection = (item, currentList, setList) => {
    if (currentList.includes(item)) {
      setList(currentList.filter(i => i !== item));
    } else {
      setList([...currentList, item]);
    }
  };

  const handleSave = () => {
    const newPreferences = {
      allergies,
      dislikes,
      preferences
    };
    
    onUpdatePreferences(newPreferences);
    alert('메뉴 선호도가 저장되었습니다. 다음 주문부터 반영됩니다.');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
      <div className="w-full max-w-md bg-background-black rounded-t-xl p-6 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-text-white">메뉴 커스터마이징</h2>
          <button
            onClick={onClose}
            className="text-text-gray hover:text-text-white"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* 알러지 정보 */}
          <div>
            <h3 className="text-text-white font-medium mb-3">
              알러지 정보 <span className="text-red-500">*</span>
            </h3>
            <p className="text-text-gray text-sm mb-3">
              알러지가 있는 재료를 선택해주세요. 해당 재료가 포함된 메뉴는 제외됩니다.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {allergyOptions.map((allergy) => (
                <button
                  key={allergy}
                  onClick={() => toggleSelection(allergy, allergies, setAllergies)}
                  className={`
                    p-3 rounded-lg border text-sm transition-colors
                    ${allergies.includes(allergy)
                      ? 'border-red-500 bg-red-500 text-white'
                      : 'border-border-gray bg-card-gray text-text-white hover:border-red-300'
                    }
                  `}
                >
                  {allergy}
                </button>
              ))}
            </div>
            {allergies.length > 0 && (
              <div className="mt-2 p-2 bg-red-900 bg-opacity-20 rounded text-red-300 text-xs">
                선택된 알러지: {allergies.join(', ')}
              </div>
            )}
          </div>

          {/* 제외하고 싶은 메뉴 */}
          <div>
            <h3 className="text-text-white font-medium mb-3">제외하고 싶은 메뉴</h3>
            <p className="text-text-gray text-sm mb-3">
              선호하지 않는 맛이나 음식을 선택해주세요.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {dislikeOptions.map((dislike) => (
                <button
                  key={dislike}
                  onClick={() => toggleSelection(dislike, dislikes, setDislikes)}
                  className={`
                    p-3 rounded-lg border text-sm transition-colors
                    ${dislikes.includes(dislike)
                      ? 'border-yellow-500 bg-yellow-500 text-black'
                      : 'border-border-gray bg-card-gray text-text-white hover:border-yellow-300'
                    }
                  `}
                >
                  {dislike}
                </button>
              ))}
            </div>
          </div>

          {/* 선호 메뉴 */}
          <div>
            <h3 className="text-text-white font-medium mb-3">선호 메뉴 스타일</h3>
            <p className="text-text-gray text-sm mb-3">
              선호하는 식단 스타일을 선택해주세요. (최대 3개)
            </p>
            <div className="grid grid-cols-2 gap-2">
              {preferenceOptions.map((preference) => (
                <button
                  key={preference}
                  onClick={() => {
                    if (preferences.includes(preference)) {
                      toggleSelection(preference, preferences, setPreferences);
                    } else if (preferences.length < 3) {
                      toggleSelection(preference, preferences, setPreferences);
                    } else {
                      alert('최대 3개까지만 선택 가능합니다.');
                    }
                  }}
                  disabled={!preferences.includes(preference) && preferences.length >= 3}
                  className={`
                    p-3 rounded-lg border text-sm transition-colors
                    ${preferences.includes(preference)
                      ? 'border-primary-red bg-primary-red text-white'
                      : preferences.length >= 3
                      ? 'border-border-gray bg-card-dark-gray text-text-light-gray cursor-not-allowed'
                      : 'border-border-gray bg-card-gray text-text-white hover:border-primary-red'
                    }
                  `}
                >
                  {preference}
                </button>
              ))}
            </div>
            <div className="mt-2 text-xs text-text-gray">
              선택된 선호도: {preferences.length}/3
            </div>
          </div>

          {/* 주의사항 */}
          <Card variant="default" className="bg-card-dark-gray">
            <div className="text-sm text-text-gray space-y-1">
              <h4 className="font-medium text-text-white mb-2">주의사항</h4>
              <p>• 알러지 정보는 정확하게 입력해주세요</p>
              <p>• 메뉴 구성에 따라 일부 선호도가 반영되지 않을 수 있습니다</p>
              <p>• 변경사항은 다음 주문부터 반영됩니다</p>
              <p>• 심각한 알러지가 있는 경우 고객센터로 별도 문의해주세요</p>
            </div>
          </Card>

          {/* 저장 버튼 */}
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1"
            >
              저장하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}