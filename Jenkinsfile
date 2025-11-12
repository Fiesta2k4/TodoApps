pipeline {
  agent { dockerfile true }
  environment {
    IMAGE = 'f135t4/my-todo-app'
    TAG   = '1.0'
  }
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
        sh '''
          docker build -t $IMAGE:$TAG -f Dockerfile .
          docker image ls $IMAGE:$TAG
        '''
      }
    }
    stage('Login & Push') {
       steps {
            withCredentials([usernamePassword(
                credentialsId: 'dockerhub-creds',
                usernameVariable: 'DOCKER_USER',
                passwordVariable: 'DOCKER_PASS'
        )]) {
        sh '''
          echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
          docker push $IMAGE:$TAG
          docker logout || true
        '''
        }
      }
    }

    stage('Time') {
      steps {
        echo 'Bay gio la 4h57 phut chieu'
      }
    }
  }
}
