pipeline {
    agent { dockerfile true }
    stages {
        stage('Check Docker') {
            steps {
                sh 'docker version'
            }
        }

        stage('Test') {
            steps {
                sh 'node --version'
                sh 'npm --version'
            }
        }

        stage('Build image') { 
            steps { 
                sh 'docker build -t myimg:${BRANCH_NAME}-${BUILD_NUMBER} -f Dockerfile .' 
            }
        }
    }
}