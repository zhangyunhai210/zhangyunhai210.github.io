#! /bin/zsh
DATE=`date +"%Y-%m-%d"`

echo -e "\033[32m---------->>> Start git,please wait....\033[0m\n"
git add .
echo -e "\033[32m---------->>> add end...\033[0m\n"
git commit -m "${DATE}"
echo -e "\033[32m---------->>> commit end...\033[0m\n"
git push origin hexo
if [ $? -eq 0 ];then
    echo -e "\033[32m---------->>>  push succeed ！！！\033[0m\n"
else
    echo -e "\033[32m---------->>>  push failed  ！！！\033[0m\n"
fi
echo -e "\033[32m---------->>> push end\033[0m\n"
echo -e "\033[32m----------------------------------------------------\033[0m\n"
hexo g -d
if [ $? -eq 0 ];then
    echo -e "\033[32m---------->>> hexo push succeed !!!\033[0m\n"
else
    echo -e "\033[32m---------->>> hexo push failed !!!\033[0m\n"
fi
echo -e "\033[32m---------->>> hexo end\033[0m\n"
echo -e "\033[32m----------------------------------------------------\033[0m\n"
