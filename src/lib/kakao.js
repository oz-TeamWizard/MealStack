// 카카오 SDK 초기화 및 유틸리티 함수
export const initKakao = () => {
  if (typeof window !== 'undefined' && window.Kakao && !window.Kakao.isInitialized()) {
    window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
    console.log('Kakao SDK initialized:', window.Kakao.isInitialized());
  }
};

// 카카오 로그인
export const performKakaoLogin = () => {
  return new Promise((resolve, reject) => {
    if (!window.Kakao) {
      reject(new Error('카카오 SDK가 로드되지 않았습니다.'));
      return;
    }

    if (!window.Kakao.isInitialized()) {
      reject(new Error('카카오 SDK가 초기화되지 않았습니다.'));
      return;
    }

    console.log('카카오 SDK 상태:', {
      isInitialized: window.Kakao.isInitialized(),
      Auth: !!window.Kakao.Auth,
      API: !!window.Kakao.API,
      authMethods: Object.keys(window.Kakao.Auth || {}),
      allKakaoMethods: Object.keys(window.Kakao || {})
    });
    
    // Auth 객체의 모든 메소드와 속성 확인
    if (window.Kakao.Auth) {
      console.log('Auth 메소드들:', Object.getOwnPropertyNames(window.Kakao.Auth));
      console.log('Auth 프로토타입 메소드들:', Object.getOwnPropertyNames(Object.getPrototypeOf(window.Kakao.Auth)));
    }

    // 카카오 SDK 2.x API 시도 - promiseLogin 또는 다른 방법들
    try {
      // 방법 1: promiseLogin 시도
      if (window.Kakao.Auth.promiseLogin) {
        console.log('promiseLogin 사용');
        window.Kakao.Auth.promiseLogin()
          .then((authObj) => {
            console.log('카카오 로그인 성공:', authObj);
            return getUserInfo();
          })
          .then((userInfo) => {
            resolve({
              accessToken: authObj.access_token,
              user: {
                id: userInfo.id,
                nickname: userInfo.properties?.nickname || '',
                profileImage: userInfo.properties?.profile_image || '',
                email: userInfo.kakao_account?.email || ''
              }
            });
          })
          .catch(reject);
      }
      // 방법 2: authorize를 리다이렉트 방식으로 사용
      else if (window.Kakao.Auth.authorize) {
        console.log('authorize 리다이렉트 방식 사용');
        console.log('현재 origin:', window.location.origin);
        window.Kakao.Auth.authorize({
          redirectUri: `${window.location.origin}/login`
        });
        // 이 경우 Promise는 resolve하지 않고 페이지가 리다이렉트됨
      }
      // 방법 3: 다른 메소드들 확인
      else {
        console.log('사용 가능한 Auth 메소드들을 확인하세요');
        reject(new Error('사용 가능한 카카오 로그인 메소드를 찾을 수 없습니다.'));
      }
    } catch (error) {
      console.error('카카오 로그인 호출 오류:', error);
      reject(error);
    }
    
    // 사용자 정보 가져오기 함수
    function getUserInfo() {
      return new Promise((resolve, reject) => {
        window.Kakao.API.request({
          url: '/v2/user/me',
          success: (userInfo) => {
            console.log('사용자 정보:', userInfo);
            resolve(userInfo);
          },
          fail: (error) => {
            console.error('사용자 정보 가져오기 실패:', error);
            reject(error);
          }
        });
      });
    }
  });
};

// 카카오 로그아웃
export const kakaoLogout = () => {
  return new Promise((resolve, reject) => {
    if (!window.Kakao?.Auth) {
      reject(new Error('카카오 SDK가 로드되지 않았습니다.'));
      return;
    }

    window.Kakao.Auth.logout({
      success: () => {
        console.log('카카오 로그아웃 성공');
        resolve();
      },
      fail: (error) => {
        console.error('카카오 로그아웃 실패:', error);
        reject(error);
      }
    });
  });
};

// 카카오 연결 해제 (선택사항)
export const kakaoUnlink = () => {
  return new Promise((resolve, reject) => {
    if (!window.Kakao?.API) {
      reject(new Error('카카오 SDK가 로드되지 않았습니다.'));
      return;
    }

    window.Kakao.API.request({
      url: '/v1/user/unlink',
      success: (response) => {
        console.log('카카오 연결 해제 성공:', response);
        resolve(response);
      },
      fail: (error) => {
        console.error('카카오 연결 해제 실패:', error);
        reject(error);
      }
    });
  });
};