# Translucency-Discrimination-Experiment
The interface was built with psiturk and the experiment was posted on amazon mechanical turk to collect human data.
## About PsiTurk
Psiturk is a toolbox that helps users to design and run fully-customized and dynamic web-experiment on Amazon Mechanical Turk.
###### Install PsiTurk
Psiturk can be easily installed with python package manager (pip) by input:
```
$ pip install psiturk
```
###### Getting start with PsiTurk project
PsiTurk includes a sample project which you can use to get started. 
```
$ psiturk-setup-example
```
###### Enter credentials
In order to get access to all the psiTurk features you need to enter both AMT and psiturk credentials for accessing Amazon Web Services and psiturk.org. Both of these can be added to ~/.psiturkconfig.
```
$ cat ~/.psiturkconfig
```
Output:
```
[AWS Access]
aws_access_key_id = YourAccessKeyId
aws_secret_access_key = YourSecretAccessKey
aws_region = us-east-1

[psiTurk Access]
psiturk_access_key_id = YourAccessKeyId
psiturk_secret_access_id = YourSecretAccessKey
```
## Customize Interface
###### config.txt
config.txt contains general settings about the project. HIT configuration contains information that will show on AMT including project title, project description, keywords, and etc. Database parameter would decide where the result will be saved at. Server parameter contains general server information. If you are using personal server the server address shoud be put in the line of adserver_revproxy_host.
###### HTML
Template folder contains html files with different functions including instructions, errors, and questionnaire etc. The main experiment page is stage.html. To make dynamic project interface, you can create some empty divs in stage.html and define functions in task.js to manipulate the divs. The display order of html files is also defined in task.js.
###### task.js
task.js is the main javascript file of the project where all the functions are defined. It contains some default functions such as recording data, displaying trails, and handling keyboard response. User can customize the interface by modifying the default functions.
###### custom.py
custom.py is the main backend script file. All customized backend functions such as database connection and http calls should be put in this file.
###### participants.db
participants.db is the default sqlite database. It contains a demo table which will record results of the project. Each line of result would contain worker's information, HIT id, date, and worker's responses. If you want to change the default database or table, you can make it by changing the database parameter in config.txt.
## Deploy code to Heroku
In order to allow workers to do the project, you would have to deploy the interface on a server. Heroku is a cloud service that lets you run applications in the cloud. You can run psiTurk on Heroku by preparing a git repository and then pushing it to Heroku which will deploy and autorun the code for you. To deploy the code to Heroku you can follow the procedures below.
- Create a heroku account on heroku website.
- Install git and Heroku command line tool.
- Navigate into your project folder and run:
``` 
git init
```
- Login to Heroku:
```
heroku login
```
- Create a new app on Heroku:
```
heroku create
```
- Create a Postgres database for your app:
```
heroku addons:create heroku-postgresql
```
- Get the URL of the database:
```
heroku config:get DATABASE_URL
```
- Get the URL of the app:
```
heroku domains
```
- Update config.txt with the information above:
```
database_url = <Your Postgres database URL that you retrieved above>
host = 0.0.0.0
threads = 1
ad_location = https://<Your app URL that you retrieved above>/pub
use_psiturk_ad_server = false
```
- Run the following commands, replacing <XYZ> with your access and secret keys for Amazon Web Services and psiTurk Secure Ad Server:
```
heroku config:set ON_HEROKU=true
heroku config:set psiturk_access_key_id=<XYZ>
heroku config:set psiturk_secret_access_id=<XYZ>
heroku config:set aws_access_key_id=<XYZ>
heroku config:set aws_secret_access_key=<XYZ>
```
- Push the code to Heroku repository:
```
git add -A
git commit -m "Initial commit"
git push heroku master
```
## Post HIT
PsiTurk has its own command line tool which helps users to test and publish HITs. You can run the command line tool locally by input psiturk in your terminal.
```
psiturk
```
After input the command, you will get into the command line tool and you will see the information such as server, mode, and number of HITs.
```
[psiTurk server:off mode:sdbx #HITs:0]$ 
```
Server can be switch by inputting server on / server off. To create hit, you can input:
```
[psiTurk server:on mode:sdbx #HITs:0]$ hit create
number of participants? 10
reward per HIT? 1.00
duration of hit (in hours)? 24
```
To check the status of HIT, you can input:
```
[psiTurk server:on mode:sdbx #HITs:0]$ hit list --active
Stroop task
  Status: Reviewable
  HITid: 28K4SME3ZZ2MZI004SETTTXTTAG44LT
  max:10/pending:1/complete:0/remain:9
  Created:2014-04-02T19:45:42Z
  Expires:2014-04-02T19:48:48Z
```
The default mode of the project sdbx which is [sandbox of AMT](https://requester.mturk.com/developer/sandbox) that allows users to test their HIT. To publish the HIT to AMT you will have to switch the mode to live by input:
```
[psiTurk server:on mode:sdbx #HITs:1]$ mode
```

## Fetch result
After the HIT was finished, you can fetch the data that recorded in the default database by input download_datafiles command in psiturk command line tool.
```
download_datafiles
```
The command will download three files: eventdata.csv, questiondata.csv, traildata.csv.
eventdata.csv records user's actions such as click, focus, resize window.
questiondata.csv records the result of questionnaire.
traildata.csv records the result of the experiment. 
All of the three csv files would record workers' ids which are matched with AMT website. 
