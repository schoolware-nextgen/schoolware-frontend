npx expo export --platform web
cd /home/mb/schoolware-frontend-website
find ./ -mindepth 1 ! -regex '^./.git\(/.*\)?' -delete
cp -r ../schoolware-frontend/dist/* ./
git add .
git commit -m "deploy"
git push -u origin main
echo "done deploying"
