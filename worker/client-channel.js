
// worker-side
// service worker/client communication channel


// update worker name when updating worker
const WORKER_NAME = 'codeit-worker-v497';


// internal paths
const INTERNAL_PATHS = {

  internal: 'https://codeit.codes/',
  internal_: 'https://dev.codeit.codes/',

  run: 'https://codeit.codes/run',
  run_: 'https://dev.codeit.codes/run',
  
  clientId: 'https://codeit.codes/worker/getLatestClientId',
  clientId_: 'https://dev.codeit.codes/worker/getLatestClientId',

}


// get path type
function getPathType(path) {

  let pathType = 'external';

  Object.entries(INTERNAL_PATHS).forEach(type => {

    if (path.startsWith(type[1])) {

      pathType = type[0].replaceAll('_', '');

    }

  });

  return pathType;

}


// worker log
function workerLog(log) {

  workerChannel.postMessage({
    message: log,
    type: 'message'
  });

}


// create worker channel
const workerChannel = new BroadcastChannel('worker-channel');


// create Response from data
function createResponse(data, type, status) {

  // create Response from data
  const response = new Response(data, {
    headers: {'Content-Type': type},
    status: status
  });

  return response;

}


// send fetch request to client
function sendRequestToClient(request) {

  return new Promise((resolve, reject) => {

    // set MIME type depending on request mode
    let mimeType = 'application/octet-stream';

    if (request.mode === 'navigate'
        || request.url.endsWith('.html')) mimeType = 'text/html';

    if (request.mode === 'script'
        || request.url.endsWith('.js')) mimeType = 'text/javascript';

    if (request.mode === 'style'
        || request.url.endsWith('.css')) mimeType = 'text/css';

    if (request.url.endsWith('.wasm')) mimeType = 'application/wasm';

    if (enableDevLogs) {
      console.warn(mimeType, request.mode, request.url);
    }


    let url = request.url;

    // append .html to url if navigating
    if (request.mode === 'navigate'
        && !url.endsWith('.html')
        && !url.endsWith('/')) url += '.html';


    // send request to client
    workerChannel.postMessage({
      url: url,
      type: 'request'
    });


    // add worker/client channel listener

    function workerListener(event) {

      // if response url matches
      if (event.data.type === 'response' &&
          event.data.url === url) {

        if (enableDevLogs) {
          console.log('[ServiceWorker] Recived response data from client', event.data);
        }

        // remove channel listener
        workerChannel.removeEventListener('message', workerListener);


        // create Response from data
        const response = createResponse(event.data.resp, mimeType, event.data.respStatus);

        if (enableDevLogs) {
          console.log('[ServiceWorker] Resolved live view request with client response', response, event.data.resp, event.data.respStatus);
        }

        // resolve promise with Response
        resolve(response);

      }

    }

    workerChannel.addEventListener('message', workerListener);

  });

}


let enableDevLogs = false;

workerChannel.addEventListener('message', (event) => {
  
  if (event.data.type === 'enableDevLogs') enableDevLogs = true;
  if (event.data.type === 'hello') workerChannel.postMessage('hello!');
  
});


// handle fetch request
function handleFetchRequest(request, event) {

  return new Promise(async (resolve, reject) => {

    // get request path type
    const pathType = getPathType(request.url);

    // if fetch originated in codeit itself
    if (pathType === 'internal'
        && (getPathType(request.referrer) !== 'run')) {

      let url = request.url;
      
      url = url.slice('?')[0];

      // append .html to url if navigating
      /*if (request.mode === 'navigate'
          && url.includes('/full')) url = url.replace('/full', '/full.html');*/

      const resp = await caches.match(url);

      // return response from cache
      resolve(resp ?? fetch(request));

    } else if (pathType === 'run'
               || (getPathType(request.referrer) === 'run')) { // if fetch originated in live view

      if (enableDevLogs) {
        console.log('[ServiceWorker] Intercepted live fetch', request.url, request);
      }

      // return response from client
      resolve(sendRequestToClient(request));

    } else if (pathType === 'clientId') { // if fetching client ID
      
      console.log(event);
      const clientId = event.clientId;
      
      // return latest client ID
      resolve(createResponse(
        clientId, 'text/plain', 200
      ));
      
    } else { // if fetch is external
      
      /*
      let resp = await fetch(request);
      
      // if fetch is an internal Git fetch
      // with an error code
      if (request.url.startsWith('https://api.github.com')
          && resp.status === 403) {
        
        console.log('[ServiceWorker] Intercepted Github API request', request);
        
        // return an identical response without the error code
        resp = new Response(resp.body, {
          headers: resp.headers,
          status: 200
        });
        
      }*/
      
      // return response from network
      //resolve(resp);
      resolve(fetch(request));

    }

  });

}


// add fetch listener
self.addEventListener('fetch', (evt) => {

  evt.respondWith(handleFetchRequest(evt.request, evt));

});

