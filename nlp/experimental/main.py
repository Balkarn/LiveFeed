from typing import Tuple
#import moodparser
import stanza


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
    stanza.download('en')
    nlp = stanza.Pipeline(lang='en', processors='tokenize,sentiment')
    for text in texts:
        doc = nlp(text)
        for i, sentence in enumerate(doc.sentences):
            print(sentence, sentence.sentiment)


if __name__ == "__main__":
    feedback1 = (
        "This workshop is terrible",
        "This talk is interesting",
        "This guy is killing it!",
        "This company is bad ass.",
        "Please speed up. ",
        "Zzzzz",
        "What are you doing!",
        "Cool cool",
        "Can you skip the safety briefing.",
        "This is exhausting"
    )
    feedback2 = (
        "I don't know who Apple typically sends over for these things, but I'm sure this guy "
        "isn't used to public speaking. ",
        "We've had enough!",
        "Why are you still doing this to us!",
        ""
    )
    stanza_test(feedback1)