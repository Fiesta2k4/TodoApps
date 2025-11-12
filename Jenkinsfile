pipeline {

    agent any 

    stages {

        stage("build") {

            steps {
                echo 'Building the project...'
                sh 'npm install'
            }
        }

        stage("test") {

            steps {
                echo 'Testing the project...'
            }
        }

        stage("deploy") {

            steps {
                echo 'Deploying the project...'
            }
        }
    }
}