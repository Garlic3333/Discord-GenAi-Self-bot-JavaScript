const token = 'nuhuh'; // Discord Token of your account, cuz its self-bot 
const channelId = '222'; // simple 2 get i guess :D
const userID = '222'; 
let lastMessageId = null; 
const scriptStartTime = new Date(); // Idk why did i add it but ok?

async function fetchMessages() {
    let url = `https://discord.com/api/v9/channels/${channelId}/messages?limit=100`; // sadly the max limit is 100
    if (lastMessageId) {
        url += `&after=${lastMessageId}`;
    }
    const response = await fetch(url, {
        headers: {
            Authorization: token
        }
    });
    if (!response.ok) {
        return [];
    }
    const messages = await response.json();
    return messages;
}

async function reply() {
    const messages = await fetchMessages();
    const mentionMessages = messages.filter(message => 
        message.mentions.some(m => m.id === userID) &&
        new Date(message.timestamp) >= scriptStartTime
    );
    const nonMentionMessages = messages.filter(message => 
        !message.mentions.some(m => m.id === userID)
    );

    if (mentionMessages.length > 0) {
        lastMessageId = mentionMessages[0].id;
    }

    for (const mention of mentionMessages) {
        if (nonMentionMessages.length === 0) {
            // in the fact we can do a simple console.log to know did we received any message w/ mention like
            console.log('NO MESSAGES');
            continue;
        }
        const randomMessage = nonMentionMessages[Math.floor(Math.random() * nonMentionMessages.length)];
        const replyPayload = {
            content: randomMessage.content,
            message_reference: {
                message_id: mention.id
            }
        };

        const url = `https://discord.com/api/v9/channels/${channelId}/messages`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            },
            body: JSON.stringify(replyPayload)
        });

        if (!response.ok) {
            console.error('Failed 2 send 4:', response.statusText);
        } else {
            console.log('Reply sent 2:', mention.id);
        }
    }
}

async function loop() {
    while (true) {
        await reply();
        await new Promise(resolve => setTimeout(resolve, 5000)); // u can do lower if u want tho
    }
}

loop();