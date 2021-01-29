from typing import Tuple
#import moodparser
import stanza
from textblob import TextBlob
from textblob.sentiments import NaiveBayesAnalyzer
import flair
from hyperopt import hp
from flair.hyperparameter.param_selection import SearchSpace, Parameter


def bold_print(msg: str) -> str:
    return f'\033[1m{msg}\033[0m'


def colour_print(colour: int, msg: str) -> str:
    # colour must be between 0 and 7
    colour += 30
    return f"\033[{str(colour)}m{msg}\033[0m"


def bold_colour_print(colour: int, msg: str) -> str:
    #colour must be between 0 and 7
    colour += 30
    return f"\033[1m\033[{str(colour)}m{msg}\033[0m\033[0m"

def extract_text(text: str) -> None:
    pass

def batch_testing(texts: Tuple) -> None:
    for text in texts:
        extract_text(text)
        print(bold_print(
            "--------------------------------------------------------------------------------------------------------"))

def stanza_test(texts: Tuple) -> None:
    config = {
        'lang':'en',
        'processors':'tokenize,sentiment',
        'use_device':'gpu'

    }
    #stanza.download('en')
    nlp = stanza.Pipeline(**config)
    for text in texts:
        doc = nlp(text)
        for i, sentence in enumerate(doc.sentences):
            print(text, sentence.sentiment)

def textblob_test(texts: Tuple) -> None:
    for text in texts:
        testimonial = TextBlob(text, analyzer=NaiveBayesAnalyzer())
        print(text, testimonial.sentiment)


def flair_test(texts: Tuple) -> None:
    flair_sentiment = flair.models.TextClassifier.load('en-sentiment')
    for text in texts:
        s = flair.data.Sentence(text)
        flair_sentiment.predict(s)
        total_sentiment = s.labels[0]
        score = total_sentiment.score
        score *= -1 if total_sentiment.value == "NEGATIVE" else 1
        if score >= 0.6:
            sentiment = "positive"
            colour = 4
        elif score >= -0.5:
            sentiment = "neutral"
            colour = 3
        else:
            sentiment = "negative"
            colour = 1
        print(colour_print(colour, sentiment + ", " + str(score) + ", " + text))

if __name__ == "__main__":
    feedback1 = (
        "This workshop is terrible.",
        "This talk is interesting.",
        "This guy is killing it!",
        "This company is bad ass.",
        "Please speed up. ",
        "Zzzzz.",
        "What are you doing!",
        "Cool cool.",
        "Can you skip the safety briefing.",
        "This is exhausting."
    )
    feedback2 = (
        "I don't know who Apple typically sends over for these things, but I'm sure this guy "
        "isn't used to public speaking. ",
        "We've had enough!",
        "Why are you still doing this to us."
    )
    flair_test(feedback1+feedback2)