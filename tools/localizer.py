import os
import re
import sys

if len(sys.argv) != 5:
    print("Invalid number of parameters !")
    print("localizer.py <input_path> <filename_pattern> <lang_path> <lang1>[;lang2[...]]")
    sys.exit(1)

input_path = sys.argv[1]
filename_pattern = sys.argv[2]
lang_path = sys.argv[3]
langs = sys.argv[4].split(";")

files_to_translate = ""
