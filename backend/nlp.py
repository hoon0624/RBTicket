from ibm_watson import NaturalLanguageUnderstandingV1
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
from ibm_watson.natural_language_understanding_v1 import Features, CategoriesOptions

class NaturalLanguageProcessing:

    @staticmethod
    def analyze_categories(url):
        authenticator = IAMAuthenticator('Wa3GWgIQ4n-T4ULUGv7W9nSTMSFdkeIgrwcDyGa1BY-q')
        natural_language_understanding = NaturalLanguageUnderstandingV1(
            version='2019-07-12',
            authenticator=authenticator
        )
        natural_language_understanding.set_service_url('https://api.us-east.natural-language-understanding.watson.cloud.ibm.com/instances/c0d30a3e-6ca3-4b31-a8dc-4e1c8a160e73')

        response = natural_language_understanding.analyze(url=url,features=Features(categories=CategoriesOptions(limit=3))).get_result()

        return response