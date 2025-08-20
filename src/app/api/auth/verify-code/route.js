import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request) {
  try {
    const { phoneNumber, verificationCode } = await request.json()

    // 입력값 유효성 검사
    if (!phoneNumber || !verificationCode) {
      return NextResponse.json(
        { error: '전화번호와 인증번호를 모두 입력해주세요.' },
        { status: 400 }
      )
    }

    // 인증 코드 조회
    const { data: codes, error: selectError } = await supabase
      .from('sms_verification_codes')
      .select('*')
      .eq('phone_number', phoneNumber)
      .eq('verification_code', verificationCode)
      .eq('is_used', false)
      .order('created_at', { ascending: false })
      .limit(1)

    if (selectError) {
      console.error('Database error:', selectError)
      return NextResponse.json(
        { error: '인증 처리 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    if (!codes || codes.length === 0) {
      return NextResponse.json(
        { error: '잘못된 인증번호입니다.' },
        { status: 400 }
      )
    }

    const code = codes[0]

    // 만료 시간 확인
    const now = new Date()
    const expiresAt = new Date(code.expires_at)
    
    if (now > expiresAt) {
      return NextResponse.json(
        { error: '인증번호가 만료되었습니다.' },
        { status: 400 }
      )
    }

    // 시도 횟수 확인
    if (code.attempts >= code.max_attempts) {
      return NextResponse.json(
        { error: '인증 시도 횟수를 초과했습니다.' },
        { status: 400 }
      )
    }

    // 인증 코드를 사용됨으로 표시
    const { error: updateError } = await supabase
      .from('sms_verification_codes')
      .update({ is_used: true })
      .eq('id', code.id)

    if (updateError) {
      console.error('Database error:', updateError)
      return NextResponse.json(
        { error: '인증 처리 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    // 사용자 조회 또는 생성
    let { data: user, error: userSelectError } = await supabase
      .from('users')
      .select('*')
      .eq('phone_number', phoneNumber)
      .single()

    if (userSelectError && userSelectError.code !== 'PGRST116') {
      console.error('User select error:', userSelectError)
      return NextResponse.json(
        { error: '사용자 정보 처리 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    if (!user) {
      // 새 사용자 생성
      const { data: newUser, error: userInsertError } = await supabase
        .from('users')
        .insert([{ phone_number: phoneNumber }])
        .select()
        .single()

      if (userInsertError) {
        console.error('User insert error:', userInsertError)
        return NextResponse.json(
          { error: '사용자 정보 생성에 실패했습니다.' },
          { status: 500 }
        )
      }
      user = newUser
    } else {
      // 기존 사용자 로그인 시간 업데이트
      const { error: updateLoginError } = await supabase
        .from('users')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', user.id)

      if (updateLoginError) {
        console.error('Login time update error:', updateLoginError)
      }
    }

    return NextResponse.json({
      success: true,
      message: '인증이 완료되었습니다.',
      user: {
        id: user.id,
        phoneNumber: user.phone_number,
        createdAt: user.created_at,
        lastLoginAt: user.last_login_at
      }
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}