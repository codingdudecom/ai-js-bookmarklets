# AI Page Summary

## Instructions

### Setup
In your browser you will need two variables in your `localStorage`:
1. `GPT_API_BASE` the GPT base url (eg. `https://api.openai.com/v1`)
2. `GPT_API_KEY` your API key for the GPT (eg. your ChatGPT API key)

### Installation
Then, simply copy the following bookmarklet code and create a new bookmark in your browser:

```JS
javascript:(function(){var SCRIPT_PATH="https://cdn.jsdelivr.net/gh/codingdudecom/ai-js-bookmarklets@latest/scripts/summary.js";var script=document.createElement("script");script.src=SCRIPT_PATH;document.head.appendChild(script);})();
```

### Usage

When you access the bookmark the script will summarize the current page.
