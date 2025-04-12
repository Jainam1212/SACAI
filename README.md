# SACAI
### SkillBridge and CarrierPath AI

Our project donot only target to provide an efficient real-time collaborative platform designed for student and job seekers but also add various functionalities from Intelligent Virtual Career Advisor.
SACAI (SkillBridge and CarrierPath AI) serves as the Career Advisor that evaluates skills, aligns users with the best career trajectories based on market analytics, and offers assistance with resumes and interviews. SpeakSpace enhances this by providing real-time group discussions and role-play interviews, delivering immediate feedback on communication skills and logical reasoning. When combined, they create a cohesive environment for career development and skill mastery, enabling users to succeed in competitive job markets.


#How to start our project: -
```1. npm i within daiict2025 dir
2. npm run dev
3. npm run server
```

### Note

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
