from datetime import datetime, timezone
import json
import os
import sys

if len(sys.argv) != 4:
    print("Invalid number of parameters !")
    sys.exit(1)

input_dir = sys.argv[1]
output_dir = sys.argv[2]
output_filename = sys.argv[3]

compile_time = int(datetime.now(timezone.utc).replace(tzinfo=timezone.utc).timestamp())

if not os.path.exists(input_dir):
    print("The input path '{}' doesn't exist !".format(input_dir))
    sys.exit(2)

if not os.path.exists(output_dir):
    print("The output path '{}' doesn't exist !".format(output_dir))
    sys.exit(3)

output_data = {
    "author": {},
    "manufacturer": {},
    "sbc": {},
    "cpu": {},
    "soc": {},
    "license": {},
    "version": compile_time
}


def handle_directory(input_dir, sub_dir, output_dict):
    for sub_file in os.listdir(os.path.join(input_dir, sub_dir)):
        file_path = os.path.join(input_dir, sub_dir, sub_file)
        if sub_file.endswith(".json"):
            id = os.path.splitext(sub_file)[0]
            with open(file_path) as json_file:
                data = json.load(json_file)
                output_dict[sub_dir][id] = data
    return output_dict


output_data = handle_directory(input_dir, "manufacturer", output_data)
output_data = handle_directory(input_dir, "sbc", output_data)
output_data = handle_directory(input_dir, "cpu", output_data)
output_data = handle_directory(input_dir, "soc", output_data)
output_data = handle_directory(input_dir, "license", output_data)
output_data = handle_directory(input_dir, "author", output_data)

try:
    os.remove(os.path.join(output_dir, output_filename))
except Exception:
    pass

with open(os.path.join(output_dir, output_filename), "wb") as f:
    f.write(json.dumps(output_data, separators=(',', ':')).encode("utf-8"))

# This file is used to test data caching later on.
with open(os.path.join(output_dir, output_filename) + ".version", "wb") as f:
    f.write(str(compile_time).encode("utf-8"))
