# Project Setup

## Steps in creating nodejs microservices w/ TS, Docker, Kubernetes, Skaffold

- Create package.json, install dependencies that you will use
- Initialize tsconfig `tsc --init`
- Write Dockerfile
- Create src/index.ts to run project
- Build image, push to docker hub (skaffold will look at docker hub for image Initialization)
- Write K8s file for deployment, service, config, or secret
- Update skaffold.yml to do file sync for each service (microservice)
- Write k8s file for Database deployment, service
