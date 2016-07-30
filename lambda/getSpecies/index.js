'use strict';

const auth = "dr1146";

let http = require("http");

exports.handler = (event, context, callback) => {
    let basics = false,
        writing = false,
        loaded = 0,
        expected = 2;
    
    {
        let url = `http://bie.ala.org.au/ws/species/${encodeURIComponent(event.params.path.id)}.json`;
            
        http.get(url, (res) => {
            let data = "";
            
            res.on("data", (d) => { data += d; });
            res.on("end", () => {
                basics = JSON.parse(data);
                loaded++;
                
                if(loaded === expected) proceed();
            });
        });
    }
    
    {
        let url = `http://lists.ala.org.au/ws/species/${encodeURIComponent(event.params.path.id)}`;
            
        http.get(url, (res) => {
            let data = "";
            
            res.on("data", (d) => { data += d; });
            res.on("end", () => {
                writing = JSON.parse(data);
                loaded++;
                
                if(loaded === expected) proceed();
            });
        });
    }
    
    function proceed() {
        for(let org of writing) {
            if(org.dataResourceUid === auth) {
                writing = org;
                break;
            }
        }
        
        let data = {
            scientificName: basics.taxonConcept.nameString,
            content: []
        };
        
        for(let kvp of writing.kvpValues) {
            data.content.push({
                section: kvp.key,
                content: kvp.value
            });
        }
        
        context.succeed(data);
    }
};
