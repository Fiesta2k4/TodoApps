pipeline {
    agent any

    stages {

        stage('webhooks') {
            steps {
                echo 'Testing Webhooks...'
                echo 'Webhooks configured successfully.'
            }
        }


        stage("build BE") {

            steps {
                echo 'Building the backend project...'
                nodejs('NodeJS-22.14') {
                    sh 'npm install'
                }
            }
        }

        stage('build FE') {
            steps {
                echo 'FE is static'
                archiveArtifacts artifacts: 'index.html, app.js', 'theme.css', fingerprint: true
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