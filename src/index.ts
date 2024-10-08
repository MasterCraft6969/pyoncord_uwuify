import { commands } from "@vendetta";
import { findByProps } from "@vendetta/metro";

const MessageActions = findByProps("sendMessage", "receiveMessage");
const Locale = findByProps("Messages");

const endings = [
    "rawr x3",
    "OwO",
    "UwU",
    "o.O",
    "-.-",
    ">w<",
    "(⑅˘꒳˘)",
    "(ꈍᴗꈍ)",
    "(˘ω˘)",
    "(U ᵕ U❁)",
    "σωσ",
    "òωó",
    "(///ˬ///✿)",
    "(U ﹏ U)",
    "( ͡o ω ͡o )",
    "ʘwʘ",
    ":3",
    ":3", // important enough to have twice
    ":3", // important enough to have thrice
    "XD",
    "nyaa~~",
    "mya",
    ">_<",
    "😳",
    "🥺",
    "😳😳😳",
    "rawr",
    "^^",
    "^^;;",
    "(ˆ ﻌ ˆ)♡",
    "^•ﻌ•^",
    "/(^•ω•^)",
    "(✿oωo)"
];

const replacements = [
    ["small", "smol"],
    ["cute", "kawaii"],
    ["fluff", "floof"],
    ["love", "luv"],
    ["stupid", "baka"],
    ["what", "nani"],
    ["meow", "nya"],
    ["hello", "hewwo"],
];


function selectRandomElement(arr) {
function uwuify(message: string): string {
    const rule = /\S+|\s+/g;
    const words: string[] | null = message.match(rule);
    let answer = "";

    if (words === null) return "";

    for (let i = 0; i < words.length; i++) {
        if (words[i].split('').every((char: string) => char === words[i][0]) || words[i].startsWith("https://")) {
            answer += words[i];
            continue;
        }

        let replaced = false;
        for (const replacement of replacements) {
            const regex = new RegExp(`\\b${replacement[0]}\\b`, "gi");
            if (regex.test(words[i])) {
                words[i] = words[i].replace(regex, replacement[1]);
                replaced = true;
            }
        }

        if (!replaced) {
            answer += words[i]
                .replace(/n(?=[aeo])/g, "ny")
                .replace(/l|r/g, "w");
        } else {
            answer += words[i];
        }
    }

    const randomIndex = Math.floor(Math.random() * endings.length);
    answer += " " + endings[randomIndex];
    
    return answer;
}

function uwuifyArray(arr) {
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



let patches = [];

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
                // @ts-ignore
                type: 3
            }],
            // @ts-ignore
            applicationId: -1,
            inputType: 1,
            type: 1,
        
            execute: (args, ctx) => {
               
                MessageActions.sendMessage(ctx.channel.id, {
                    content: uwuify(args[0].value)
                })
            }
        }));
    },
    onUnload: () => {
        for (const unpatch of patches) unpatch()
    }
        }
