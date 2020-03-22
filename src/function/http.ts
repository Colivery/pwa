import {st} from "springtype/core";

export const request = async (method: 'PUT' | 'GET' | 'POST', url: string, header: {[headerName: string]: string } = {}, body?: string): Promise<string> => {
    return new Promise((resolve, reject) => {

        // 1. Create a new XMLHttpRequest object
        const xhr = new XMLHttpRequest();

        // 2.0 Configure it: GET-request for the URL /article/.../load
        xhr.open(method, url);

        // 2.1 Set header
        for (const headerName of Object.keys(header)) {
            xhr.setRequestHeader(headerName, header[headerName]);
        }

        // 3. Send the request over the network
        xhr.send(body);

        // 4. This will be called after the response is received
        xhr.onload = () => {
            st.debug(`Request ${method} ${url} ${xhr.status}: ${xhr.statusText}`);
            if (xhr.status === 200) {
                const response = xhr.responseText;
                st.debug(`Request ${method} ${url}`, response);
                resolve(response);
            } else {
                reject({status: xhr.status, message: xhr.responseText});
            }
        };

        xhr.onerror = () => {
            st.debug(`Request ${method} ${url} error ${xhr.status}: ${xhr.statusText}`);
            reject({status: xhr.status, message: xhr.responseText});
        }
    });
};