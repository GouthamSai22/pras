import pytesseract
from PIL import Image
from dotenv import load_dotenv
import os
from pyzbar import pyzbar
import nltk

load_dotenv()

pytesseract.pytesseract.tesseract_cmd = os.getenv("TESSERACT_PATH")

# download the required corpus and model data
try:
    nltk.data.find('tokenizers/punkt')
    nltk.data.find('taggers/averaged_perceptron_tagger')
    nltk.data.find('chunkers/maxent_ne_chunker')
    nltk.data.find('corpora/words')
except LookupError:
    nltk.download('punkt')
    nltk.download('averaged_perceptron_tagger')
    nltk.download('maxent_ne_chunker')
    nltk.download('words')

def get_text_from_image(img):
    text = pytesseract.image_to_string(img)
    barcodes = pyzbar.decode(img)
    for barcode in barcodes:
        barcodeData = barcode.data.decode("utf-8")

    lines = text.splitlines()
    sentences = []
    for line in lines:
        sentences += nltk.sent_tokenize(line)

    name_detected = ""
    flag = 0

    for sentence in sentences:
        words = nltk.word_tokenize(sentence)
        tagged = nltk.pos_tag(words)
        # use the named entity recognizer to extract named entities
        named_entities = nltk.ne_chunk(tagged)
        # loop over each named entity
        for entity in named_entities:
            # if the entity is a person and has a label of 'PERSON'
            if hasattr(entity, 'label') and entity.label() == 'PERSON' and flag == 0:
                # check if the person is an Indian name by looking for Indian prefixes
                name_detected = ' '.join(c[0] for c in entity.leaves() if c[0] not in ['Mr.', 'Ms.', 'Mrs.', 'Dr.'])
                flag = 1
                break
        if flag == 1:
            break

    for line in lines:
        if name_detected in line:
            full_name = line.strip()
            break
    
    return {"package_number": barcodeData, "owner_name": full_name}

img = Image.open('images/test_image.jpeg').convert('L')
package = get_text_from_image(img)
print(package)
