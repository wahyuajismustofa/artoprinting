(function () {
  // Cek apakah tag sudah disisipkan agar tidak ganda
  if (document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) return;

  // Buat elemen <script> untuk gtag.js
  var gtagScript = document.createElement('script');
  gtagScript.async = true;
  gtagScript.src = "https://www.googletagmanager.com/gtag/js?id=G-RTHYD0QDMC";

  // Buat elemen <script> untuk konfigurasi gtag
  var inlineScript = document.createElement('script');
  inlineScript.text = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-RTHYD0QDMC');
  `;

  // Sisipkan ke dalam <head> (sebelum </head>)
  var head = document.head || document.getElementsByTagName('head')[0];
  head.appendChild(gtagScript);
  head.appendChild(inlineScript);
})();
