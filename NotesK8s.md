# NOTES

- When Editing a deployment using kubectl cli, it automatically starts a new pod with the new properties and the old one is stopped|terminated
- Kubectl logs somePodName returns the logs printed by a pod
- Kubectl exec gives you a terminal into the pod
- Kubectl exec -it somePodName — ibn/bash
- Deleting deployment deletes replicaSet too
- Creating deployment from cli instead of typing out all the configuration options. We use config files
- kubectl apply which takes a configuration file and applies its contents
Config file defines spec specifications for a deployment, including how many replicas of the deployment. Inside the config for deployment we have config for the pod itself, like the image it’ll use
- A Pod can contain more than one container, usually because these containers are relatively tightly coupled.
- After making changes to the config file you save and do kubectl apply
- If deployment doesn’t exist this also makes it from scratch
- Services provide networking between pods (ClusterIP = default, NodePort, LoadBalancer)
- [Pod and Deployment Difference](https://stackoverflow.com/q/41325087/)

## Namespace

- Use Cases
  - Structure your components
  - Avoid conflicts between teams
  - Share services between different environments
  - Access and Resource Limits on Namespaces Level

- Characteristics
  - You can't access most resources from another Namespace
    - i.e ConfigMap (Each namespaces must define own ConfigMap when accessing the same service from neighboring namespaces even if it does have same reference)
    - Also apply to Secret (must create own)
  - Components which can't be created within a Namespace
    - Volume/Persistent Volume
    - Node

- List all resources that are bound or not to a namespace using these commands
  - kubectl api-resources --namespaced=true
  - kubectl api-resources --namespaced=false

## Config Map & Secret

- ConfigMap and Secret must already be in k8s cluster when referencing it
- Opaque type in Secret is the default for key:value pairing
  - Value must be encoded on base64

## Approaches of Creating Objects / Components

- Imperative
  - by using Kubernetes commands to create objects
- Declarative
  - by using Config yaml manifest to create objects

## Ingress NGINX

- By default, ingress-nginx is a web server that use self-signed certificate for its default HTTPS connection
  - when using the chrome-based browser just type 'thisisunsafe' inside webpage

## Server Side Rendering NextJS

- Next.JS is a web server and when fetching data using [getServerSideProps](https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering)
  for pre-rendering data, domain baseUrl & cookies must be specified in order for ingress-nginx-controller (load balancer) to verify the domain you're accessing to or else next.js(node.js internal http server) will handle the url, will assign 127.0.0.1:80 as domain and listens inside the container (next.js pod) which port doesn't exist, and won't reach the load balancer (ingress) thus resulting to `connect ECONNREFUSED 127.0.0.1:80`

- Always check the environment before doing request (in client next.js)
  - if `window` is `undefined` set domain & cookies then do server request
  - else do browser/client request (client routing)

## Commands

- Force delete a pod if not deleted by skaffold
  - `kubectl delete pod <PODNAME> --grace-period=0 --force --namespace <NAMESPACE>`
  - `kubectl delete pod --grace-period=0 --force --namespace <NAMESPACE> <PODNAME>`

## Deploy and Access the Kubernetes Dashboard
- [Setup](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/)
