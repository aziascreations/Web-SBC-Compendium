import os
import sys

if len(sys.argv) != 4:
    print("Invalid number of parameters !")
    print("localizer.py <input_path> <lang_path> <lang1>[;lang2[...]]")
    sys.exit(1)

input_path = sys.argv[1]
lang_path = sys.argv[2]
langs = sys.argv[3].split(";")

files_to_translate = ""
