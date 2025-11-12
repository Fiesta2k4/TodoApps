pipeline {
    agent any

    stages {

        stage("build BE") {

            steps {
                echo 'Building the backend project...'
                NodeJS('NodeJS-22.14') {
                    sh 'npm install'
                }
            }
        }

        stage('build FE') {
            steps {
                echo 'FE is static'
                archiveArtifacts artifacts: 'index.html, app.js', fingerprint: true
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