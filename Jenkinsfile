pipeline {
  agent { label 'Docker' }
  options { timestamps() }
  parameters {
    booleanParam(name: 'PUSH', defaultValue: false, description: 'Push image lên registry?')
  }
  environment {
    IMAGE = 'fiesta2k4/todoapp'
    TAG   = "${env.BRANCH_NAME}-${env.BUILD_NUMBER}"
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Build Docker image') {
      steps {
        sh 
          docker build -t $IMAGE:$TAG -f Dockerfile .
          docker images | grep "$IMAGE" || exit 1
      }
    }

    stage('Smoke test (optional)') {
      steps {
        sh 
          # Lập mạng test + MongoDB
          docker network create ci-testnet || true
          docker run -d --rm --name mongo \
            --network ci-testnet \
            -e MONGO_INITDB_ROOT_USERNAME=root \
            -e MONGO_INITDB_ROOT_PASSWORD=example \
            mongo:6

          # Chạy app với MONGODB_URI giống Dockerfile (đã có ENV default, ở đây đặt lại cho chắc)
          docker run -d --rm --name todoapp \
            --network ci-testnet \
            -e MONGODB_URI="mongodb://root:example@mongo:27017/todos?authSource=admin" \
            $IMAGE:$TAG

          # Đợi app khởi động một chút rồi kiểm tra log
          sleep 5
          docker logs --tail=100 todoapp || true

          # Dọn dẹp
          docker rm -f todoapp || true
          docker rm -f mongo || true
          docker network rm ci-testnet || true
        
      }
    }

    stage('Login & Push (if selected)') {
      when { expression { return params.PUSH } }
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'dockerhub-creds',
          usernameVariable: 'DOCKER_USER',
          passwordVariable: 'DOCKER_PASS'
        )]) {
          sh 
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
            docker push $IMAGE:$TAG
          
        }
      }
    }
  }

  post {
    always {
      sh 'docker logout || true'
    }
  }
}
