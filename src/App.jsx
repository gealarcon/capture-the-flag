import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [word, setWord] = useState("");

  const parseHTML = async () => {
    setLoading(true);

    const res = await fetch(
      "https://tns4lpgmziiypnxxzel5ss5nyu0nftol.lambda-url.us-east-1.on.aws/challenge",
    );
    if (res.status !== 200) {
      alert("Unable to grab HTML");
    }

    const html = await res.text();
    // Now that we have the webpage, let create a virtual and prase.
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const codeElements = Array.from(doc.querySelectorAll("code"));

    let str = "";

    codeElements.forEach((code) => {
      const dataClassPattern = /^23/;
      const dataTagPattern = /.*93$/;
      const dataIdPattern = /.*21.*/;

      const dataClass = code.getAttribute("data-class");

      // find div with data-tag
      const [div] = Array.from(code.childNodes).filter(
        (node) => node.nodeName === "DIV" && node.getAttribute("data-tag"),
      );
      let dataTag;
      let dataId;
      if (div) {
        dataTag = div.getAttribute("data-tag");

        // find span with data-id
        const [span] = Array.from(div.childNodes).filter(
          (node) => node.nodeName === "SPAN" && node.getAttribute("data-id"),
        );

        if (span) {
          dataId = span.getAttribute("data-id");

          if (
            dataClass &&
            dataClassPattern.test(dataClass) &&
            dataTag &&
            dataTagPattern.test(dataTag) &&
            dataId &&
            dataIdPattern.test(dataId)
          );
          {
            const [i] = Array.from(span.childNodes).filter(
              (node) => node.nodeName === "I",
            );
            str = str + i.getAttribute("value");
          }
        }
      }
    });

    setUrl(str); // https://wgg522pwivhvi5gqsn675gth3q0otdja.lambda-url.us-east-1.on.aws/74726f
  };

  useEffect(() => {
    const getWordFromUrl = async (link) => {
      const res = await fetch(link);

      if (res.status !== 200) {
        alert("Unable to get work from link");
      }

      setWord(await res.text());
    };

    if (url) {
      getWordFromUrl(url);
    }
  }, [url]);

  if (word) {
    return <div>{word}</div>;
  } else if (loading) {
    return <div>loading...</div>;
  } else {
    return (
      <>
        <div className="card">
          <button onClick={parseHTML}>Capture The Flag</button>
        </div>
      </>
    );
  }
}

export default App;
