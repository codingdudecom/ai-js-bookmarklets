(function() {
    var script = document.createElement("script");
    script.onload = () => go();
    script.src = "https://unpkg.com/turndown/dist/turndown.js";
    document.head.appendChild(script);


    function go() {
        if (typeof(TurndownService) == "undefined"){
            setTimeout(go,500);
            return;
        }
        var turndownService = new TurndownService();
        var contentElement = document.getElementsByTagName("article")[0];
        if (!contentElement){
        	contentElement = document.body;
        }
        var markdown = turndownService.turndown(contentElement);

        const API_KEY = localStorage.getItem("GPT_API_KEY");
        const BASE_URL = localStorage.getItem("GPT_API_BASE");
        if (!API_KEY) {
            alert("GPT_API_KEY not set in localStorage");
            throw "GPT_API_KEY not set in localStorage";
        }

        if (!BASE_URL) {
            alert("GPT_API_BASE not set in localStorage");
            throw "GPT_API_BASE not set in localStorage";
        }
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${API_KEY}`);

        const raw = JSON.stringify({
            "model": "claude-3-haiku",
            "messages": [{
                    "role": "system",
                    "content": `As a professional summarizer, create a concise and comprehensive summary of the provided text, be it an article, post, conversation, or passage, while adhering to these guidelines:

Craft a summary that is detailed, thorough, in-depth, and complex, while maintaining clarity and conciseness.

Incorporate main ideas and essential information, eliminating extraneous language and focusing on critical aspects.

Rely strictly on the provided text, without including external information.

Format the summary in paragraph form for easy understanding.

Conclude your notes with [End of Notes, Message #X] to indicate completion, where "X" represents the total number of messages that I have sent. In other words, include a message counter where you start with #1 and add 1 to the message counter every time I send a message.

By following this optimized prompt, you will generate an effective summary that encapsulates the essence of the given text in a clear, concise, and reader-friendly manner.`
                },
                {
                    "role": "user",
                    "content": `Here's the content:

                    ${markdown}


                    SUMMARY:`
                }
            ],
            "max_tokens": 4096,
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

        var win = window.open("", "Page summary", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=200,top=" + (screen.height - 400) + ",left=" + (screen.width - 840));

        win.document.body.innerHTML = "Analyzing...";


        fetch(BASE_URL, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                console.log(result);
                win.document.body.innerHTML = `<pre>${result.choices[0].message.content}</pre>`;
            })
            .catch((error) => {
                console.error(error);
                alert(error);
            });
    }
})();
