const express = require('express');
const app = express();
const port = process.env.PORT || 8081;


const { WebClient } = require('@slack/web-api');
const token = "xoxb-932497145573-932561660144-T73k9vSEEM25kcfR3T50lyy6";
const web = new WebClient(token);
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


const { createEventAdapter } = require('@slack/events-api');
const { createServer } = require('http');
const slackSigningSecret = "138be31e43c21c983f69882094622fd7";
const slackEvents = createEventAdapter(slackSigningSecret);

const { createMessageAdapter } = require('@slack/interactive-messages');
const slackInteractions = createMessageAdapter(slackSigningSecret);

app.use('/s/events', slackEvents.expressMiddleware());
app.use('/s/interactions', slackInteractions.expressMiddleware());


const admin = require('firebase-admin');
let serviceAccount = require('./rb-tickets-node-267006-firebase-adminsdk-ot2ee-92e3052aa8.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
let db = admin.firestore();


const conversations = {};


const addTicketToDB = (db, ticket) => {
    const docID = ticket.user_id + "" + Math.floor(Date.now() / 1000);
    let docRef = db.collection('tickets').doc(docID);
    ticket["doc_id"] = docID
    let setTicket = docRef.set(ticket);
    return setTicket;
}

const deleteTicket = (db, ticket) => {
    // Get the `FieldValue` object
    let FieldValue = require('firebase-admin').firestore.FieldValue;

    // Create a document reference
    let ref = db.collection('tickets').doc(ticket.doc_id).delete().then(function () {
        console.log("Document successfully deleted!");
    }).catch(function (error) {
        console.error("Error removing document: ", error);
    });

    return ref
}


const getTickets = (db) => {
    const tickets = []
    let collectionRef = db.collection('tickets').get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                console.log(doc.id, '=>', doc.data());
                tickets.push(doc.data());
            });
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
    return tickets;
}

const chat = async (channel_id, text, user_id) => {
    try {
        console.log("SENDING REQUEST");
        const request = {
            text: text,
            channel: channel_id,
            user: user_id,
            attachments: []
        }
        console.log(request)

        const result = await web.chat.postEphemeral(request);
        
        console.log(`Successfully send message ${result.ts}`);
    } catch (error) {
        console.log(error)
    }
}

const addConversation = (db, user_id, channel_id) => {
    let ref = db.collection('conversations').doc(user_id).set({ channel_id: channel_id });
    return ref;
}

const deleteConversation = (db, user_id) => {
    // Get the `FieldValue` object
    let FieldValue = require('firebase-admin').firestore.FieldValue;

    // Create a document reference
    let ref = db.collection('conversations').doc(user_id)

    // Remove the 'capital' field from the document
    let removeCapital = ref.update({
        channel_id: FieldValue.delete()
    });

    return removeCapital
}

const getConversation = async (db, user_id) => {
    let ref = db.collection('conversations').doc(user_id)
    await ref.get()
        .then(doc => {
            if (!doc.exists) {
                console.log('No such document!');
            } else {
                console.log('Document data:', doc.data());
                return doc.data();
            }
        })
        .catch(err => {
            console.log('Error getting document', err);
        });

}

app.get('/', async (req, res) => {
    res.send(` <pre>\n 
                $$$$$$$\  $$$$$$$\ $$$$$$$$\ $$\           $$\                  $$\ \n             
                $$  __$$\ $$  __$$\\__$$  __|\__|          $$ |                 $$ | \n             
                $$ |  $$ |$$ |  $$ |  $$ |   $$\  $$$$$$$\ $$ |  $$\  $$$$$$\ $$$$$$\    $$$$$$$\ \n 
                $$$$$$$  |$$$$$$$\ |  $$ |   $$ |$$  _____|$$ | $$  |$$  __$$\\_$$  _|  $$  _____| \n
                $$  __$$< $$  __$$\   $$ |   $$ |$$ /      $$$$$$  / $$$$$$$$ | $$ |    \$$$$$$\ \n
                $$ |  $$ |$$ |  $$ |  $$ |   $$ |$$ |      $$  _$$<  $$   ____| $$ |$$\  \____$$\ \n
                $$ |  $$ |$$$$$$$  |  $$ |   $$ |\$$$$$$$\ $$ | \$$\ \$$$$$$$\  \$$$$  |$$$$$$$  |\n
                \__|  \__|\_______/   \__|   \__| \_______|\__|  \__| \_______|  \____/ \_______/ </pre>\n`);
});

app.post('/create_ticket',  async (req, res) => {
    const trigger = req.body.trigger_id;
    const channel_id = req.body.channel_id;
    const user_id = req.body.user_id;

    conversations[user_id] = channel_id;
    addConversation(db, user_id, channel_id);

    const view = {
        "type": "modal",
        "notify_on_close": true,
        "title": {
            "type": "plain_text",
            "text": "Create Support Ticket",
            "emoji": true
        },
        "submit": {
            "type": "plain_text",
            "text": "Create",
            "emoji": true
        },
        "close": {
            "type": "plain_text",
            "text": "Cancel",
            "emoji": true
        },
        "blocks": [
            {
                "type": "input",
                "block_id": "title",
                "element": {
                    "type": "plain_text_input"
                },
                "label": {
                    "type": "plain_text",
                    "text": "Title",
                    "emoji": true
                }
            },
            {
                "type": "divider"
            },
            {
                "type": "input",
                "block_id": "priority_input",
                "element": {
                    "type": "static_select",
                    "placeholder": {
                        "type": "plain_text",
                        "text": "Select a priority",
                        "emoji": true
                    },
                    "options": [
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "4",
                                "emoji": true
                            },
                            "value": "4"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "3",
                                "emoji": true
                            },
                            "value": "3"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "2",
                                "emoji": true
                            },
                            "value": "2"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "1 ",
                                "emoji": true
                            },
                            "value": "1"
                        }
                    ]
                },
                "label": {
                    "type": "plain_text",
                    "text": ":chart_with_upwards_trend: Select a priority",
                    "emoji": true
                }
            },
            {
                "type": "input",
                "block_id": "problem_input",
                "element": {
                    "type": "static_select",
                    "placeholder": {
                        "type": "plain_text",
                        "text": "Select a problem",
                        "emoji": true
                    },
                    "options": [
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "Account unlock",
                                "emoji": true
                            },
                            "value": "Account unlock"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "Forgot password",
                                "emoji": true
                            },
                            "value": "Forgot password"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "Local drive mapping",
                                "emoji": true
                            },
                            "value": "Local drive mapping"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "Remote access issues",
                                "emoji": true
                            },
                            "value": "Remote access issues"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "Slow virtual desktop platform",
                                "emoji": true
                            },
                            "value": "Slow virtual machine"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "Hardware",
                                "emoji": true
                            },
                            "value": "Hardware"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "Other",
                                "emoji": true
                            },
                            "value": "Other"
                        }
                    ]
                },
                "label": {
                    "type": "plain_text",
                    "text": ":interrobang:  Issues",
                    "emoji": true
                }
            },
            {
                "type": "input",
                "block_id": "team_input",
                "element": {
                    "type": "static_select",
                    "placeholder": {
                        "type": "plain_text",
                        "text": "Select a team",
                        "emoji": true
                    },
                    "options": [
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "Helpdesk",
                                "emoji": true
                            },
                            "value": "Helpdesk"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "Product Team",
                                "emoji": true
                            },
                            "value": "Product Team"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "Infrastructure",
                                "emoji": true
                            },
                            "value": "Infrastructure"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "Other",
                                "emoji": true
                            },
                            "value": "Other"
                        }
                    ]
                },
                "label": {
                    "type": "plain_text",
                    "text": ":briefcase:  Team",
                    "emoji": true
                }
            },
            {
                "type": "input",
                "block_id": "description",
                "element": {
                    "type": "plain_text_input",
                    "multiline": true
                },
                "label": {
                    "type": "plain_text",
                    "text": "Description",
                    "emoji": true
                }
            }
        ]
    }

    try {
        const result = await web.views.open({ trigger_id: trigger, view: view })
        // The result contains an identifier for the root view, view.id
        console.log(`Successfully opened root view ${result.view.id}`);
        res.send("");
    } catch(e){
        console.log(e);
        res.send("Failed to open modal!");
    }
}) 

const getUserInfo = async (user_id) => {
    try {
        const user_info = await web.users.info({ user: user_id });
        console.log(user_info);
        return user_info
    } catch (error) {
        return null
    }
}

app.post('/interactions', async (req, res) => {
    const json = JSON.parse(req.body.payload);
    const type = json.type;
    
    let user_id =  json.user.id;
    let name = json.user.name;
    let channel_id = conversations[user_id];
    // getConversation(db, user_id)

    if(type === "view_submission") {

        var description = json.view.state.values.description[Object.keys(json.view.state.values.description)].value
        if(description == null) {
            description = "";
        }  
        const date = new Date().toLocaleString()
        const team = json.view.state.values.team_input[Object.keys(json.view.state.values.team_input)].selected_option.value
        const problem = json.view.state.values.problem_input[Object.keys(json.view.state.values.problem_input)].selected_option.value
        const priority = parseInt(json.view.state.values.priority_input[Object.keys(json.view.state.values.priority_input)].selected_option.value)
        const title = json.view.state.values.title[Object.keys(json.view.state.values.title)].value
        const ticket = {
            title: title,
            description: description,
            team: team,
            problem: problem,
            priority: priority,
            user_id: user_id,
            name: name,
            date: date
        }
        
        const user_info = await getUserInfo(user_id)
        if(user_info !== null) {
            if (user_info.user.profile.email !== null) {
                ticket["email"] = user_info.user.profile.email
            } else if (user_info.user.real_name !== null) {
                ticket["name"] = user_info.user.real_name
            }
        }

        addTicketToDB(db, ticket)
        conversations[user_id] = null;
        deleteConversation(db, user_id);
        chat(channel_id, "Sucessfully created ticket, please wait patiently, while our support team is working hard!", user_id)
    } else if (type == "view_closed") {
        conversations[user_id] = null;
        deleteConversation(db, user_id);
        chat(channel_id, "Thank you for using our services!", user_id)
    } else if (type == "block_actions") {

    }
    
    try {
        res.send("");
    } catch (e) {
        console.log(e);
        res.send("Failed to open modal!");
    }
})


app.post('/create_ticket_web', async (req, res) => {

    const ticket = {
        title: title,
        description: description,
        team: team,
        problem: problem,
        priority: priority,
        user_id: user_id,
        name: name
    }
})

// Initialize a server for the express app - you can skip this and the rest if you prefer to use app.listen()
const server = createServer(app);
server.listen(port, () => {
    // Log a message when the server is ready
    console.log(`Listening for events on ${server.address().port}`);
});

