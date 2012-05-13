cd ../../anima/scripts
./minify_client.sh
cd ../../pixelator/scripts

cp ../../anima/deploy/anima.js ../www/js

echo "Packaging Pixelator..."

rm -rf ../deploy
mkdir ../deploy

cat ../www/js/anima.js ../www/js/main.js >> app.js
/usr/local/lib/node_modules/uglify-js/bin/uglifyjs --max-line-len 1024 --mangle-toplevel --reserved-names "_anima_update,soundManager" --unsafe --output ../deploy/app.min.js app.js
rm app.js
echo "    compressed javascript files"

mkdir ../deploy/resources
cp -R ../www/resources/css ../deploy/resources
cp -R ../www/resources/images ../deploy/resources
cp -R ../www/resources/jqmobile ../deploy/resources
cp -R ../www/resources/sounds ../deploy/resources
cp -R ../www/resources/swf ../deploy/resources
echo "    copied resources"

mkdir ../deploy/js
cp -R ../www/js/lib ../deploy/js
echo "    copied libraries"

cp ../www/index.html ../deploy
sed -i '' 's/<script type="text\/javascript" src="js\/anima.js"><\/script>//g' ../deploy/index.html
sed -i '' 's/<script type="text\/javascript" src="js\/score.js"><\/script>//g' ../deploy/index.html
sed -i '' 's/<script type="text\/javascript" src="js\/main.js"><\/script>/<script type="text\/javascript" src="app.min.js"><\/script>/g' ../deploy/index.html
echo "    updated index.html"
echo "    OK!"
