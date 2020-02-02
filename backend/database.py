import time
from flask import jsonify
from firebase_admin import firestore
import google

class Database:
    @staticmethod
    def add_ticket_to_db(db, ticket):
        tickets_ref = db.collection(u'tickets')
        tickets_ref.document(u'{}'.format(ticket['user_id'])).set(ticket)
        return ticket

    @staticmethod
    def get_ticket(db, ticket_id):
        return

    @staticmethod
    def get_tickets(db):
        tickers_ref = db.collection(u'tickets')
        tickets = tickers_ref.stream().map(lambda x: x.to_dict())
        return tickets


    @staticmethod
    def create_conversation(db, user_id, channel_id):
        db.collection(u'conversations').document(user_id).set({u"channel_id" : channel_id})

    @staticmethod
    def delete_conversation(db, user_id):
        ref = db.collection(u'conversations').document(user_id)
        ref.update({u'channel_id': firestore.DELETE_FIELD})

    @staticmethod
    def get_conversation(db, user_id):
        doc_ref = db.collection(u'conversations').document(user_id)
        try:
            doc = doc_ref.get()
            return doc.to_dict()["channel_id"]
        except google.cloud.exceptions.NotFound:
            print(u'No such document!')