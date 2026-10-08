const CACHE_NAME = "rishi-music-v6";

const APP_FILES = [
    "./",
    "./index.html",
    "./style.css",
    "./app.js",
    "./manifest.json",
    "./icon-192.png",
    "./icon-512.png"
];


self.addEventListener(
    "install",
    function (event) {

        event.waitUntil(

            caches.open(
                CACHE_NAME
            ).then(
                function (cache) {

                    return cache.addAll(
                        APP_FILES
                    );
                }
            )

        );


        self.skipWaiting();
    }
);


self.addEventListener(
    "activate",
    function (event) {

        event.waitUntil(

            caches.keys().then(
                function (cacheNames) {

                    return Promise.all(

                        cacheNames.map(
                            function (cacheName) {

                                if (
                                    cacheName !==
                                    CACHE_NAME
                                ) {

                                    return caches.delete(
                                        cacheName
                                    );
                                }

                            }
                        )

                    );
                }
            )

        );


        self.clients.claim();
    }
);


self.addEventListener(
    "fetch",
    function (event) {

        /*
         * Do not intercept audio/blob URLs.
         */

        if (
            event.request.url.startsWith(
                "blob:"
            )
        ) {

            return;
        }


        event.respondWith(

            fetch(
                event.request
            ).then(
                function (response) {

                    return response;
                }
            ).catch(
                function () {

                    return caches.match(
                        event.request
                    );
                }
            )

        );
    }
);