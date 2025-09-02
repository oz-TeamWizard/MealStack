'use client';

import { useState } from 'react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';

export default function DeliveryScheduleModal({ 
  isOpen, 
  onClose, 
  currentSchedule, 
  onUpdateSchedule 
}) {
  const [selectedDay, setSelectedDay] = useState(currentSchedule?.deliveryDay || 4);
  const [selectedTime, setSelectedTime] = useState(currentSchedule?.deliveryTime || 'morning');

  const weekDays = [
    { value: 1, label: '월요일', available: true },
    { value: 2, label: '화요일', available: true },
    { value: 3, label: '수요일', available: true },
    { value: 4, label: '목요일', available: true },
    { value: 5, label: '금요일', available: true },
    { value: 6, label: '토요일', available: false }, // 주말 배송 불가
  ];

  const timeSlots = [
    { value: 'morning', label: '오전 (9:00 - 12:00)' },
    { value: 'afternoon', label: '오후 (13:00 - 18:00)' }
  ];

  const handleSave = () => {
    const newSchedule = {
      day: selectedDay,
      time: selectedTime,
      address: currentSchedule?.deliveryAddress
    };
    
    onUpdateSchedule(newSchedule);
    alert('배송 일정이 변경되었습니다. 다음 배송부터 적용됩니다.');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
      <div className="w-full max-w-md bg-background-black rounded-t-xl p-6 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-text-white">배송 일정 변경</h2>
          <button
            onClick={onClose}
            className="text-text-gray hover:text-text-white"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* 배송 요일 선택 */}
          <div>
            <h3 className="text-text-white font-medium mb-3">배송 요일</h3>
            <div className="grid grid-cols-2 gap-3">
              {weekDays.map((day) => (
                <button
                  key={day.value}
                  onClick={() => day.available && setSelectedDay(day.value)}
                  disabled={!day.available}
                  className={`
                    p-3 rounded-lg border text-sm font-medium transition-colors
                    ${day.available 
                      ? selectedDay === day.value
                        ? 'border-primary-red bg-primary-red text-white'
                        : 'border-border-gray bg-card-gray text-text-white hover:border-primary-red'
                      : 'border-border-gray bg-card-dark-gray text-text-light-gray cursor-not-allowed'
                    }
                  `}
                >
                  {day.label}
                  {!day.available && (
                    <div className="text-xs mt-1">배송 불가</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 배송 시간대 선택 */}
          <div>
            <h3 className="text-text-white font-medium mb-3">배송 시간대</h3>
            <div className="space-y-3">
              {timeSlots.map((slot) => (
                <button
                  key={slot.value}
                  onClick={() => setSelectedTime(slot.value)}
                  className={`
                    w-full p-4 rounded-lg border text-left transition-colors
                    ${selectedTime === slot.value
                      ? 'border-primary-red bg-primary-red text-white'
                      : 'border-border-gray bg-card-gray text-text-white hover:border-primary-red'
                    }
                  `}
                >
                  <div className="font-medium">{slot.label.split(' (')[0]}</div>
                  <div className="text-sm opacity-75">
                    {slot.label.split(' (')[1]?.replace(')', '')}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 배송 참고사항 */}
          <Card variant="default" className="bg-card-dark-gray">
            <div className="text-sm text-text-gray space-y-1">
              <h4 className="font-medium text-text-white mb-2">배송 참고사항</h4>
              <p>• 배송 일정 변경은 다음 배송부터 적용됩니다</p>
              <p>• 일요일과 공휴일은 배송이 불가능합니다</p>
              <p>• 도서산간 지역은 추가 배송비가 발생할 수 있습니다</p>
              <p>• 배송 시간은 교통상황에 따라 다소 지연될 수 있습니다</p>
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
              변경 완료
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}