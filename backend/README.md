# Web Push API notification 

This is a simple django application that render a web browser push notification.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### :dart: Prerequisites

* First of all you need to install these softwares in order to build the project:

``` bash
sudo apt install python3-pip python3-dev git
```

* If you are using Python 3, upgrade pip and install the package by typing:

```bash
sudo -H pip3 install --upgrade pip
sudo -H pip3 install virtualenv
```

###  :page_with_curl: Installing

A step by step series of commands that will let the application run :

* Prepare your workspace : 

```sh
mkdir ~/myproject
cd ~/myproject
```

* Within the project directory, create a Python virtual environment by typing:

```sh
virtualenv mypythonvirtualenv
```

This will create a directory called myprojectenv within your myproject directory. Inside, it will install a local version of Python and a local version of pip. We can use this to install and configure an isolated Python environment for our project.

Before we install our project’s Python requirements, we need to activate the virtual environment. You can do that by typing:

```sh
source myprojectenv/bin/activate
```

Your prompt should change to indicate that you are now operating within a Python virtual environment. It will look something like this: (myprojectenv)user@host:~/myproject$.

---
:warning: **NOTE**

**Regardless of which version of Python you are using, when the virtual environment is activated, you should use the pip command (not pip3).**

---

* Now that your virtualenv is up and running, we will clone the current repository inside the virtualenv :

```sh
git clone https://github.com/tchimih/djangular-webnotification.git
```

* Once cloned, we will install all of the dependencies as follow :

```sh
pip3 install -r requirements.txt
```

This command will only install the listed dependencies (libraries) inside the python virutal environnement. This is the benefit of it.

* Last, now that everything is installed and the environnement prepared, we only need to launch the application to check if it is working correctly :

```sh
python3 manage.py runserver 0.0.0.0:8000
```

## :rocket: Launch the application

In order to launch the application, you **must use HTTP over TLS (HTTPS)**. This is a constraint dicated by the web push APIs.

### Developpement mode

In developpement mode, we will only use ngrok and django. So in this section, we will use ngrok in tunnel mode operating in port 8000 and it will redirect to locatlhost on port 8080 as follow.

 > For this matter, you will need to install ngrok on your server/envrinonnemt.

1. Launch ngrok as follow :

```sh
ngrok http 0.0.0.0:8000
```

Once the tunnel is created, you will have something like this :

 ![Ngrok tunnel](assets/ngrok.PNG)

2. Now, we only need to launch the django web app as follow :

```sh
python3 manage.py runserver 0.0.0.0:8000
```

And at the end, we will have something like this :

![Django](assets/django.PNG)

---
:warning: **NOTE**

**However, you need to be logged in to display the notification.**

In this matter, you will need to create, for instance, a superuser (or if you use your own authentication, please ignore this note) as follow :

```sh
python3 manage.py createsuperuser
```

Then navigate to **/admin** on your browser and authenticate.

---

### Production mode 

In the production mode, we will use nginx with gunicorn in order to stabilize the application. You will need to follow theses instructions :

* Install pre-requists
```sh
sudo apt install nginx 
```

* Create a Gunicorn systemd Service File

We have tested that Gunicorn can interact with our Django application, but we should implement a more robust way of starting and stopping the application server. To accomplish this, we’ll make a systemd service file.

Install Gunicorn
```sh
pip install gunicorn
```

Create and open a systemd service file for Gunicorn with sudo privileges in your text editor:

```sh
sudo vi /etc/systemd/system/gunicorn.service
```

And put inside it the following :

```sh
[Unit]
Description=gunicorn daemon
After=network.target

[Service]
# Put here your user
User=deadbeef
Group=www-data
WorkingDirectory=/home/deadbeef/myproject
ExecStart=/home/deadbeef/myproject/myprojectenv/bin/gunicorn --access-logfile - --workers 3 --bind unix:/home/deadbeef/myproject/myproject.sock myproject.wsgi:application

[Install]
WantedBy=multi-user.target
```

This will create a unix socket that will let nginx to interact with. We can now start the Gunicorn service we created and enable it so that it starts at boot:

```sh
sudo systemctl start gunicorn
sudo systemctl enable gunicorn
```

* Check for the Gunicorn Socket File

Check the status of the process to find out whether it was able to start:

```sh
sudo systemctl status gunicorn 
```

If the systemctl status command indicated that an error occurred or if you do not find the myproject.sock file in the directory, it’s an indication that Gunicorn was not able to start correctly. Check the Gunicorn process logs by typing:

```sh
sudo journalctl -u gunicorn
```

Take a look at the messages in the logs to find out where Gunicorn ran into problems. There are many reasons that you may have run into problems, but often, if Gunicorn was unable to create the socket file, it is for one of these reasons:

- The project files are owned by the root user instead of a sudo user
- The WorkingDirectory path within the /etc/systemd/system/gunicorn.service file does not point to the project directory
- The configuration options given to the gunicorn process in the ExecStart directive are not correct. Check the following items:
- The path to the gunicorn binary points to the actual location of the binary within the virtual environment
- The --bind directive defines a file to create within a directory that Gunicorn can access
- The myproject.wsgi:application is an accurate path to the WSGI callable. This means that when you’re in the WorkingDirectory, you should be able to reach the callable named application by looking in the myproject.wsgi module (which translates to a file called ./myproject/wsgi.py)

If you make changes to the /etc/systemd/system/gunicorn.service file, reload the daemon to reread the service definition and restart the Gunicorn process by typing:

```sh
sudo systemctl daemon-reload
sudo systemctl restart gunicorn
```

* Configure Nginx to Proxy Pass to Gunicorn

Now that Gunicorn is set up, we need to configure Nginx to pass traffic to the process.

Start by creating and opening a new server block in Nginx’s sites-available directory:

```sh
sudo vi /etc/nginx/sites-available/myproject
```

And we need to put inside this :

```sh
server {
    listen 443 ssl http2;
    server_name $server_name;

    location = /favicon.ico { access_log off; log_not_found off; }
    location /static/ {
        root /home/deadbeef/myproject;
    }

    location / {
        include proxy_params;
        proxy_pass http://unix:/home/deadbeef/myproject/myproject.sock;
    }
}
```

Save and close the file when you are finished. Now, we can enable the file by linking it to the sites-enabled directory:

```sh
sudo ln -s /etc/nginx/sites-available/myproject /etc/nginx/sites-enabled
```

Test your Nginx configuration for syntax errors by typing:

```sh
sudo nginx -t
```

If no errors are reported, go ahead and restart Nginx by typing:

```sh
sudo systemctl restart nginx
sudo systemctl enable nginx
```

And tadaaaa, your notification application is available by browsing to **https://$server_name/**

## How it works under the hood

@TO DO
