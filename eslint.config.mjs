import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [...nextVitals, { ignores: ["src/generated/**"] }];

export default eslintConfig;
