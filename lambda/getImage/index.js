'use strict';

let http = require("http");

exports.handler = (event, context, callback) => {
    let url = `http://bie.ala.org.au/ws/species/${encodeURIComponent(event.params.path.id)}.json`;
        
    http.get(url, (res) => {
        let data = "";
        
        res.on("data", (d) => { data += d; });
        res.on("end", () => {
            data = JSON.parse(data);
            
            if(data.imageIdentifier)
                context.succeed("http://images.ala.org.au/image/proxyImageThumbnailLarge?imageId=" + data.imageIdentifier);
            else
                context.succeed("");
        });
    });
};
