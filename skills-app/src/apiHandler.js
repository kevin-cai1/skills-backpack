export default function apiHandler(...args) {
    let path, methodType, data;

    if (args.length > 2) {
        [path, methodType, data] = args;
    } else {
        [path, methodType] = args;
        data = false;
    }

    let url = 'http://localhost:5000/' + path;
    console.log('Sending to ' + url + ': ' + data);

    if (data) {
        return fetch(url, {
            method: methodType,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: data
        }).then(response => {
            console.log(response)
            console.log('response ' + response.status)
            return response.ok && response.json();
        })
            .catch(err => console.log('Error:', err));
    } else {
        return fetch(url, {
            method: methodType,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(response => {
            console.log(response)
            console.log('response ' + response.status)
            return response.ok && response.json();
        })
            .catch(err => console.log('Error:', err));
    }
}