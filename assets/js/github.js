if (
  location.hostname === "localhost" ||
  location.hostname === "127.0.0.1" ||
  location.hostname.startsWith("192.168.")
) {
  console.log("Sedang di localhost, fungsi redirect khusus github page tidak dijalankan");
} else {

//redirect khusus github page
(function redirectToWWW() {
  const hostname = window.location.hostname;
  
  if (!hostname.startsWith('www.') && !/^localhost$|^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    const newHostname = 'www.' + hostname;
    const newUrl = window.location.protocol + '//' + newHostname + window.location.pathname + window.location.search + window.location.hash;
    window.location.replace(newUrl);
  }
})();
if (location.protocol === 'http:') {
  location.href = 'https://' + location.hostname + location.pathname + location.search + location.hash;
}

}
