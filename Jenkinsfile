#!groovy

// https://www.jenkins.io/doc/tutorials/create-a-pipeline-in-blue-ocean/

pipeline {
    // agent any
    agent {
        docker {
            // https://www.debian.org/releases: Bookworm = Debian 12
            // https://deb.nodesource.com hat nur node_20.x
            // image 'node:21.6.0-bookworm'
            image 'node:20.11.0-bookworm'
            // https://stackoverflow.com/questions/62330354/jenkins-pipeline-alpine-agent-apk-update-error-unable-to-lock-database-permis
            // https://stackoverflow.com/questions/42630894/jenkins-docker-how-to-control-docker-user-when-using-image-inside-command/51986870#51986870
            // https://stackoverflow.com/questions/42743201/npm-install-fails-in-jenkins-pipeline-in-docker
            args '--publish 3000:3000 --publish 5001:5000'
            // fuer "apt-get install ..."
            args '--user root:root'

            // node:...-bookworm : in /etc/passwd gibt es "node" mit uid=1000
            //args '--user 1000:1000'
        }
    }

    // Umgebungsvariable:
    //environment {
        // Cloud:
        //DB_HOST = 'unknown.amazonaws.com'
        //DB_USER = 'nobody'
        //DB_PASS = 'ChangeMe'
        //DB_POPULATE = true
    //}

    options {
      // Timeout fuer den gesamten Job
        timeout time: 60, unit: 'MINUTES'
    }

    stages {
        // Stage = Logisch-zusammengehoerige Aufgaben der Pipeline:
        // zur spaeteren Visualisierung
        stage('Init') {
            // Step = einzelne Aufgabe
            steps {
                script {
                    if (!isUnix()) {
                        error 'Unix ist erforderlich'
                    }
                }

                echo "Jenkins-Job ${env.JOB_NAME} #${env.BUILD_ID} mit Workspace ${env.WORKSPACE}"

                // Unterverzeichnisse src und test im WORKSPACE loeschen: vom letzten Build
                // Kurzform fuer: sh([script: '...'])
                sh 'rm -rf src'
                sh 'rm -rf __tests__'
                sh 'rm -rf node_modules'
                sh 'rm -rf dist'
                sh 'rm -rf .extras/doc/api'
                sh 'rm -rf .extras/doc/folien/folien.html'
                sh 'rm -rf .extras/doc/projekthandbuch/html'

                git url: 'https://github.com/Caleb-Script/auto-service.git', branch: 'main', poll: true
            }
        }

        stage('Install') {
            steps {
                sh 'id'
                sh 'cat /etc/passwd'
                sh 'echo $PATH'
                sh 'pwd'
                sh 'uname -a'
                //sh 'lsb_release -a'
                sh 'cat /etc/os-release'
                sh 'cat /etc/debian_version'

                sh 'apt-cache policy nodejs'
                sh 'apt-get install --no-install-recommends --yes --show-progress gcc=4:12.2.0-3 g++=4:12.2.0-3 make=4.3-4.1 python3.11-minimal=3.11.2-6'
                sh 'apt-get install --no-install-recommends --yes --show-progress ca-certificates=20230311 curl=7.88.1-10+deb12u5 gnupg=2.2.40-1.1'
                sh 'apt-get update --yes'
                sh 'apt-get upgrade --yes'
                sh 'python3 --version'

                sh 'mkdir -p /etc/apt/keyrings'
                sh 'curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg'
                sh 'echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list'
                sh 'apt-get update'
                sh 'apt-get install nodejs --no-install-recommends --yes --show-progress'
                sh 'apt-cache policy nodejs'

                sh 'node --version'
                sh 'npm i -g npm'
                sh 'npm --version'

                script {
                    if (!fileExists("${env.WORKSPACE}/package.json")) {
                        error "package.json ist *NICHT* in ${env.WORKSPACE} vorhanden"
                    }
                }

                // /var/jenkins_home ist das Homedirectory vom User "jenkins"
                // /var/jenkins_home/workspace/auto (siehe "pwd" oben)
                sh 'cat package.json'

                // Konfigurationsverzeichnis /root/.npm
                sh 'npm ci --no-fund --no-audit'
            }
        }

        stage('Compile') {
            steps {
                sh 'npx tsc --version'
                // TODO Warum funktioniert npx nicht?
                sh './node_modules/.bin/tsc'
            }
        }

        stage('Test, Codeanalyse, Security, Dok.') {
            steps {
                parallel(
                    'Test': {
                        echo 'TODO: Rechnername/IP-Adresse des DB-Servers fuer Tests konfigurieren'
                        //sh 'npm run test:coverage'
                    },
                    // 'ESLint': {
                    //     sh 'npx eslint --version'
                    //     sh 'npm run eslint'
                    // },
                    'Security Audit': {
                        sh 'npm audit --omit=dev'
                    },
                    'AsciiDoctor': {
                        sh 'npx asciidoctor --version'
                        sh 'npm run asciidoctor'
                    },
                    'reveal.js': {
                        sh 'npx asciidoctor-revealjs --version'
                        sh 'npm run revealjs'
                    },
                    'TypeDoc': {
                        sh 'npx typedoc --version'
                        sh 'npm run typedoc'
                    }
                )
            }

            post {
                always {
                  echo 'TODO: Links fuer Coverage und TypeDoc'
                  //publishHTML target : [
                  //  reportDir: 'coverage',
                  //  reportFiles: 'index.html',
                  //  reportName: 'Coverage (Istanbul)',
                  //  reportTitles: 'Coverage'
                  //]

                  publishHTML (target : [
                      reportDir: '.extras/doc/projekthandbuch/html',
                      reportFiles: 'projekthandbuch.html',
                      reportName: 'Projekthandbuch',
                      reportTitles: 'Projekthandbuch'
                  ])

                  publishHTML target : [
                      reportDir: '.extras/doc/folien',
                      reportFiles: 'folien.html',
                      reportName: 'Folien (reveal.js)',
                      reportTitles: 'reveal.js'
                  ]

                  publishHTML target : [
                      reportDir: '.extras/doc/api',
                      reportFiles: 'index.html',
                      reportName: 'TypeDoc',
                      reportTitles: 'TypeDoc'
                  ]
                }

                success {
    script {
        if (fileExists("${env.WORKSPACE}/auto.zip")) {
            sh 'rm auto.zip'
        }
    }
    // Das Zip-Archiv wird jetzt erstellt
    dir('dist') {
        zip "${env.WORKSPACE}/auto.zip"
was jetzt?!?

    }
    // jobs/auto/builds/.../archive/auto.zip
    archiveArtifacts 'auto.zip'
}
            }
        }

        stage('Docker Image bauen') {
            steps {
                echo 'TODO: Docker-Image bauen und veroeffentlichen'
                // sh 'docker buildx build --tag juergenzimmermann/auto:2024.04.0 .'
            }
        }

        stage('Deployment fuer Kubernetes') {
            steps {
                echo 'TODO: Deployment fuer Kubernetes mit z.B. Ansible, Terraform'
            }
        }
    }
}
