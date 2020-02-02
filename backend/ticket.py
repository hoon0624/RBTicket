import json

class Ticket:
    def __init__(self, user_id, title, priority, problem, team, desc,pb_other=None,team_other=None):
        self.title = title
        self.priority = priority
        self.problem = problem
        self.team = team
        self.desc = desc
        self.pb_other = pb_other
        self.team_other = team_other
    
    def to_json(self):
        return self.map(lambda o: o.__dict__())