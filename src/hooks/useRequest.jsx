import { useState, useEffect } from 'react';
import fetch from 'isomorphic-fetch';

function getBodyParam(type, params) {
    if (type === 'JSON') return JSON.stringify(params);
    if (type === 'FORM') {
        const formData = new FormData();
        Object.keys(params).forEach(key => {
            formData.append(key, params[key]);
        });
        return formData;
    }
    return getQueryParam(params);
}

function getQueryParam(params) {
    const  p = Object.keys(params).map(key => {
        const val = params[key];
        if (Object.prototype.toString.call(val).indexOf('String') !== -1) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(val);
        }
        return encodeURIComponent(key) + '=' + encodeURIComponent(JSON.stringify(val));
    }).join('&');
    return p;
}
function getUrlParams(options) {
    const { url, method, params = {}, type} = options;
    const _m = method.toUpperCase();
    const _t = type.toUpperCase();
    const getContentType = (type) => {
        let contentType = 'application/x-www-form-urlencoded;charset=UTF-8';
        if (type === 'JSON') contentType = 'application/json;charset=UTF-8';
        if (type === 'FORM') contentType = '';
        return contentType ? { 'content-type': contentType } : {};
    };
    const _u = _m === 'GET' ? (`${url}?${getQueryParam(params)}`) : url;
    const body = _m === 'POST' ? { body: getBodyParam(_t, params) } : {}
    const headers = { ...getContentType(_t) }; // token
    return { url: _u, method: _m,  headers, ...body,}
}

function useRequest(url) {
    let [options, setOptions] = useState({
        method: "POST",
        type: 'JSON',
    });
    let [data, setData] = useState({
        totalPage: 0,
        list: []
    });
    function getData() {
        const {url, ...options} = getUrlParams(options);
        fetch(url, options)
            .then(response => {
                if (response.ok) {
                    return response.json()
                } else {
                    let err = new Error(response.statusText);
                    err.response = response;
                    throw error;
                }
            })
            .then(result => {
                if (result.success) {
                    setData(result);
                }
            });
    }
    useEffect(getData, [options, url]);
    return [data,options, setOptions];
}

export default useRequest;