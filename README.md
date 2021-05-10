## David Energy

### Prerequisites

```
python3 (3.7.5)
pyenv
pipenv
PostgreSQL
```

## Use Python 3.7.5


*for MacOS/Linux

If you don't have Homebrew installed, run the installation command on,

https://brew.sh/


```
brew install pyenv
brew install pipenv
pyenv install 3.7.5
pyenv shell 3.7.5
```

*for Windows
```
pip install pyenv-win   --Add necessary ENVIRONMENT PATH
pip install pipenv
```


## Installing Postgresql

As of this Readme, our Heroku deployment runs Postgres 12 (and it's also the latest release), so it's a good idea to have Postgres 12 installed on your system.
If there is a newer version available you may need to add a suffix like so - `postgresql@12`.

https://formulae.brew.sh/formula/postgresql

*for MacOS
```
brew install postgresql
```

*for Linux

(Brew cannot handle services on Linux, so I had to install Postgres directly - egor83)
https://www.postgresql.org/download/linux/ubuntu/

If you want to explicitly install Postgres 12, make one change to the last line of the script and install:
```
sudo apt-get install postgresql-12
```


*for Windows
```
dowload postgresql version 11.7 from:
https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

install the version and set user:postgres and password:password
```

Then install the dependicies (make sure postgresql is installed before):

*Same for MacOS/Linux/Windows
```
cd dave-energy
pipenv install --dev
```

If you get an error regarding zlib, following instructions here: https://github.com/jiansoung/issues-list/issues/13

Add the following lines to always be in python 3.7.5 to your .bash_profile and .bashrc file

```
eval "$(pyenv init -)"
pyenv shell 3.7.5
```

### Timezones in Postgres

I ran into various test problems dealing with TZs, so you might have to set your Postgres timezone to UTC, which solved TZ-related problems for me:
```
ALTER DATABASE denergy SET timezone TO 'UTC';
ALTER DATABASE denergy_test SET timezone TO 'UTC';
```
I also edited pg_hba.conf to set `timezone` and `log_timezone` to 'UTC'.
Then restart it with:
`sudo systemctl restart postgresql@12-main`


## Developing on the backend

### Database connection:

create a david-energy database:
don't have postgresql installed? Refer to the section above titled "Installing Postgresql"

*for MacOS
```
brew services start postgresql
```

*For Linux

Brew cannot handle services on Linux, so install Postgres as described above and run server with:
```
pg_ctlcluster 12 main start
```

Before you connect to DB, you might have to create a user and upgrade him to superuser (NB username might be different on your system), per
https://stackoverflow.com/questions/11919391/postgresql-error-fatal-role-username-does-not-exist/18708583#18708583
```
sudo -u postgres createuser user
sudo -u postgres psql
ALTER USER "user" with superuser;
```

Connecting to the DB:
```
psql -d template1
create database denergy;
\c denergy ;
```

Also create a test database:

```
create database denergy_test;
\c denergy_test ;
```

Also create postgres user in test database,

```
create user postgres SUPERUSER;
```

*for windows

Open SQL shell (search from windows search bar)

Skip through [Server, Database, Port, Username] by pressing enter

Enter the password : password

to create database:
```
postgres=# CREATE DATABASE denergy;
postgres=# \l ->to see if the data base was created
```

Database may also be created using pgAdmin

Also create a test database:
```
CREATE DATABASE denergy_test ;
```

and create postgres user in test database,

```
create user postgres SUPERUSER;
```

If you see an `address already in use error` when trying to run `brew services start postgresql`, try

```
brew services list
brew services stop (OLD POSTGRES)
```

Run migrations:

```
FLASK_ENV=development pipenv run flask db upgrade
```

If you get an error about missing password, do
```
psql -d template1
ALTER USER postgres WITH PASSWORD 'password';
```
and change LocalConfig in config.py to
```
SQLALCHEMY_DATABASE_URI = "postgres://postgres:password@localhost/denergy"
```

### Pre-commit

```
pip install pre-commit
pre-commit install
```




### If you are a new dev and are setting up your local dev environment, you can jump to the, 'Run test' section below.



### Start local server

```
cd dave-energy
FLASK_ENV=development pipenv run flask run
```

- go to: http://localhost:5000/

If you're using pyenv, you might need to specify the path to the python executable
installed through pyenv. You can get the path by doing:

```
pyenv which python
```

You can also add `FLASK_ENV` to your environment variables by adding

```
export FLASK_ENV=development
```

to your `.bash_rc` or `.zshrc`.

Don't have selenium?

```
brew cask install chromedriver
```

### Add dependencies

```
pipenv install <pip-package>
```

### Schema migrations

Update the model, then run

```
FLASK_ENV=development pipenv run flask db migrate -m 'YOUR COMMENT HERE'
```

to generate the alembic migration. _Make sure to glance at the auto-generated migration
file to double check that it's not unexpectedly going to drop anything._ Computers
aren't perfect! If you're connected to a local database, run

```
FLASK_ENV=development pipenv run flask db upgrade
```

to apply the migrations.

**Note**: `FLASK_ENV=development` tells flask to run using local config. If you're developing against the staging
database, running the `upgrade` command locally without rolling it back will likely cause
the migration to fail during deploy.

If you're developing against the production database, maybe just...don't.

## Developing on the client side

Please refer to `./client/README.md`.

### RabbitMQ:

RabbitMQ is a message-broker software that implements the Advanced Message Queuing Protocol (AMQP)
to install it:

```
brew install rabbitmq
brew services start rabbitmq
```

the go to the default local url:

```
http://localhost:15672/#/
```

type in guest, guest

### Celery:

Celery is an asynchronous task queu.
We use it, for example, to connect with different loan providers. It should be installed with regular python dependencies

On local, open a new terminal and run:

```
FLASK_ENV=development pipenv run celery worker -A tasks --loglevel=info
```

### Cron job

Cron jobs scheduler runs on a different server.
Look into the Pipfile.

To look at the logs for the cron job, look for example here:
```
heroku logs -t -r staging -d=cron
```

You can start cron job locally like this here:
```
FLASK_ENV=development pipenv run flask run
```


### Logs

Looking at logs can be done with the following command:
```
heroku logs -t -r staging
```

or you can look at those here:
https://my.papertrailapp.com/events?q=error


## AWS Credentials

Reach out to someone in engineering to grant you access to AWS. Once you have the access and secret keys, create `~/.aws/credentials` and populate it with:
```
[default]
aws_access_key_id = <access_key>
aws_secret_access_key = <secret_key>
```


enjoy
