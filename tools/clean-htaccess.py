import os
import sys

if len(sys.argv) != 3:
    print("Invalid number of parameters !")
    sys.exit(1)

input_filename = sys.argv[1]
output_filename = sys.argv[2]

if not os.path.isfile(input_filename):
    print("The input file '{}' doesn't exist !".format(input_filename))
    sys.exit(2)

with open(input_filename, "r") as f:
    input_config_lines = f.readlines()

output_config_lines = [
    line.strip()
    for line in input_config_lines
    if not (line.strip().startswith("#") or len(line.strip()) == 0)
]

with open(output_filename, "wb") as f:
    f.write("\n".join(output_config_lines).encode("utf-8"))
