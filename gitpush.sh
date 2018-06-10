#! /bin/zsh
DATE=`date +"%Y-%m-%d"`

echo "Start git,please wait...."
git add .
echo "add end..."
git commit -m "${DATE}"
echo "commit end..."
git push origin hexo
if [ $? -eq 0 ];then
    echo -e "\033[32m---------->>>  push succeed ！！！\033[0m\n"
else
    echo -e "\033[32m---------->>>  push failed  ！！！\033[0m\n"

echo "push end"
echo "___________________________________________________"