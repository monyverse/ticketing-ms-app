import axios from 'axios'

const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    // WE ARE ON THE SERVER
    return axios.create({
      // Access Nginx service through it's namespace 
      // & controller (load balancer)
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      // set all headers that's required for nginx to verify the domain
      // you're accessing to
      headers: req.headers
    })
  } else {
    // WE MUST BE ON THE BROWSER/CLIENT
    return axios.create({
      baseUrl: '/'
      // no need to put headers, browser will handle it
    })
  }
}

export { buildClient }