"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var Discord = require("discord.js");
var node_fetch_1 = require("node-fetch");
var dotenv = require("dotenv");
dotenv.config();
var bot = new Discord.Client();
bot.login(process.env.DISCORD_BOT_KEY);
var prefix = "!qna";
var discordWhitelistChannel = process.env.DISCORD_WHITELIST_CHANNEL;
var discourseHeaders = {
    "Api-Key": process.env.DISCOURSE_API_KEY,
    "Api-Username": process.env.DISCOURSE_API_USERNAME,
    "content-type": "application/json"
};
var discourseURL = process.env.DISCOURSE_URL;
var discourseCategory = process.env.DISCOURSE_CATEGORY;
bot.once("ready", function () { console.log("Ready to A some Q!"); });
bot.on('message', function (message) { return __awaiter(void 0, void 0, void 0, function () {
    var cmd, startQuote, endQuote, topic, args, topicId, args, startQuote, endQuote, queryString, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!message.content.startsWith(prefix) || !message.guild) {
                    return [2 /*return*/];
                }
                cmd = message.content.split(" ")[1];
                console.log("MSG: ", message.content);
                console.log("CMD: ", cmd);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 10, , 11]);
                if (!(cmd.toLowerCase() == "thread" && message.channel.id == discordWhitelistChannel)) return [3 /*break*/, 3];
                startQuote = message.content.indexOf("\"");
                endQuote = message.content.indexOf("\"", startQuote + 1);
                topic = message.content.slice(startQuote + 1, endQuote);
                args = message.content.slice(endQuote + 2).split("https://discordapp.com/channels/").filter(function (el) { if (el.includes("/")) {
                    return el;
                } }).map(function (el) { return el.trim().split('\\n')[0]; });
                console.log("ARGS: ", args);
                return [4 /*yield*/, createNewTopic(message, topic, args)];
            case 2:
                _a.sent();
                return [3 /*break*/, 9];
            case 3:
                if (!(cmd.toLowerCase() == "help")) return [3 /*break*/, 4];
                message.channel.send(returnHelpText());
                return [3 /*break*/, 9];
            case 4:
                if (!(cmd.toLowerCase() == "post" && message.channel.id == discordWhitelistChannel)) return [3 /*break*/, 6];
                topicId = message.content.split(" ")[2];
                args = message.content.split("https://discordapp.com/channels/").filter(function (el) { if (el.includes("/")) {
                    return el;
                } }).map(function (el) { return el.trim(); });
                console.log("ARGS: ", args);
                return [4 /*yield*/, addToTopicCondensed(message, topicId, args, false)];
            case 5:
                _a.sent();
                return [3 /*break*/, 9];
            case 6:
                if (!(cmd.toLowerCase() == "search")) return [3 /*break*/, 8];
                startQuote = message.content.indexOf("\"");
                endQuote = message.content.indexOf("\"", startQuote + 1);
                queryString = message.content.slice(startQuote + 1, endQuote);
                return [4 /*yield*/, search(message, queryString)];
            case 7:
                _a.sent();
                return [3 /*break*/, 9];
            case 8:
                if (cmd.toLowerCase() == "test") {
                    message.channel.send("Bot is online!");
                }
                _a.label = 9;
            case 9: return [3 /*break*/, 11];
            case 10:
                e_1 = _a.sent();
                message.channel.send(e_1.message);
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); });
function createNewTopic(message, topic, uriList) {
    return __awaiter(this, void 0, void 0, function () {
        var firstPost_DiscordChannel, firstMessage, msg, params, topicJson, topicUrl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (topic.length < 15) {
                        throw new Error("Topic \"" + topic + "\" needs to be atleast 15 characters long (Discourse Requirement)");
                    }
                    if (uriList.length < 1) {
                        throw new Error("Please include atleast one discord message to be included in the Discourse thread");
                    }
                    firstPost_DiscordChannel = bot.channels.cache.get(uriList[0].split('/')[1]) //message.guild.channels.cache.get(uriList[0].split('/')[5])
                    ;
                    return [4 /*yield*/, firstPost_DiscordChannel.messages.fetch(uriList[0].split('/')[2])];
                case 1:
                    firstMessage = _a.sent();
                    msg = "Author: " + firstMessage.author.username + "\nMessage: \n\n" + firstMessage.content;
                    if (msg.length < 20) {
                        throw new Error("Post (" + uriList[0].split("/")[2] + ") needs to be atleast 20 characters!");
                    }
                    params = {
                        method: "post",
                        headers: discourseHeaders,
                        body: JSON.stringify({
                            title: topic,
                            raw: msg,
                            category: discourseCategory
                        })
                    };
                    return [4 /*yield*/, node_fetch_1["default"](discourseURL + '/posts.json', params)];
                case 2: return [4 /*yield*/, (_a.sent()).json()];
                case 3:
                    topicJson = _a.sent();
                    if (topicJson.errors) {
                        throw new Error(JSON.stringify(topicJson.errors));
                    }
                    return [4 /*yield*/, addToTopicCondensed(message, topicJson.topic_id, uriList.slice(1), true)];
                case 4:
                    _a.sent();
                    topicUrl = discourseURL + '/t/' + topicJson.topic_slug + "/" + topicJson.topic_id;
                    message.channel.send("Topic \"" + topic + "\" created @ " + topicUrl);
                    return [2 /*return*/];
            }
        });
    });
}
function addToTopicCondensed(message, topic_id, uriList, isThread) {
    return __awaiter(this, void 0, void 0, function () {
        var allMsgs, _i, uriList_1, uri, channel, msg, startingIdx, endIdx, topic_slug, postContent, i, msgRaw, postParams, response, topic_url;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log(uriList);
                    if (uriList.length < 1) {
                        return [2 /*return*/];
                    }
                    allMsgs = [];
                    _i = 0, uriList_1 = uriList;
                    _a.label = 1;
                case 1:
                    if (!(_i < uriList_1.length)) return [3 /*break*/, 4];
                    uri = uriList_1[_i];
                    channel = bot.channels.cache.get(uri.split('/')[1]);
                    return [4 /*yield*/, channel.messages.fetch(uri.split('/')[2])];
                case 2:
                    msg = _a.sent();
                    allMsgs.push(msg);
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    startingIdx = 0;
                    endIdx = -1;
                    topic_slug = "";
                    _a.label = 5;
                case 5:
                    if (!(endIdx < allMsgs.length)) return [3 /*break*/, 8];
                    console.log("Start " + startingIdx + " End " + endIdx);
                    endIdx = getLastCummalativeIdx(allMsgs, startingIdx, allMsgs[startingIdx].author.username);
                    console.log("Start IDX: " + startingIdx + " End IDX: " + endIdx);
                    postContent = "";
                    for (i = startingIdx; i < endIdx; i++) {
                        postContent += allMsgs[i].content + "\n";
                    }
                    msgRaw = "Author: " + allMsgs[startingIdx].author.username + " \n\n Message: " + postContent;
                    postParams = {
                        method: 'post',
                        headers: discourseHeaders,
                        body: JSON.stringify({
                            topic_id: topic_id,
                            raw: msgRaw
                        })
                    };
                    return [4 /*yield*/, node_fetch_1["default"](discourseURL + '/posts.json', postParams)];
                case 6: return [4 /*yield*/, (_a.sent()).json()];
                case 7:
                    response = _a.sent();
                    if (response.errors) {
                        throw new Error(JSON.stringify(response.errors));
                    }
                    topic_slug = response['topic_slug'];
                    startingIdx = endIdx + 1;
                    if (startingIdx >= allMsgs.length) {
                        return [3 /*break*/, 8];
                    }
                    return [3 /*break*/, 5];
                case 8:
                    if (!isThread) {
                        topic_url = discourseURL + '/t/' + topic_slug + '/' + topic_id;
                        message.channel.send("Posts added to topic: " + topic_url);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/* async function addToTopic(message:Discord.Message, topic_id:string, uriList:string[]){
  console.log(uriList);
  if(uriList.length < 1){return;}
  let topic_slug = ""
  for(let i=0; i<uriList.length; i++){
    const channel:Discord.TextChannel =  <Discord.TextChannel>bot.channels.cache.get(uriList[i].split('/')[1])
    const msg:Discord.Message = await channel.messages.fetch(uriList[i].split('/')[2])
    let msgRaw = "Author: "+msg.author.username+"\nMessage: \n\n"+msg.content;
    if(msgRaw.length < 20){message.channel.send(`Post (${uriList[i].split('/')[2]}) is too short, cannot make into Discourse Post.`)}
    else {
      let postParams = {
        method: 'post',
        headers: discourseHeaders,
        body: JSON.stringify({
          topic_id: topic_id,
          raw: msgRaw
        })
      }
      let response = await (await fetch(discourseURL+'/posts.json',postParams)).json()
      if(response.errors){throw new Error(JSON.stringify(response.errors))}
      topic_slug = response['topic_slug']
    }
  }
  const topic_url = discourseURL+'/t/'+topic_slug+'/'+topic_id
  message.channel.send(`Posts added to topic: ${topic_url}`);
} */
function search(message, query) {
    return __awaiter(this, void 0, void 0, function () {
        var searchUrl, results, foundTopics, response, _i, foundTopics_1, topic;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    searchUrl = discourseURL + '/search.json?q=' + query;
                    return [4 /*yield*/, node_fetch_1["default"](searchUrl)];
                case 1: return [4 /*yield*/, (_a.sent()).json()];
                case 2:
                    results = _a.sent();
                    foundTopics = results.topics;
                    response = "This is a list of threads where your search term appears: \n";
                    for (_i = 0, foundTopics_1 = foundTopics; _i < foundTopics_1.length; _i++) {
                        topic = foundTopics_1[_i];
                        response += '\n' + discourseURL + "/t/" + topic.slug + '/' + topic.id;
                    }
                    message.channel.send(response);
                    return [2 /*return*/];
            }
        });
    });
}
function returnHelpText() {
    var res = "\nQNA Bot\nDescription: This bot backs up threads from League of Extraordinary FoundryVTT Developer Discord to The Forge's Discourse Forum PACKAGE DEVELOPMENT category.\nThis should only be used for developer question and answer threads. \n\nCommands\nThread\nUsage: `!qna thread \"some unique topic name\" discordLink_first_post discordLink_second_post....`\nDescription: Creates a new topic and creates posts under that topic based on discord links given.\nThe topic name must be unique and greater than 15 characters, whereas the post content should be greater than 20 characters.\n\nPost\nUsage: `!qna post topic_id discordLink discordLink....`\nDescription: Adds to an existing topic. Topc Id can be found as the last number on a given thread URL\n\nSearch\nUsage: `!qna search \"query string\"`\nDescription: Returns entries relevant to query string\n\nHelp\nUsage: `!qna help`\nDescription: Prints out the help section\n";
    return res;
}
function getLastCummalativeIdx(array, idx, author) {
    if (idx == array.length || array[idx].author.username != author) {
        return idx;
    }
    return getLastCummalativeIdx(array, idx + 1, author);
}
/*
let topic_slug = ""
let currentAuthor = allMsgs[0].author.username;
let postContent = allMsgs[0].content;

for(let nxtMsgId = 1; nxtMsgId<allMsgs.length; nxtMsgId++){
  if(allMsgs[nxtMsgId].author.username == currentAuthor){
    postContent += '\n' + allMsgs[nxtMsgId].content
    console.log(currentAuthor)
    console.log(postContent)
  } else {
    let msgRaw = "Author: "+currentAuthor+"\nMessage: \n\n"+postContent;
    let postParams = {
      method: 'post',
      headers: discourseHeaders,
      body: JSON.stringify({
        topic_id: topic_id,
        raw: msgRaw
      })
    }
    let response = await (await fetch(discourseURL+'/posts.json',postParams)).json()
    if(response.errors){throw new Error(JSON.stringify(response.errors))}
    topic_slug = response['topic_slug']
    currentAuthor = allMsgs[nxtMsgId].author.username
    postContent = ""; // the next iteration will add to it's content
  }
}
*/ 
