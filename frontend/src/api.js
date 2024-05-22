import axios from "axios";

const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
});

export const fetchLanguageVersions = async () => {
  const response = await API.get("/runtimes");
  const data = response.data;

  const languageVersions = {};
  data.forEach((item) => {
    languageVersions[item.language] = item.version;
  });

  console.log(languageVersions);
  return languageVersions;
};

export const executeCode = async (language, sourceCode) => {
  const languageVersions = await fetchLanguageVersions();

  // Check if the language is cpp and change it to c++
  const languageToUse = language === "cpp" ? "c++" : language;

  const response = await API.post("/execute", {
    language: languageToUse,
    version: languageVersions[languageToUse],
    files: [
      {
        content: sourceCode,
      },
    ],
  });

  return response.data;
};
