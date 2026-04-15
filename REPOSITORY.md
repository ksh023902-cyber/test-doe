# 이 저장소에서 헷갈리지 않게 (고정 규칙)

## Git

- **저장소 루트는 `TEXT` 폴더 하나**입니다. (`test-doe` 안에 또 `.git` 두지 않기)
- 첫 정리 시 `test-doe/.git` 중첩 저장소를 제거하고, **이 루트에서만** 커밋합니다.

## 코드 / npm

- **실제 웹앱은 저장소 안의 하위 폴더 `test-doe/`** 입니다.
- GitHub에서 `git clone` 하면 **폴더 이름이 저장소 이름**이라 보통 `test-doe/test-doe/` 가 앱 루트가 됩니다. (한 단계 더 들어가기)
- 설치·실행·빌드는 항상 **앱 루트(`…/test-doe/test-doe`)** 에서:

```sh
cd test-doe/test-doe
npm install
npm run dev
```

- 로컬에서 워크스페이스가 `TEXT`이고 그 안에 `test-doe`만 있을 때는 `TEXT/test-doe` 한 겹이면 됩니다.

- **`TEXT` 루트에는 `package.json`을 두지 않습니다.** (의존성은 `test-doe`만 사용)

## 비밀 정보

- Firebase 키 등은 **`test-doe/.env`** (로컬만, Git에 올리지 않음)
- 템플릿: `test-doe/.env.example`

## 커밋 메시지 (선택)

- 원하면 앞에 일련번호를 붙여 구분합니다. 예: `[#001] feat: 홈 화면 여백 조정`
