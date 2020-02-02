from flask import Flask, jsonify, request
from nlp import NaturalLanguageProcessing
from ticket import Ticket
import time
import slack
from environment import SLACK_API_TOKEN
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from database import Database
from slack_handler import SlackHandler

cred = credentials.Certificate('rb-tickets-7b37f6550688.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

app = Flask(__name__)


slack_token = SLACK_API_TOKEN
client = slack.WebClient(token=slack_token)

@app.route('/')
def main():
    return   '''<pre>\n 
                $$$$$$$\  $$$$$$$\ $$$$$$$$\ $$\           $$\                  $$\ \n             
                $$  __$$\ $$  __$$\\__$$  __|\__|          $$ |                 $$ | \n             
                $$ |  $$ |$$ |  $$ |  $$ |   $$\  $$$$$$$\ $$ |  $$\  $$$$$$\ $$$$$$\    $$$$$$$\ \n 
                $$$$$$$  |$$$$$$$\ |  $$ |   $$ |$$  _____|$$ | $$  |$$  __$$\\_$$  _|  $$  _____| \n
                $$  __$$< $$  __$$\   $$ |   $$ |$$ /      $$$$$$  / $$$$$$$$ | $$ |    \$$$$$$\ \n
                $$ |  $$ |$$ |  $$ |  $$ |   $$ |$$ |      $$  _$$<  $$   ____| $$ |$$\  \____$$\ \n
                $$ |  $$ |$$$$$$$  |  $$ |   $$ |\$$$$$$$\ $$ | \$$\ \$$$$$$$\  \$$$$  |$$$$$$$  |\n
                \__|  \__|\_______/   \__|   \__| \_______|\__|  \__| \_______|  \____/ \_______/ </pre>\n
                                                                                                  
        
                             
                                                                                                  '''


@app.route('/chat')
def chat():

    user_id="UTG9YH3HV"
    id = "CTG9YH7QX"

    client.chat_postEphemeral(channel=id, user=user_id, text="Hello")
    print("Respond")
    return ""

async def process_im(payload):
    time.sleep(10) # Simulate a slow process
    return

@app.route('/create_ticket', methods=['POST'])
def create_ticket_form():
    data = request.form
    Database.create_conversation(db, data["user_id"], data["channel_id"])
    view = SlackHandler.create_ticket_view(data)
    client.views_open(
        trigger_id=data["trigger_id"],
        view=view
    )
    return "Opening up a ticket request..."



@app.route('/interactions', methods=['POST'])
def interactions():

    user_id="UTG9YH3HV"
    id = "CTG9YH7QX"

    client.chat_postEphemeral(channel=id, user=user_id, text="hi")

    data = request.form
    client.chat_postEphemeral(channel=id,user=user_id,text=str(data))

    client.chat_postEphemeral(channel=id,user=user_id, text="hi")

    data = request.form

    channel_id = Database.get_conversation(data["user"]["id"], db=db)
    client.chat_postMessage(channel=channel_id,
                            text="Data: {}".format(str(data)))

    if data["type"] == "block_actions":
        SlackHandler.handle_interactions(client=client, data=data, db=db)
        return jsonify({'ok': True, 'message': 'interaction handled successfully'}), 200
    elif data["type"] == "view_closed":
        SlackHandler.handle_close(client=client, data=data, db=db)
        return jsonify({'ok': True, 'message': 'Closed modal successfully!'}), 200
    elif data["type"] == "view_submission":
        SlackHandler.handle_submission(client=client, data=data, db=db)
        return jsonify({'ok': True, 'message': 'Ticket created successfully!'}), 200
    return jsonify({'ok': True, 'message': 'Unknown'}), 200

@app.route('/tickets')
def get_tickets():
    tickets = Database.get_tickets(db=db)
    response = {"tickets" : tickets}
    return jsonify(response)

@app.route('/add_ticket', methods=['POST'])
def add_ticket():
    ts = time.time().__str__()
    body = request.json()
    user_id = body["user_id"] + ts
    title = body["title"]
    priority = int(body["priority"])
    problem = body["problem"]
    team = body["team"]
    desc = body["description"]

    ticket = {
                "user_id": user_id,
                "title": title,
                "priority": priority,
                "problem": problem,
                "team": team,
                "desc": desc,

    }

    if "pb_other" in body:
        ticket["pb_other"] = body["pb_other"]
    if "team_other" in body:
        ticket["team_other"] = body["team_other"]

    ticket = Database.add_ticket_to_db(db=db, ticket=ticket)
    return jsonify({'ok': True, 'message': 'Ticket created successfully!', 'ticket': ticket}), 200


if __name__ == '__main__':
    app.run()


