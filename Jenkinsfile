node {
  checkout scm
  withCredentials([usernamePassword(credentialsId: 'docker', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
    sh("docker login -u ${env.DOCKER_USERNAME} -p ${env.DOCKER_PASSWORD} registry.aliyuncs.com")
  }
  sh("docker build -t registry.aliyuncs.com/xiaolu-img/xiaolusys-ui:latest .")
  sh("docker push registry.aliyuncs.com/xiaolu-img/xiaolusys-ui:latest")
  
  if (env.BRANCH_NAME == 'staging'){  
    stage('Deploy to nginx/ui-staging:'){
      build job: 'nginx/ui-staging'
    }
  }
  if (env.BRANCH_NAME == 'master'){  
    stage('Deploy to nginx/ui-master:'){
      build job: 'nginx/ui-master'
    }
  }
}

