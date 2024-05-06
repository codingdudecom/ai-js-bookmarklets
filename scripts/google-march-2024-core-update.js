function start(){

var script = document.createElement("script");
script.onload = () => doTask();
script.src = "https://unpkg.com/turndown/dist/turndown.js";
document.head.appendChild(script);
}

function doTask(){
var turndownService = new TurndownService();
var markdown = turndownService.turndown(document.getElementsByTagName("article")[0]);

const API_KEY = localStorage.getItem("GPT_API_KEY");
const BASE_URL = localStorage.getItem("GPT_API_BASE");
if (!API_KEY){
	alert("GPT_API_KEY not set in localStorage");
	throw "GPT_API_KEY not set in localStorage";
}

if (!BASE_URL){
	alert("GPT_API_BASE not set in localStorage");
	throw "GPT_API_BASE not set in localStorage";
}
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", `Bearer ${API_KEY}`);

const raw = JSON.stringify({
  "model": "claude-3-haiku",
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful SEO expert. Your mission is to evaluate a webpage content according to the Google guidelines"
    },
    {
      "role": "user",
      "content": `Please evaluate the content of the page ${document.location.href} with the title ${document.head.querySelector("title").innerText.trim()}.
      Answer the following questions:

      1. Does the content provide original information, reporting, research, or analysis? Assess whether your content offers new insights, unique viewpoints, or comprehensive research that adds value beyond what’s already available online.
      2. Does the content provide a substantial, complete, or comprehensive topic description? Evaluate if your content thoroughly covers the topic, comprehensively addressing the audience’s questions, concerns, and related interests.
      3. Is the content written by an expert or enthusiast who demonstrably knows the topic well? Consider whether the author has the necessary expertise, experience, or passion for the subject matter, evident in the content’s depth and accuracy.
      4. Does the content have a clear purpose or goal that it successfully fulfills? Identify the primary objective of your content (to inform, entertain, persuade, etc.) and assess if it effectively achieves this goal.
      5. Would someone reading your content leave feeling they’ve learned enough about a topic to help achieve their goal? Reflect on whether the reader would come away with actionable knowledge, solutions, or a deeper understanding of the subject.
      6. Does the content present information that makes you trust it, such as clear sourcing, evidence of the author’s expertise, and a lack of factual errors? Verify the reliability and credibility of your content through accurate sourcing, showcasing the author’s qualifications, and ensuring factual correctness.
      7. Is the content free from spelling or stylistic issues? Ensure your content is professionally presented, with attention to grammar, spelling, and style, making it accessible and enjoyable to read. 
      8. Would you feel comfortable trusting this content for issues relating to YMYL? For content that impacts significant decisions (health, finance, etc.), consider if it meets the highest standards of accuracy and trustworthiness.
      9. Is the content designed to meet the needs of a human audience rather than search engines? Create content that serves your audience’s interests and queries instead of search engines.
      10. Does your site have a primary purpose or focus, and does your content support that purpose? Ensure your content aligns with and supports your website’s overarching theme or mission, providing a cohesive user experience.

      Here's the page content:\n\n${markdown}`
    }
  ],
  "max_tokens": 8096,
  "top_p": 1,
  "temperature": 0.5,
  "frequency_penalty": 0,
  "presence_penalty": 0
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

var win = window.open("", "Google March Core Update Evaluation", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=200,top="+(screen.height-400)+",left="+(screen.width-840));

win.document.body.innerHTML = "Analyzing...";


fetch(BASE_URL, requestOptions)
  .then((response) => response.json())
  .then((result) => {
  	console.log(result);
	win.document.body.innerHTML = `<pre>result.choices[0].message.content</pre>`;
  })
  .catch((error) => {
  	console.error(error);
  	alert(error);
  });

}
