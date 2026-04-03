import fetch from 'node-fetch';
import FormData from 'form-data';

const form = new FormData();
form.append('mstrUrl', 'https://example.com');
form.append('metabaseUrl', 'https://example.com');

fetch('http://localhost:5000/validate', {
    method: 'POST',
    body: form
})
.then(res => res.json())
.then(console.log)
.catch(console.error);
