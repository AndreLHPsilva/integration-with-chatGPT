import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [message, setMessage] = useState("");
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkTheme(prefersDarkScheme.matches);

    // Observar mudanças na preferência do usuário
    const handleChange = () => setIsDarkTheme(prefersDarkScheme.matches);
    prefersDarkScheme.addListener(handleChange);

    return () => {
      prefersDarkScheme.removeListener(handleChange);
    };
  }, []);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const handleClick = async () => {
    setIsLoading(true);
    const headers = {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_KEY_OPENIA}`,
      "OpenAI-Organization": `org-UOd2F0adEd8v9km3yvNZslIu`,
      "Content-Type": "application/json",
    };

    const body = {
      model: "text-davinci-003",
      prompt: `${question} responda em português brasileiro.`,
      max_tokens: 2000,
      temperature: 1,
    };

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/completions",
        body,
        { headers }
      );
      setMessage(response.data.choices[0].text);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setQuestion("");
    }
  };

  return (
    <>
      <div className="h-[100vh] w-full flex flex-col justify-center items-center bg-blue-50">
        <h1 className="text-xl mb-10 text-blue-900">Faça uma pergunta para o ChatGPT.</h1>
        <div className="w-[325px] md:max-w-md">
          <div class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div class="p-5">
              <div className="w-full flex flex-col items-center mb-5">
                <textarea
                  id="message"
                  value={question}
                  rows="4"
                  className={
                    isDarkTheme
                      ? "w-[325px] md:max-w-md bg-transparent p-5 rounded-lg border-none focus:outline-none resize-none font-normal text-white"
                      : "w-[325px] md:max-w-md bg-transparent p-5 rounded-lg border-none focus:outline-none resize-none font-normal text-gray-700"
                  }
                  placeholder="Me faça uma pergunta..."
                  onChange={(event) => setQuestion(event.target.value)}
                ></textarea>
              </div>
            </div>
            <hr></hr>
            {isLoading ? (
              <div
                role="status"
                className="flex content-center justify-center items-center py-10"
              >
                <svg
                  aria-hidden="true"
                  class="inline w-10 h-10 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span class="sr-only">Loading...</span>
              </div>
            ) : (
              <div className="w-[325px] md:max-w-md  overflow-hidden py-5 px-2">
                <p
                  className={
                    isDarkTheme
                      ? "h-40 w-full overflow-y-scroll text-center text-sm text-white"
                      : "h-40 w-full overflow-y-scroll text-center text-sm text-gray-700"
                  }
                >
                  {message}
                </p>
              </div>
            )}
          </div>

          <div className="w-full flex content-center justify-center">
            <button
              onClick={handleClick}
              class="inline-flex items-center px-3 py-2 my-10 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 uppercase tracking-wide"
            >
              Criar Resposta
            </button>
          </div>
        </div>
        <button
          className="rounded-md p-2 text-blue-400 hover:text-blue-800 hover:underline transition-colors"
          onClick={toggleTheme}
        >
          Alternar Cor das letras
        </button>
      </div>
    </>
  );
}
