import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request) {
  try {
    const { phoneNumber } = await request.json()

    // 전화번호 유효성 검사
    const phoneRegex = /^010-\d{4}-\d{4}$/
    if (!phoneRegex.test(phoneNumber)) {
      return NextResponse.json(
        { error: '올바른 전화번호 형식이 아닙니다.' },
        { status: 400 }
      )
    }

    // 6자리 인증번호 생성
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    
    // 만료 시간 설정 (3분)
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 3)

    // 기존 미사용 인증 코드 삭제
    await supabase
      .from('sms_verification_codes')
      .delete()
      .eq('phone_number', phoneNumber)
      .eq('is_used', false)

    // 새 인증 코드 저장
    const { error: insertError } = await supabase
      .from('sms_verification_codes')
      .insert([
        {
          phone_number: phoneNumber,
          verification_code: verificationCode,
          expires_at: expiresAt.toISOString(),
        }
      ])

    if (insertError) {
      console.error('Database error:', insertError)
      return NextResponse.json(
        { error: '인증번호 생성에 실패했습니다.' },
        { status: 500 }
      )
    }

    // TODO: 실제 SMS 발송 로직 구현 (현재는 개발용 로그)
    console.log(`SMS sent to ${phoneNumber}: ${verificationCode}`)
    
    return NextResponse.json({ 
      success: true, 
      message: '인증번호가 전송되었습니다.',
      // 개발 환경에서만 인증번호 반환 (실제 운영에서는 제거)
      ...(process.env.NODE_ENV === 'development' && { verificationCode })
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}