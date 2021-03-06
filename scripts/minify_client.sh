#
# Copyright 2012 Kostas Karolemeas, Spiros Xenos
#
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
#

cd ../anima/scripts
./minify_client.sh
cd ../../scripts

cp ../anima/deploy/anima.js ../www/js

echo "Packaging Pixelator..."

rm -rf ../deploy
mkdir ../deploy

cat ../www/js/anima.js ../www/js/global.js ../www/js/enemy.js ../www/js/character.js ../www/js/launcher.js ../www/js/obstacles.js ../www/js/level_1.js ../www/js/main.js >> app.js
uglifyjs --max-line-len 1024 --mangle-toplevel --reserved-names "_anima_update,soundManager" --unsafe --output ../deploy/app.min.js app.js
rm app.js
echo "    compressed javascript files"

mkdir ../deploy/resources
cp -R ../www/resources/css ../deploy/resources
cp -R ../www/resources/images ../deploy/resources
cp -R ../www/resources/shapes ../deploy/resources
cp -R ../www/resources/jqmobile ../deploy/resources
cp -R ../www/resources/sounds ../deploy/resources
cp -R ../www/resources/swf ../deploy/resources
echo "    copied resources"

mkdir ../deploy/js
cp -R ../www/js/lib ../deploy/js
echo "    copied libraries"

cp ../www/index.html ../deploy
sed -i '' 's/<script type="text\/javascript" src="js\/anima.js"><\/script>//g' ../deploy/index.html

sed -i '' 's/<script type="text\/javascript" src="js\/global.js"><\/script>//g' ../deploy/index.html
sed -i '' 's/<script type="text\/javascript" src="js\/enemy.js"><\/script>//g' ../deploy/index.html
sed -i '' 's/<script type="text\/javascript" src="js\/character.js"><\/script>//g' ../deploy/index.html
sed -i '' 's/<script type="text\/javascript" src="js\/launcher.js"><\/script>//g' ../deploy/index.html
sed -i '' 's/<script type="text\/javascript" src="js\/obstacles.js"><\/script>//g' ../deploy/index.html
sed -i '' 's/<script type="text\/javascript" src="js\/level_1.js"><\/script>//g' ../deploy/index.html
sed -i '' 's/<script type="text\/javascript" src="js\/main.js"><\/script>/<script type="text\/javascript" src="app.min.js"><\/script>/g' ../deploy/index.html
echo "    updated index.html"
echo "    OK!"
