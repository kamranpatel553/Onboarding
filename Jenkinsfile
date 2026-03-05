pipeline {
    agent any

    environment {
        CAPROVER_APP_NAME = 'onboarding'
        PROJECT_PATH      = 'client'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Create deploy.tar') {
            steps {
                dir("${PROJECT_PATH}") {
                    sh '''
                        if [ -f "dockerfile" ] && [ ! -f "Dockerfile" ]; then
                            cp dockerfile Dockerfile
                        fi

                        tar -cvf deploy.tar \
                            captain-definition \
                            Dockerfile \
                            nginx.conf \
                            package*.json \
                            vite.config.js \
                            tailwind.config.js \
                            postcss.config.js \
                            eslint.config.js \
                            index.html \
                            public \
                            src
                    '''
                }
            }
        }

        stage('Deploy to CapRover') {
            steps {
                withCredentials([
                    string(credentialsId: 'caprover-server-url', variable: 'CAPROVER_URL'),
                    string(credentialsId: 'CAPROVER_PASSWORD', variable: 'CAPROVER_PASSWORD')
                ]) {
                    sh '''#!/bin/bash
                        set -e

                        # Login and get token
                        TOKEN=$(curl -s -X POST \
                            "${CAPROVER_URL}/api/v2/login" \
                            -H "Content-Type: application/json" \
                            -d "{\\"password\\": \\"${CAPROVER_PASSWORD}\\"}" \
                            | grep -o '"token":"[^"]*"' \
                            | cut -d'"' -f4)

                        echo "Login successful"

                        # Deploy tar to CapRover
                        RESPONSE=$(curl -s -X POST \
                            "${CAPROVER_URL}/api/v2/user/apps/appData/${CAPROVER_APP_NAME}" \
                            -H "x-captain-auth: ${TOKEN}" \
                            -H "x-namespace: captain" \
                            -F "sourceFile=@$(pwd)/client/deploy.tar")

                        echo "CapRover Response: ${RESPONSE}"

                        # Check for success
                        echo "${RESPONSE}" | grep -q '"status":100' && echo "✅ Deploy triggered!" || (echo "❌ Deploy failed: ${RESPONSE}" && exit 1)
                    '''
                }
            }
        }
    }

    post {
        always {
            node('built-in') {
                cleanWs()
            }
        }
        success {
            echo "✅ Deployed successfully!"
        }
        failure {
            echo "❌ Deployment failed!"
        }
    }
}
