<a href="http://fvcproductions.com"><img height="150" width="150" src="https://www.svgrepo.com/show/133978/bug.svg" title="FVCproductions" alt="FVCproductions"></a>
# Spuggy
> A blazingly fast, efficient and an easy to use bug tracking system.
#### Prerequisites:
- Python 3
- pip
- PostgreSQL Database and pgAdmin 4
- npm
## Setup Instructions:

- Clone this repository to your local machine using this [url](https://github.com/Sparsh1212/Spuggy)
- Setup the virtual enviornment by navigating to the base directory and then run the command

`virtualenv spuggy_env`
- Activate the virtual enviornment

`.\spuggy_env\Scripts\activate`
- Using pgAdmin 4 create a postgresql database and take a note of the name of the database created.
- Navigate inside the cloned repository and install the required dependencies using `pip install -r requirements.txt`
- Create a .env file (in the same location where manage.py is present) and enter the required information using the .env.example file as a template.

> Note: (This app uses Simple Mail Transfer Protocol as communication protocol for electronic mail transmission)
- Navigate to frontend directory from the base directory using `cd frontend-beta-spuggy`
- Then run the  commands `npm install` and `npm run build`
- Navigate back to the base directory using `cd ..`
- Run the commands `py manage.py makemigrations` and  `py manage.py migrate` to create the tables in the postgresql database.

## Launching the application
- Navigate to the base directory and run the command `py manage.py runserver` then headover to this [url](http://127.0.0.1:8000/) in your browser to test the application.

 


