#!/usr/bin/env bash
# Output the "no mod" file to "build/urlfor.js" since esbuild names the map
# source whatever the original input file is named.  

file=urlform.js
minfile=urlform.min.js
match="//////////////////////////////Regex_match_for_truncation_for_umd"
line_num=$(grep -n "$match" $file | cut -d : -f 1)
echo "Line number for truncation: $line_num"
mkdir build
head -n $(($line_num - 1)) $file > build/urlform.js
esbuild build/urlform.js --minify --sourcemap --outfile=$minfile
rm -r build

# Add back in UMD Module.  
tail -n +$(($line_num + 1)) $file >> $minfile



