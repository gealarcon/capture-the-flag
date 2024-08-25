import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
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
    let index = 0;
    const interval = setInterval(() => {
      if (word) {
        const node = document.createElement("li");
        const textnode = document.createTextNode(word[index]);
        node.appendChild(textnode);
        document.querySelector(".type-writer").appendChild(node);

        index++;
      }

      if (index === word.length) {
        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [word]);

  useEffect(() => {
    const getWordFromUrl = async (link) => {
      const res = await fetch(link);

      if (res.status !== 200) {
        alert("Unable to get word from link");
      }

      setWord(await res.text());
      setLoading(false);
    };

    if (url) {
      getWordFromUrl(url);
    }
  }, [url]);

  if (word) {
    return <ul className="type-writer"></ul>;
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
