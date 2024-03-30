
export default function handler(request, response) {
  
  const query = request.query;

  let title = 'Codeit | Mobile code editor connected to Git';

  if (query.url) {
    
    // parse URL
    let url = query.url.replace('https://code.gzod01.fr/', '')
                       .replace('https://dev.code.gzod01.fr/', '')
                       .replace('https://github.com/', '')
                       .replace('https:/github.com/', '');
        
    let [user, repo] = url.split('/');
    
    if (user && repo) {
      
      if (repo.endsWith('.git')) {
        
        repo = repo.slice(0, -('.git'.length));
        
      }
      
      const repoName = user + '/' + repo.split(':')[0];
      
      if (url.endsWith('.html') ||
          url.endsWith('.svg')) {
        
        title = 'Run ' + repoName + ' on Codeit';
      
      } else {
        
        title = repoName + ' on Codeit';
        
      }
      
    }
    
  }



const html = `
<!DOCTYPE html>
<html style="background: #313744" translate="no">
<head>
  
  <title>Codeit</title>

  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover,shrink-to-fit=no">

  <meta name="mobile-web-app-capable" content="yes">
  <meta name="theme-color" content="#313744">

  <meta name="apple-mobile-web-app-status-bar-style" content="#313744">
  <meta name="apple-mobile-web-app-title" content="Codeit">

  <meta charset="utf-8">
  <meta name="description" content="">
  
  <meta property="og:title" content="`+ title +`">
  <meta property="og:description" content="">
  <meta property="og:url" content="https://code.gzod01.fr">
  <meta property="og:image" content="https://code.gzod01.fr/images/banner-og.png">
  <meta property="og:type" content="video.other">
  <meta property="og:site_name" content="Codeit">
  <meta property="og:video:url" content="https://code.gzod01.fr/api/link?url=`+ query.url +`">
  <meta property="og:video:secure_url" content="https://code.gzod01.fr/api/link?url=`+ query.url +`">
  <meta property="og:video:type" content="text/html">
  <meta property="og:video:width" content="1280">
  <meta property="og:video:height" content="720">
  
  <meta property="twitter:title" content="`+ title +`">
  <meta property="twitter:site" content="@codeitcodes">
  <meta name="twitter:card" content="player">
  <meta property="twitter:domain" content="https://code.gzod01.fr/">
  <meta name="twitter:description" content="">
  <meta name="twitter:image" content="https://code.gzod01.fr/images/banner-og.png">
  <meta name="twitter:player" content="https://code.gzod01.fr/api/link?url=`+ query.url +`">
  <meta name="twitter:player:stream:content_type" content="text/html">
  <meta name="twitter:player:width" content="800">
  <meta name="twitter:player:height" content="600">
  
  <link rel="alternate" type="application/json+oembed" href="https://code.gzod01.fr/api/oembed?url=`+ query.url +`&format=json" title="`+ title +`">
  
  <meta name="referrer" content="default">
  <meta name="keywords" content="code editor, version control tools, source code versioning, source code management tools, python, jquery demo, html, git, how to, bootstrap, jquery, javascript, javascript tutorial, javascript tutorial for beginners, javascript programming, html web form, create form in html, responsive web design, html web design, html design, responsive website development, html5 tutorial, html5 css3, html5 development, web design software, web development software, git tutorial, git howto, git repository, git command, git source code, top programming languages to learn, best programming language, best computer language, open source, open source code, open source applications, source code editor, software development tools, development tool, software developer tools list, programmer tool, web application development software">
  <link rel="canonical" href="https://code.gzod01.fr/">
  <meta name="next-head-count" content="24">
  <meta name="robots" content="all">
  
  <link rel="iframely player" type="text/html"
        href="https://code.gzod01.fr/api/link?url=`+ query.url +`"
        media="(aspect-ratio: 1280/720)"/>
  
  <link rel="shortcut icon" href="https://code.gzod01.fr/icons/android-app-512.png">
  <link rel="apple-touch-icon" href="https://code.gzod01.fr/icons/iphone-app-180.png">
  
</head>
<body>

<script src="/api-link-parser.js"></script>

<script>

// decode link

const url = new URL(window.location.href).searchParams;
  
let link = url.get('url');

const notLiveView = (url.get('live') === 'false' || url.get('l') === 'f');

const isDev = (window.location.hostname === 'dev.code.gzod01.fr');


if (link && link.startsWith('https://code.gzod01.fr/api/link?url=')) {
  
  link = link.replace('https://code.gzod01.fr/api/link?url=', 'https://code.gzod01.fr/');
  
}


if (link && link.includes('https:/github.com')) {
  
  link = link.replace('https:/github.com', 'https://github.com');
  
}


if (link && !link.startsWith('https://code.gzod01.fr')
    && !link.startsWith('https://dev.code.gzod01.fr')) {
  
  if (!isDev) link = 'https://code.gzod01.fr/' + link;
  else link = 'https://dev.code.gzod01.fr/' + link;
  
}


if (link && link.startsWith('https://code.gzod01.fr/github.com/')) {
  
  link = link.replace('https://code.gzod01.fr/github.com/', 'https://code.gzod01.fr/https://github.com/');
  
}

if (link && link.startsWith('https://dev.code.gzod01.fr/github.com/')) {
  
  link = link.replace('https://dev.code.gzod01.fr/github.com/', 'https://dev.code.gzod01.fr/https://github.com/');
  
}


if (link && notLiveView) {
  
  link += '?live=false';
  
}

if (link) {
  
  const resp = decodeLink(link);

  // redirect to decoded URL
  window.location.replace(resp);
  
} else {
  
  window.location.replace(window.location.origin);
  
}

</script>

</body>
</html>
`;



  response.status(200).send(html);
  
}
