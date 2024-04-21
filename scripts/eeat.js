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
                    "content": "You are a helpful SEO expert. Your mission is to conduct a thorough E-E-A-T audit on a webpage content provided by the user. Also you have to provide actionable improvement suggestions. Be as detailed as necessary, do not explain what you are doing."
                },
                {
                    "role": "user",
                    "content": `Please conduct an E-E-A-T audit and suggest improvements for the page ${document.location.href} with the title ${document.head.querySelector("title").innerText.trim()}.\n\nHere's the page content:\n\n${markdown}`
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

        var win = window.open("", "E-E-A-T Audit", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=200,top=" + (screen.height - 400) + ",left=" + (screen.width - 840));

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
