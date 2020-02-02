from database import Database
import time

class SlackHandler():
    current_conversation = {}

    @staticmethod
    def handle_interactions(client, data, db):
        channel_id = Database.get_conversation(data["user"]["id"], db=db)
        client.chat_postMessage(channel=channel_id,
                                text="Data: {}".format(str(data)))

    @staticmethod
    def handle_submission(client, data, db):
        ts = time.time().__str__()
        ticket = {}
        channel_id = Database.get_conversation(data["user"]["id"], db=db)

        Database.add_ticket_to_db(db, ticket)
        client.chat_postMessage(channel=channel_id,
                                text="Data: {}".format(str(data)))
        client.chat_postMessage(channel=channel_id,
                                text="Thank you {}, we have received your ticket please wait patiently while we process it.".format(
                                    data["user"]["name"]))

        Database.delete_conversation(db, data["user"]["id"])

    @staticmethod
    def handle_close(client, data, db):
        channel_id = Database.get_conversation(data["user"]["id"], db=db)
        client.chat_postMessage(channel=channel_id, text="Thank you for using our services!")
        Database.delete_conversation(db=db, user_id=data["user"]["id"])

    @staticmethod
    def create_ticket_view(data):
        view = {
            "type": "modal",
            "notify_on_close": True,
            "callback_id": data["user_id"] + "support-ticket-modal",
            "title": {
                "type": "plain_text",
                "text": "Create Support Ticket",
                "emoji": True
            },
            "submit": {
                "type": "plain_text",
                "text": "Create",
                "emoji": True
            },
            "close": {
                "type": "plain_text",
                "text": "Cancel",
                "emoji": True
            },
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "*Hi {}*, how can support help you?".format(data["user_name"])
                    }
                },
                {
                    "type": "divider"
                },
                {
                    "type": "section",
                    "block_id": data["user_id"] + "priority",
                    "text": {
                        "type": "mrkdwn",
                        "text": ":chart_with_upwards_trend: *Urgency*\n Choose a priority for this issue"
                    },
                    "accessory": {
                        "type": "static_select",
                        "placeholder": {
                            "type": "plain_text",
                            "text": "Priority",
                            "emoji": True
                        },
                        "options": [
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "4",
                                    "emoji": True
                                },
                                "value": "priority-4"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "3",
                                    "emoji": True
                                },
                                "value": "priority-3"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "2",
                                    "emoji": True
                                },
                                "value": "priority-2"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "1",
                                    "emoji": True
                                },
                                "value": "priority-1"
                            }
                        ]
                    }
                },
                {
                    "type": "section",
                    "block_id": data["user_id"] + "problem",
                    "text": {
                        "type": "mrkdwn",
                        "text": ":interrobang: *Problem*\n Select the type of problem"
                    },
                    "accessory": {
                        "type": "static_select",
                        "placeholder": {
                            "type": "plain_text",
                            "text": "Problem",
                            "emoji": True
                        },
                        "options": [
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Account unlock",
                                    "emoji": True
                                },
                                "value": "account-unlock"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Forgot password",
                                    "emoji": True
                                },
                                "value": "forgot-password"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Local drive mapping",
                                    "emoji": True
                                },
                                "value": "local-drive-mapping"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Remote access issues",
                                    "emoji": True
                                },
                                "value": "remote-access-issues"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Slow virtual desktop platform",
                                    "emoji": True
                                },
                                "value": "virtual-machine-slow"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Hardware",
                                    "emoji": True
                                },
                                "value": "hardware"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Other",
                                    "emoji": True
                                },
                                "value": "hardware"
                            }
                        ]
                    }
                },
                {
                    "type": "section",
                    "block_id": data["user_id"] + "team",
                    "text": {
                        "type": "mrkdwn",
                        "text": ":briefcase: *Team*\nSelect the team you wish to contact"
                    },
                    "accessory": {
                        "type": "static_select",
                        "placeholder": {
                            "type": "plain_text",
                            "text": "Team",
                            "emoji": True
                        },
                        "options": [
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Helpdesk",
                                    "emoji": True
                                },
                                "value": "helpdesk"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Product Team",
                                    "emoji": True
                                },
                                "value": "product-team"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Infrastructure",
                                    "emoji": True
                                },
                                "value": "infrastructure"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Other",
                                    "emoji": True
                                },
                                "value": "other"
                            }
                        ]
                    }
                },
                {
                    "type": "input",
                    "block_id": data["user_id"] + "description",
                    "element": {
                        "type": "plain_text_input",
                        "multiline": True
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Description",
                        "emoji": True
                    }
                }
            ]
        }
        return view

    @staticmethod
    def update_view(view):
        print()
