QNA Bot
Description: This bot backs up threads from League of Extraordinary FoundryVTT Developer Discord to The Forge's Discourse Forum PACKAGE DEVELOPMENT category.
This should only be used for developer question and answer threads. 

Commands
Thread
Usage: \`!qna thread "some unique topic name" discordLink_first_post discordLink_second_post....\`
Description: Creates a new topic and creates posts under that topic based on discord links given.
The topic name must be unique and greater than 15 characters, whereas the post content should be greater than 20 characters.

Post
Usage: \`!qna post topic_id discordLink  discordLink....\`
Description: Adds to an existing topic. Topc Id can be found as the last number on a given thread URL

Search
Usage: \`!qna search "query string"\`
Description: Returns entries relevant to query string

Help
Usage: \`!qna help\`
Description: Prints out the help section