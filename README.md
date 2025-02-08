
# Wedding Invitation Portal
## Website Url

https://invitation.itdevs.in
## Installation

- Generate Personal access token from https://github.com/settings/tokens
- Optional Part: For local 
    - Install xampp server [https://www.apachefriends.org/]  [php version 8.2.12]
    - Install composer [https://getcomposer.org/download/]  [version 2.7.7]
    - Install Node [https://nodejs.org/en/download/package-manager]
    - Install Symfony [https://symfony.com/download]
- From your terminal go to your directory where you want install the project [for local it is inside C:/xampp/htdocs folder]
```bash
git clone https://github.com/webcode-professionals/invitation-portal.git
```
- Provide credentials of github.
```bash
cd webportal
composer install
npm install [from local]
```
- create .env.local file with the content of .env file and update it with your credentials [like database]
```bash
php bin/console doctrine:migratation:migrate [yes]
php bin/console c:c [for clear cache]
git checkout -b 'your branch name' [from where you push all your changes]
```
- For update in content open /public/js/sfinv_en.js, /public/js/sfinv_hn.js and do the changes
- Optional Part: For local
    - symfony server:start [stop]
    - Navigate this url from browser http://127.0.0.1:8000
- Before push, update .env.local file APP_ENV to prod and run the command 
```bash
npm run build
```
- Following useful git command
```bash
git status
git add filename
git commit -m 'message'
git pull origin main
git push origin 'your branch name'
```