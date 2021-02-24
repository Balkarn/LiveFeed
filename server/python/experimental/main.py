from typing import Tuple
#import moodparser
import stanza
from textblob import TextBlob
from textblob.sentiments import NaiveBayesAnalyzer
import flair
import nltk.sentiment
from nltk.sentiment.vader import SentimentIntensityAnalyzer
#import vader
#import fastai
#import keras
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

def stanza_test(texts: Tuple) -> int:
    config = {
        'lang':'en',
        'processors':'tokenize,sentiment',
        'use_device':'gpu'

    }
    #stanza.download('en')
    _score = 0
    nlp = stanza.Pipeline(**config)
    for (text, _sentiment, _weight) in texts:
        doc = nlp(text)
        for i, sentence in enumerate(doc.sentences):
            print(text, sentence.sentiment)
            if (_sentiment == 'ambigious') or \
                (sentence.sentiment == 0 and _sentiment == 'negative') or \
                (sentence.sentiment == 1 and _sentiment == 'neutral') or \
                (sentence.sentiment == 1 and _sentiment == 'positive'):
                _score += _weight
    return _score



def textblob_test(texts: Tuple) -> int:
    _score = 0
    for (text, _sentiment, _weight) in texts:
        testimonial = TextBlob(text, analyzer=NaiveBayesAnalyzer())
        print(text, testimonial.sentiment)
        if (_sentiment == 'ambigious') or \
                (testimonial.sentiment[0] == 'neg' and _sentiment == 'negative') or \
                (testimonial.sentiment[0] == 'pos' and testimonial.sentiment[1] == testimonial.sentiment[2]
                 and _sentiment == 'neutral') or \
                (testimonial.sentiment[0] == 'pos' and _sentiment == 'positive'):
            _score += _weight
    return _score


def flair_test(texts: Tuple) -> int:
    flair_sentiment = flair.models.TextClassifier.load('en-sentiment')
    _score = 0
    for (text, _sentiment, _weight) in texts:
        s = flair.data.Sentence(text)
        flair_sentiment.predict(s)
        total_sentiment = s.labels[0]
        score = total_sentiment.score
        score *= -1 if total_sentiment.value == "NEGATIVE" else 1
        if score >= 0.6:
            sentiment = "positive"
        elif score >= -0.5:
            sentiment = "neutral"
        else:
            sentiment = "negative"
        if _sentiment == sentiment or _sentiment == 'ambiguous':
            _score += _weight
        print(s.labels)
        print(sentiment + ", " + str(score) + ", " + text)
    return _score

def vader_test(texts: Tuple) -> int:
    analyser = SentimentIntensityAnalyzer()
    _score = 0
    for (text, _sentiment, _weight) in texts:
        print(text)
        ss = analyser.polarity_scores(text)
        for k in sorted(ss):
            print('{0}: {1}, '.format(k, ss[k]), end='')
        if (_sentiment == 'ambigious') or \
                (ss['compound'] < 0 and _sentiment == 'negative') or \
                (ss['compound'] == 0 and _sentiment == 'neutral') or \
                (ss['compound'] > 0 and _sentiment == 'positive'):
            _score += _weight
    return _score

def fastai_test(texts: Tuple) -> None:
    pass

def top_test_score(texts: Tuple) -> int:
    sum = 0
    for text in texts:
        sum += text[2]
    return sum

def test_all(texts: Tuple) -> None:
    print("\n-----Stanza-----\n")
    stanza_score = stanza_test(texts)
    print("\n\n-----TextBlob-----\n")
    textblob_score = textblob_test(texts)
    print("\n\n-----Flair-----\n")
    flair_score = flair_test(texts)
    print("\n\n-----Vader-----\n")
    vader_score = vader_test(texts)

    print("\n\n")
    print("Expected Score: "+str(top_test_score(texts)))
    print("Stanza Score: "+str(stanza_score))
    print("TextBlob Score: "+str(textblob_score))
    print("Flair Score: "+str(flair_score))
    print("Vader Score: "+str(vader_score))

if __name__ == "__main__":
    # feedback = ((feedback, sentiment, weighting: 2=obvious->0=ambiguous))
    feedback1 = (
        ("This workshop is terrible.", 'negative', 2),
        ("This talk is interesting.", 'positive', 2),
        ("This guy is killing it!", 'ambiguous', 0),
        ("This company is bad ass.", 'positive', 1),
        ("Please speed up. ", 'negative', 1),
        ("Zzzzz.", 'ambiguous', 0),
        ("What are you doing!", 'negative', 1),
        ("Cool cool.", 'positive', 2),
        ("Can you skip the safety briefing.", 'neutral', 0),
        ("This is exhausting.", 'negative', 2)
    )
    feedback2 = (
        ("I don't know who Apple typically sends over for these things, but I'm sure this guy "
         "isn't used to public speaking. ", 'negative', 1),
        ("We've had enough!", 'negative', 2),
        ("Why are you still doing this to us.", 'negative', 1)
    )

    test_all(feedback1+feedback2)