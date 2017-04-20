node {
  checkout scm
  withCredentials([usernamePassword(credentialsId: 'docker', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
    sh("docker login -u ${env.DOCKER_USERNAME} -p ${env.DOCKER_PASSWORD} registry.aliyuncs.com")
  }
  sh("docker build -t registry.aliyuncs.com/xiaolu-img/xiaolusys-ui:latest-k8s .")
  sh("docker push registry.aliyuncs.com/xiaolu-img/xiaolusys-ui:latest-k8s")
}

