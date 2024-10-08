import { commands } from "@vendetta";
import { findByProps } from "@vendetta/metro";

const MessageActions = findByProps("sendMessage", "receiveMessage");
const Locale = findByProps("Messages");

const endings = [
    "rawr x3", "OwO", "UwU", "o.O", "-.-", ">w<", "(⑅˘꒳˘)", "(ꈍᴗꈍ)", "(˘ω˘)", 
    "(U ᵕ U❁)", "σωσ", "òωó", "(///ˬ///✿)", "(U ﹏ U)", "( ͡o ω ͡o )", "ʘwʘ", ":3", 
    ":3", ":3", "XD", "nyaa~~", "mya", ">_<", "😳", "🥺", "😳😳😳", "rawr", "^^", 
    "^^;;", "(ˆ ﻌ ˆ)♡", "^•ﻌ•^", "/(^•ω•^)", "(✿oωo)"
];

const replacements = [
    ["small", "smol"], ["cute", "kawaii"], ["fluff", "floof"], ["love", "luv"], 
    ["stupid", "baka"], ["what", "nani"], ["meow", "nya"], ["hello", "hewwo"]
];

function selectRandomElement(arr: string[]): string {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

function replacePattern(match: RegExpExecArray): string {
    const char = match[1];
    if (char && 'aeiouAEIOU'.includes(char) && match[2]) {
        return `${char}w${match[2]}`;
    } else if (match[0].toLowerCase() === 'th') {
        return match[0].toLowerCase() === 'th' ? 'd' : 'D';
    }
    return match[0];
}

function appendRandomString(match: RegExpExecArray): string {
    return match[0] + " " + selectRandomElement(endings);
}

function replaceString(inputString: string): string | false {
    let replaced = false;
    for (const [oldStr, newStr] of replacements) {
        const regex = new RegExp(`\\b${oldStr}\\b`, "gi");
        if (regex.test(inputString)) {
            inputString = inputString.replace(regex, newStr);
            replaced = true;
        }
    }
    return replaced ? inputString : false;
}

function uwuify(text: string): string {
    text = text.replace(/([aeiou])t/gi, (match) => replacePattern(/([aeiou])t/gi.exec(match)!));
    text = text.replace(/th/gi, (match) => replacePattern(/(th)/gi.exec(match)!));
    
    text = text.replace(/ove/gi, 'uv')
               .replace(/[rl]/g, 'w')
               .replace(/[RL]/g, 'W')
               .replace(/[U]/g, 'U-U')
               .replace(/[u]/g, 'u-u')
               .replace(/((?<!\.)\.(?!\.)|[!?](?=\s|$|[^\s!?]))/g, appendRandomString);

    text = text.replace(/n([aeiou])/gi, 'ny$1');
    if (text && text[0].match(/[a-zA-Z]/)) {
        text = text[0] + '-' + text;
    }
    if (text && text[text.length - 1].match(/[a-zA-Z]/)) {
        text += '~~ ' + selectRandomElement(endings);
    }
    
    return text;
}

function isOneCharacterString(str: string): boolean {
    return str.split('').every((char: string) => char === str[0]);
}

function uwuifyMessage(message: string): string {
    const rule = /\S+|\s+/g;
    const words = message.match(rule) || [];
    let answer = "";

    for (let i = 0; i < words.length; i++) {
        if (isOneCharacterString(words[i]) || words[i].startsWith("https://")) {
            answer += words[i];
            continue;
        }

        const replaced = replaceString(words[i]);
        if (replaced === false) {
            answer += words[i]
                .replace(/n(?=[aeo])/g, "ny")
                .replace(/l|r/g, "w");
        } else {
            answer += replaced;
        }
    }

    answer += " " + selectRandomElement(endings);
    return answer;
}

function uwuifyArray(arr: any[]): any[] {
    const newArr = [...arr];

    newArr.forEach((item, index) => {
        if (Array.isArray(item)) {
            newArr[index] = uwuifyArray(item);
        } else if (typeof item === "string") {
            newArr[index] = uwuify(item);
        }
    });

    return newArr;
}

let patches: any[] = [];

export default {
    onLoad: () => {
        patches.push(commands.registerCommand({
            name: "uwuify",
            displayName: "uwuify",
            description: "uwuify your message!",
            displayDescription: "uwuify your message!",
            options: [{
                name: "message",
                displayName: "message",
                description: Locale.Messages.COMMAND_SHRUG_MESSAGE_DESCRIPTION,
                displayDescription: Locale.Messages.COMMAND_SHRUG_MESSAGE_DESCRIPTION,
                required: true,
                type: 3
            }],
            applicationId: -1,
            inputType: 1,
            type: 1,
            execute: (args, ctx) => {
                MessageActions.sendMessage(ctx.channel.id, {
                    content: uwuifyMessage(args[0].value)
                });
            }
        }));
    },
    onUnload: () => {
        for (const unpatch of patches) unpatch();
    }
};
