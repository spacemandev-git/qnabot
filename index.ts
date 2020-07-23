import * as Discord from 'discord.js';
import fetch from 'node-fetch';
import * as dotenv from 'dotenv';

dotenv.config();

const bot = new Discord.Client();
bot.login(process.env.DISCORD_BOT_KEY);
const prefix = "!qna"


const discourseHeaders = {
  "Api-Key": process.env.DISCOURSE_API_KEY,
  "Api-Username": process.env.DISCOURSE_API_USERNAME,
  "content-type": "application/json"
}
const discourseURL = process.env.DISCOURSE_URL
const discourseCategory = process.env.DISCOURSE_CATEGORY

bot.once("ready", ()=>{console.log("Ready to A some Q!")});
bot.on('message', async (message) => {
  if(!message.content.startsWith(prefix) || !message.guild){ return; }
  const cmd = message.content.split(" ")[1]
  console.log("MSG: ", message.content);
  console.log("CMD: ", cmd);

  try{
    if(cmd.toLowerCase() == "thread"){
      //!qna thread "How do I do a thing?" https://discordapp.com/channels/734962134160506912/734962134160506915/735353838294401105 https://discordapp.com/channels/734962134160506912/734962134160506915/735353863229407272 https://discordapp.com/channels/734962134160506912/734962134160506915/735353896977039400
      const startQuote = message.content.indexOf("\"");
      const endQuote = message.content.indexOf("\"", startQuote +1)
      const topic = message.content.slice(startQuote+1, endQuote);
      const args = message.content.slice(endQuote+2,).split("\n")
      console.log("ARGS: ", args);
      await createNewTopic(message, topic, args)
    } else if (cmd.toLowerCase() == "help"){
      message.channel.send(returnHelpText())
    } else if (cmd.toLowerCase() == "post"){
      //!qna post 15 https://discordapp.com/channels/734962134160506912/734962134160506915/735353838294401105

      const topicId = message.content.split(" ")[2]
      const args = message.content.split("\n").slice(1, )
      await addToTopic(message, topicId, args)
    } else if (cmd.toLowerCase() == "search"){
      //!qna search "Some Query"
      const startQuote = message.content.indexOf("\"");
      const endQuote = message.content.indexOf("\"", startQuote +1)
      const queryString = message.content.slice(startQuote+1, endQuote);
      await search(message, queryString);
    }
  } catch (e) {
    message.channel.send(e.message)
  }
});

async function createNewTopic(message:Discord.Message, topic:string, uriList:string[]){
  if(topic.length < 15){throw new Error(`Topic "${topic}" needs to be atleast 15 characters long (Discourse Requirement)`)}
  if(uriList.length < 1 || uriList[0] == "" || !uriList[0].includes("discordapp.com")) {throw new Error("Please include atleast one discord message to be included in the Discourse thread");}

  const firstPost_DiscordChannel = <Discord.TextChannel>bot.channels.cache.get(uriList[0].split('/')[5]) //message.guild.channels.cache.get(uriList[0].split('/')[5])
  const firstMessage:Discord.Message = await firstPost_DiscordChannel.messages.fetch(uriList[0].split('/')[6])
  let msg = "Author: "+firstMessage.author.username+"\nMessage: \n\n"+firstMessage.content;
  if(msg.length < 20){throw new Error(`Post (${uriList[0].split("/")[6]}) needs to be atleast 20 characters!`)}

  //Create Topic
  let params = {
    method: "post",
    headers: discourseHeaders,
    body: JSON.stringify({
      title: topic,
      raw: msg,
      category: discourseCategory
    })
  }
  let topicJson = await (await fetch(discourseURL+'/posts.json', params)).json()
  if(topicJson.errors){throw new Error(JSON.stringify(topicJson.errors))}
  await addToTopic(message, topicJson.topic_id, uriList.slice(1,));

  const topicUrl = discourseURL+'/t/'+topicJson.topic_slug+"/"+topicJson.topic_id
  message.channel.send(`Topic "${topic}" created @ ${topicUrl}`)
}
async function addToTopic(message:Discord.Message, topic_id:string, uriList:string[]){
  console.log(uriList);
  if(uriList.length < 1){return;}
  let topic_slug = ""
  for(let i=0; i<uriList.length; i++){
    const channel:Discord.TextChannel =  <Discord.TextChannel>bot.channels.cache.get(uriList[i].split('/')[5])
    const msg:Discord.Message = await channel.messages.fetch(uriList[i].split('/')[6])
    let msgRaw = "Author: "+msg.author.username+"\nMessage: \n\n"+msg.content;
    if(msgRaw.length < 20){message.channel.send(`Post (${uriList[i].split('/')[5]}) is too short, cannot make into Discourse Post.`)}
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
      topic_slug = response['topic_slug']
    }
  }
  const topic_url = discourseURL+'/t/'+topic_slug+'/'+topic_id
  message.channel.send(`Posts added to topic: ${topic_url}`);
}
async function search(message:Discord.Message, query:string){
  let searchUrl = discourseURL+'/search.json?q='+query;
  let results = await (await fetch(searchUrl)).json();
  let foundTopics = results.topics;
  //let foundPosts = results.posts; //very hard to create links to these so meh
  let response = "This is a list of threads where your search term appears: \n";
  for(let topic of foundTopics){
    response += '\n' + discourseURL + "/t/" + topic.slug + '/' + topic.id
  }
  message.channel.send(response);
}
function returnHelpText(){
  let res = 
`
QNA Bot
Description: This bot backs up threads from League of Extraordinary FoundryVTT Developer Discord to The Forge's Discourse Forum PACKAGE DEVELOPMENT category.
This should only be used for developer question and answer threads. 

Commands
Thread
Usage: \`!qna thread "some unique topic name" \\n discordLink_first_post \\n discordLink_second_post....\`
Description: Creates a new topic and creates posts under that topic based on discord links given. EACH DISCORD LINK MUST BE ON A NEW LINE. 
The topic name must be unique and greater than 15 characters, whereas the post content should be greater than 20 characters.

Post
Usage: \`!qna post topic_id \\n discordLink  \\n discordLink....\`
Description: Adds to an existing topic. EACH DISCORD LINK MUST BE ON A NEW LINE. Topc Id can be found as the last number on a given thread URL

Search
Usage: \`!qna search "query string"\`
Description: Returns entries relevant to query string

Help
Usage: \`!qna help\`
Description: Prints out the help section
`
  return res;
}