#!/usr/bin/env python3

import os

dist = os.path.join(os.path.dirname(__file__), '..', 'dist')

with open(os.path.join(dist, 'critical.css')) as file:
    css = file.read()

replacements = {'styletag':'style', 'stylecontent': css}

lines = []
with open(os.path.join(dist, 'index.html')) as file:
    for line in file:
        for src, target in replacements.items():
            line = line.replace(src, target)
        lines.append(line)

with open(os.path.join(dist, 'index.html'), 'w') as file:
    for line in lines:
        file.write(line)
