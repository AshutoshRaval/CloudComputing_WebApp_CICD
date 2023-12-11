# WebApplication and CI/CD pipeline 

The reporistory consist of the web application having RestAPI's to perform CRUD opreations using NodeJS. It also has packer file and few configuration files required further in the application deployemnet to AWS.

**Highlights of the Reporistory**
- Git Action workflows and enabled on it.
- Packer file for AMI configurations.
- Web application developed in MVC architecture.
- Some addition Utilies and External services.
- Jest and cloudwatch configuration files.
- Autorun using Sytemd.
- Sequlize ORM.
- bash Scripts.
- Winston for logging and hotshots for the Cloud watch logging.

**To run the above library in your machine follow the below steps**
- Clone the repo at your end and instal the required packages in the folder using "npm i"
- Create and .env file with the details of your MySQL server
- Run the command "node server.js"

**To run the CI/CD pipeline.**
- After making the necessary changes on the web application perform the push the branch of the repo
- Brach protection rule has been implemented on the main branch of the repo
- After the sucesfull push to the branch then implement the Pull Request (PR)
- The workflows in the GitWorkflows folder would automatically run on the pull request and merge of the PR.
- You can monitor the WF in the Git Actions

**Additional files Configuration for the deplyoment**
- There are 2 additional repo i.e IAC_Pulumi and Serverless_Lamda for the deployment of the code. 
- The API can be tested using the Postman.
- Project works on latest LTS (Long-Term Support) version.

**Common issues encounter**
- Please fork the repository at your end. Add/update the correct enviornment variables according to your requirement.
- There intotal 10 secret variables with descriptive names which are passed to the repository WF which are intun passed to 
  the runners.
- Correct .env and Configuration files. below is the sample .env file
	**DB_HOST**='127.0.0.1'
	**DB_USER**='User_Name'
	**DB_PASSWORD**='Password'
	**DB_NAME**='DB_Name'
- Please enable branch Protection Rule on the main Branch

For further more details about the usage of repo please email on **ashutosh.raval@outlook.com**
