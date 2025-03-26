export const runtime = "edge";

function parseKDHtml(htmlData: string) {
  function decodeHtmlEntities(str) {
    return str.replace(/&#(\d+);/g, (match, dec) => {
      return String.fromCharCode(dec);
    });
  }

  let finalObj = {};
  try {
    const result = htmlData
      .split("head2>")
      .slice(1)
      .map((i) => i.substring(0, i.indexOf("</td>")))
      .map((i) =>
        i
          .split("<br>")
          .map((line) =>
            line
              .replace(/(&nbsp;)*[\d]+\.\s*/g, "")
              .replace(/&nbsp;/g, "")
              .trim()
          )
          .filter((line) => line !== "")
      )
      .map((category) => {
        return {
          category: category[0].replace("</span>", ""),
          words: category.slice(1).map((word) => word),
        };
      });
    result.forEach((item) => {
      finalObj[item.category] = item.words.map((word) =>
        decodeHtmlEntities(word)
      );
    });
    return finalObj;
  } catch (err) {
    console.log("error in parser:", err);
    finalObj = htmlData;
  }
  return finalObj;
}

export async function POST(req: Request) {
  try {
    interface Body {
      word: string;
    }
    const body: Body = await req.json();

    console.log("query:", body);
    const q = body.word;
    const resp = await fetch("http://www.thekonkanidictionary.com/search.asp", {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "accept-language": "en-US,en;q=0.7",
        "cache-control": "max-age=0",
        "content-type": "application/x-www-form-urlencoded",
        "sec-gpc": "1",
        "upgrade-insecure-requests": "1",
      },
      body: `sword=${q}&B1=Submit`,
      method: "POST",
    });

    const htmlData = await resp.text();
    const result = parseKDHtml(htmlData);
    console.log("result", result);
    return Response.json(result);
  } catch (error) {
    console.log("inside translate catch");
    return new Response("Error occured" + error);
  }
}
